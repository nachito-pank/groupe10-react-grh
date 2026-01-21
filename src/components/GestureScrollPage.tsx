import React, { useRef, useState, useEffect } from "react";
import GestureAnimation from "./GestureAnimation";
import GestureDemo from "./GestureDemo";
import { useGestureScroll } from "../hooks/useGestureScroll";
import type { HandDetectionResult } from "../services/handDetection";

interface GestureScrollPageProps {
    showDemo?: boolean;
    downSpeed?: number;
    upSpeed?: number;
    children?: React.ReactNode;
    className?: string;
}

const GestureScrollPage: React.FC<GestureScrollPageProps> = ({
    showDemo = true,
    downSpeed = 25,
    upSpeed = 25,
    children,
    className = "",
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [showDemoOverlay, setShowDemoOverlay] = useState(showDemo);
    const [currentGesture, setCurrentGesture] = useState<HandDetectionResult>({
        handsDetected: 0,
        gesture: "none",
        confidence: 0,
        timestamp: Date.now(),
    });
    const [cameraPermission, setCameraPermission] = useState<
        "granted" | "denied" | "pending"
    >("pending");
    const [cameraActive, setCameraActive] = useState(false);

    // Demander l'accès à la caméra
    useEffect(() => {
        const requestCamera = async () => {
            try {
                console.log("[Camera] Demande d'accès...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: "user",
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;

                    // Attendre que la vidéo soit prête
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play().then(() => {
                            console.log("[Camera] ✅ Caméra active et flux en cours");
                            setCameraPermission("granted");
                            setCameraActive(true);
                        }).catch(err => {
                            console.error("[Camera] Erreur play:", err);
                        });
                    };
                }
            } catch (error) {
                console.error("[Camera] ❌ Erreur lors de l'accès à la caméra:", error);
                setCameraPermission("denied");
            }
        };

        requestCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (
                    videoRef.current.srcObject as MediaStream
                ).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    // Utiliser le hook de contrôle de scroll
    useGestureScroll(videoRef, {
        downSpeed,
        upSpeed,
        smoothing: 2,
        detectionInterval: 0.1,
        stabilityThreshold: 1,
        onGestureChange: setCurrentGesture,
    });

    const handleDemoDismiss = () => {
        setShowDemoOverlay(false);
    };

    const handleUserInteraction = () => {
        setShowDemoOverlay(false);
    };

    return (
        <div
            className={`relative w-full min-h-screen overflow-x-hidden ${className}`}
        >
            {/* Animation Three.js en arrière-plan */}
            <div className="fixed inset-0 z-0">
                <GestureAnimation gesture={currentGesture} showDebug={false} />
            </div>

            {/* Vidéo caméra (cachée) */}
            <video
                ref={videoRef}
                className="hidden"
                autoPlay
                playsInline
                muted
            />

            {/* Contenu principal */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Statut de la caméra */}
            {cameraPermission === "denied" && (
                <div className="fixed bottom-4 right-4 z-40 bg-red-500/90 backdrop-blur text-white p-4 rounded-lg max-w-sm">
                    <p className="font-semibold mb-1">Caméra non accessible</p>
                    <p className="text-sm">
                        Veuillez autoriser l'accès à la caméra pour utiliser le contrôle par
                        gestes.
                    </p>
                </div>
            )}

            {/* Indicateur du geste actif */}
            {cameraActive && currentGesture.gesture !== "none" && (
                <div className="fixed top-4 right-4 z-40 animate-pulse">
                    <div className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        {currentGesture.gesture === "one-palm" && "📜 Scroll vers le bas"}
                        {currentGesture.gesture === "two-palms" && "📜 Scroll vers le haut"}
                    </div>
                </div>
            )}

            {/* Démonstration automatique */}
            {showDemoOverlay && (
                <GestureDemo
                    onDismiss={handleDemoDismiss}
                    onUserInteraction={handleUserInteraction}
                    autoDismissTime={8000}
                />
            )}

            {/* Info - Amélioration responsive pour appareils mobiles */}
            {cameraActive && (
                <div className="fixed bottom-4 left-4 z-40 text-white/60 text-xs max-w-xs hidden sm:block">
                    <p>💡 Assurez-vous d'être bien éclairé pour une meilleure détection</p>
                </div>
            )}
        </div>
    );
};

export default GestureScrollPage;
