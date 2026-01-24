import { useEffect, useRef, useCallback } from "react";
import {
    initializeHandDetector,
    detectGesture,
    closeHandDetector,
    isHandDetectorReady,
    type HandDetectionResult,
} from "../services/handDetection";

interface UseGestureScrollOptions {
    downSpeed?: number; // pixels par frame au scroll vers le bas
    upSpeed?: number; // pixels par frame au scroll vers le haut
    smoothing?: number; // Facteur de lissage (0-1, 0 = instant, 1 = très lent)
    detectionInterval?: number; // Intervalle de détection en ms
    stabilityThreshold?: number; // Nombre de frames avant d'activer le scroll
    onGestureChange?: (gesture: HandDetectionResult) => void;
}

interface GestureScrollState {
    currentGesture: "none" | "one-palm" | "two-palms";
    isScrolling: boolean;
    targetVelocity: number;
    currentVelocity: number;
}

export function useGestureScroll(
    videoRef: React.RefObject<HTMLVideoElement>,
    options: UseGestureScrollOptions = {}
) {
    const {
        downSpeed = 8,
        upSpeed = 8,
        smoothing = 3,
        detectionInterval = 30, // ~33fps
        stabilityThreshold = 3,
        onGestureChange,
    } = options;

    const stateRef = useRef<GestureScrollState>({
        currentGesture: "none",
        isScrolling: false,
        targetVelocity: 0,
        currentVelocity: 0  ,
    });

    const frameCountRef = useRef(0);
    const lastGestureRef = useRef<"none" | "one-palm" | "two-palms">("none");
    const animationFrameRef = useRef<number | null>(null);
    const detectionLoopRef = useRef<NodeJS.Timeout | null>(null);

    // Effectuer le scroll avec vitesse lisse
    const updateScroll = useCallback(() => {
        const state = stateRef.current;

        // Interpoler la vélocité actuelle vers la vélocité cible avec easing exponentiel
        // Cela crée un mouvement naturel et fluide
        const velocityDiff = state.targetVelocity - state.currentVelocity;
        state.currentVelocity += velocityDiff * smoothing;

        // Appliquer le scroll si la vélocité est significative
        const VELOCITY_THRESHOLD = 1; // Seuil optimal pour fluidité
        if (Math.abs(state.currentVelocity) > VELOCITY_THRESHOLD) {
            // Arrondir pour éviter les sub-pixel scrolling
            const scrollAmount = Math.round(state.currentVelocity * 300) / 100;
            window.scrollBy(1, scrollAmount);
            state.isScrolling = true;
        } else {
            // Arrêt progressif du scroll
            state.currentVelocity *= 0.95; // Décélération progressive
            if (Math.abs(state.currentVelocity) < 0.01) {
                state.currentVelocity = 0;
                state.targetVelocity = 0;
                state.isScrolling = false;
            }
        }

        // Continuer l'animation sur chaque frame
        animationFrameRef.current = requestAnimationFrame(updateScroll);
    }, [smoothing]);

    // Boucle de détection des gestes
    const startDetectionLoop = useCallback(async () => {
        if (!videoRef.current) {
            console.error("[useGestureScroll] Pas de référence vidéo");
            return;
        }

        // Initialiser le détecteur
        try {
            console.log("[useGestureScroll] Initialisation du détecteur...");
            await initializeHandDetector();
        } catch (error) {
            console.error("[useGestureScroll] Impossible d'initialiser le détecteur de mains:", error);
            return;
        }

        if (!isHandDetectorReady()) {
            console.error("[useGestureScroll] Le détecteur n'est pas prêt");
            return;
        }

        console.log("[useGestureScroll] ✅ Détecteur prêt, démarrage de la boucle");

        detectionLoopRef.current = setInterval(async () => {
            if (!videoRef.current || !isHandDetectorReady()) return;

            try {
                const result = await detectGesture(videoRef.current);

                // Appeler le callback si fourni
                onGestureChange?.(result);

                // Vérifier la stabilité du geste
                if (result.gesture === lastGestureRef.current) {
                    frameCountRef.current++;
                } else {
                    frameCountRef.current = 0;
                    lastGestureRef.current = result.gesture;
                    console.log(`[useGestureScroll] Nouveau geste: ${result.gesture} (${result.handsDetected} main(s))`);
                }

                // Activer le scroll si le geste est stable
                if (frameCountRef.current >= stabilityThreshold) {
                    const state = stateRef.current;
                    state.currentGesture = result.gesture;

                    switch (result.gesture) {
                        case "one-palm":
                            state.targetVelocity = downSpeed; // Scroll vers le bas
                            console.log(`[useGestureScroll] set targetVelocity=${state.targetVelocity} for one-palm`);
                            break;
                        case "two-palms":
                            state.targetVelocity = -upSpeed; // Scroll vers le haut
                            console.log(`[useGestureScroll] set targetVelocity=${state.targetVelocity} for two-palms`);
                            break;
                        case "none":
                        default:
                            state.targetVelocity = 0; // Arrêter le scroll
                            console.log(`[useGestureScroll] set targetVelocity=0 (none)`);
                            break;
                    }
                }
            } catch (error) {
                console.error("[useGestureScroll] Erreur lors de la détection du geste:", error);
            }
        }, detectionInterval);
    }, [videoRef, onGestureChange, detectionInterval, stabilityThreshold]);

    // Initialisation et nettoyage
    useEffect(() => {
        startDetectionLoop();
        updateScroll();

        return () => {
            if (detectionLoopRef.current) {
                clearInterval(detectionLoopRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            closeHandDetector();
        };
    }, [startDetectionLoop, updateScroll]);

    return stateRef.current;
}

/**
 * Hook pour accéder à l'état du geste sans contrôler le scroll
 */
export function useGestureDetection(
    videoRef: React.RefObject<HTMLVideoElement>,
    options: Omit<UseGestureScrollOptions, "downSpeed" | "upSpeed"> = {}
) {
    const gestureRef = useRef<HandDetectionResult>({
        handsDetected: 0,
        gesture: "none",
        confidence: 0,
        timestamp: Date.now(),
    });

    const { detectionInterval = 30, onGestureChange } = options;

    useEffect(() => {
        if (!videoRef.current) return;

        const startDetection = async () => {
            try {
                await initializeHandDetector();
            } catch (error) {
                console.error("Impossible d'initialiser le détecteur de mains:", error);
                return;
            }

            if (!isHandDetectorReady()) return;

            const loopId = setInterval(async () => {
                if (!videoRef.current || !isHandDetectorReady()) return;

                try {
                    const result = await detectGesture(videoRef.current);
                    gestureRef.current = result;
                    onGestureChange?.(result);
                } catch (error) {
                    console.error("Erreur lors de la détection du geste:", error);
                }
            }, detectionInterval);

            return () => {
                clearInterval(loopId);
                closeHandDetector();
            };
        };

        const cleanupPromise = startDetection();
        return () => {
            cleanupPromise.then((cleanup) => cleanup?.());
        };
    }, [videoRef, detectionInterval, onGestureChange]);

    return gestureRef.current;
}
