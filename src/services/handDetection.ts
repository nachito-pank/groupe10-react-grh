import {
    FilesetResolver,
    HandLandmarker,
    type Hand,
} from "@mediapipe/tasks-vision";

export interface HandDetectionResult {
    handsDetected: number;
    gesture: "none" | "one-palm" | "two-palms";
    confidence: number;
    landmarks?: Hand[];
    timestamp: number;
}

let handLandmarker: HandLandmarker | null = null;
let isInitializing = false;
let initPromise: Promise<void> | null = null;

const PALM_THRESHOLD = 0.05; // Seuil de distance pour déterminer si la paume est ouverte

/**
 * Initialise le détecteur de mains MediaPipe
 */
export async function initializeHandDetector(): Promise<void> {
    if (handLandmarker) return;
    if (initPromise) return initPromise;

    isInitializing = true;
    initPromise = (async () => {
        try {
            console.log("[HandDetector] Initialisation en cours...");

            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm"
            );

            console.log("[HandDetector] Ressources WASM chargées");

            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                },
                runningMode: "VIDEO",
                numHands: 2,
            });

            console.log("[HandDetector] ✅ Initialisé avec succès");
        } catch (error) {
            console.error("[HandDetector] ❌ Erreur d'initialisation:", error);
            handLandmarker = null;
            throw error;
        } finally {
            isInitializing = false;
        }
    })();

    return initPromise;
}

/**
 * Détecte les gestes de la main dans une vidéo
 * @param videoElement - L'élément vidéo contenant le flux de la caméra
 * @returns Le résultat de la détection
 */
export async function detectGesture(
    videoElement: HTMLVideoElement
): Promise<HandDetectionResult> {
    if (!handLandmarker) {
        if (isInitializing) {
            await initPromise;
            if (!handLandmarker) {
                return {
                    handsDetected: 0,
                    gesture: "none",
                    confidence: 0,
                    timestamp: Date.now(),
                };
            }
        } else {
            await initializeHandDetector();
            if (!handLandmarker) {
                return {
                    handsDetected: 0,
                    gesture: "none",
                    confidence: 0,
                    timestamp: Date.now(),
                };
            }
        }
    }

    try {
        // Vérifier que la vidéo est prête
        if (videoElement.readyState < 2) {
            return {
                handsDetected: 0,
                gesture: "none",
                confidence: 0,
                timestamp: Date.now(),
            };
        }

        const result = handLandmarker.detectForVideo(
            videoElement,
            performance.now()
        );
        const handsDetected = result.landmarks.length;

        if (handsDetected === 0) {
            return {
                handsDetected: 0,
                gesture: "none",
                confidence: 0,
                landmarks: result.handedness,
                timestamp: Date.now(),
            };
        }

        // Analyser si les paumes sont ouvertes
        const palmOpenStates = result.landmarks.map((landmarks) =>
            isPalmOpen(landmarks)
        );

        // Logging détaillé pour debug
        try {
            console.log(`[HandDetector] handsDetected=${handsDetected} palmsOpen=${palmOpenStates.map(s => s ? 1 : 0).join(',')}`);
        } catch (e) {
            // silent
        }

        let gesture: "none" | "one-palm" | "two-palms" = "none";
        let confidence = 0;

        if (handsDetected === 1 && palmOpenStates[0]) {
            gesture = "one-palm";
            confidence = 0.95;

        } else if (
            handsDetected === 2 &&
            palmOpenStates[0] &&
            palmOpenStates[1]
        ) {
            gesture = "two-palms";
            confidence = 0.95;
        }

        return {
            handsDetected,
            gesture,
            confidence,
            landmarks: result.landmarks,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error("Erreur lors de la détection du geste:", error);
        return {
            handsDetected: 0,
            gesture: "none",
            confidence: 0,
            timestamp: Date.now(),
        };
    }
}

/**
 * Vérifie si une paume est ouverte
 * Basé sur la distance entre les doigts et le centre de la paume
 */
function isPalmOpen(landmarks: Array<{ x: number; y: number; z: number }>): boolean {
    if (landmarks.length < 21) return false;

    // Points clés:
    // 0: poignet
    // 5: base index
    // 9: base majeur
    // 13: base annulaire
    // 17: base auriculaire
    // 4: bout pouce
    // 8: bout index
    // 12: bout majeur
    // 16: bout annulaire
    // 20: bout auriculaire

    const wrist = landmarks[0];
    const middleFingerBase = landmarks[9];

    // Calculer les positions des bouts de doigts
    const fingerTips = [
        landmarks[4],  // pouce
        landmarks[8],  // index
        landmarks[12], // majeur
        landmarks[16], // annulaire
        landmarks[20], // auriculaire
    ];

    const fingerBases = [
        landmarks[2],  // base pouce
        landmarks[5],  // base index
        landmarks[9],  // base majeur
        landmarks[13], // base annulaire
        landmarks[17], // base auriculaire
    ];

    // Calculer la distance moyenne entre les bouts et les bases
    let totalDistance = 0;
    for (let i = 0; i < fingerTips.length; i++) {
        const tip = fingerTips[i];
        const base = fingerBases[i];
        const dx = tip.x - base.x;
        const dy = tip.y - base.y;
        const dz = tip.z - base.z;
        totalDistance += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    const averageDistance = totalDistance / fingerTips.length;

    // Calculer la distance entre le poignet et le milieu de la paume
    const palmSize = Math.sqrt(
        Math.pow(middleFingerBase.x - wrist.x, 2) +
        Math.pow(middleFingerBase.y - wrist.y, 2) +
        Math.pow(middleFingerBase.z - wrist.z, 2)
    );

    // Déterminer si la paume est ouverte en comparant les distances
    // Calculer ratio distance doigts / taille paume
    const ratio = palmSize > 0 ? averageDistance / palmSize : 0;

    // Seuils heuristiques :
    // - ratio > 0.6 signifie doigts largement étendus par rapport à la paume
    // - sinon, si la paume est grande en absolu, accepter avgDistance > 0.04
    const palmIsOpen = ratio > 0.6 || averageDistance > 0.04;

    // Logs pour aider au debugging (affichés dans la console navigateur)
    try {
        console.log(`[HandDetector:isPalmOpen] avgDistance=${averageDistance.toFixed(4)} palmSize=${palmSize.toFixed(4)} ratio=${ratio.toFixed(3)} -> open=${palmIsOpen}`);
    } catch (e) {
        // silent
    }

    return palmIsOpen;
}

/**
 * Arrête le détecteur de mains et libère les ressources
 */
export function closeHandDetector(): void {
    if (handLandmarker) {
        handLandmarker.close();
        handLandmarker = null;
    }
}

/**
 * Obtient l'état actuel du détecteur
 */
export function isHandDetectorReady(): boolean {
    return handLandmarker !== null && !isInitializing;
}
