import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface GestureDemoProps {
    onDismiss?: () => void;
    autoDismissTime?: number; // en ms
    onUserInteraction?: () => void;
}

const GestureDemo: React.FC<GestureDemoProps> = ({
    onDismiss,
    autoDismissTime = 8000,
    onUserInteraction,
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

    const steps = [
        {
            title: "👋 Une Paume Ouverte",
            description: "Montrez une main avec la paume ouverte",
            icon: "🤚",
            action: "→ Scroll vers le BAS",
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "🖐️ Deux Paumes Ouvertes",
            description: "Montrez les deux mains avec les paumes ouvertes",
            icon: "👐",
            action: "→ Scroll vers le HAUT",
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "🚫 Pas de Main",
            description: "Retirez vos mains du champ de la caméra",
            icon: "👁️",
            action: "→ Arrête le scroll",
            color: "from-green-500 to-emerald-500",
        },
    ];

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    const handleInteraction = () => {
        setIsVisible(false);
        onUserInteraction?.();
    };

    // Auto-dismiss après autoDismissTime
    useEffect(() => {
        if (isVisible) {
            autoDismissTimerRef.current = setTimeout(() => {
                handleDismiss();
            }, autoDismissTime);
        }

        return () => {
            if (autoDismissTimerRef.current) {
                clearTimeout(autoDismissTimerRef.current);
            }
        };
    }, [isVisible, autoDismissTime]);

    // Cycler à travers les étapes
    useEffect(() => {
        if (!isVisible) return;

        const stepInterval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 2000);

        return () => clearInterval(stepInterval);
    }, [isVisible, steps.length]);

    if (!isVisible) return null;

    const currentStep = steps[activeStep];

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
            {/* Fond semi-transparent */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
                onClick={handleDismiss}
            />

            {/* Contenu de la démo */}
            <div className="relative z-10 pointer-events-auto max-w-md mx-auto px-4">
                <div
                    className={`bg-gradient-to-br ${currentStep.color} rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500`}
                >
                    {/* Tête de la démo */}
                    <div className="relative bg-black/50 backdrop-blur px-6 py-8 text-center">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1" />
                            <h2 className="flex-1 text-white font-bold text-lg">Tutoriel Gestes</h2>
                            <button
                                onClick={handleDismiss}
                                className="flex-1 flex justify-end text-white/70 hover:text-white transition-colors"
                                aria-label="Fermer la démo"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p className="text-white/60 text-sm">
                            Contrôlez le scroll avec vos mains
                        </p>
                    </div>

                    {/* Corps de la démo */}
                    <div className="px-6 py-12 text-center bg-gradient-to-b from-black/20 to-black/40">
                        {/* Animation du geste */}
                        <div className="mb-8">
                            <div className="inline-block text-8xl animate-bounce transition-all duration-500">
                                {currentStep.icon}
                            </div>
                        </div>

                        {/* Titre et description */}
                        <h3 className="text-white font-bold text-2xl mb-3">
                            {currentStep.title}
                        </h3>

                        <p className="text-white/80 text-base mb-4">
                            {currentStep.description}
                        </p>

                        {/* Action */}
                        <div className="inline-block bg-white/20 backdrop-blur rounded-lg px-4 py-2 mb-6">
                            <p className="text-white font-semibold text-sm">
                                {currentStep.action}
                            </p>
                        </div>

                        {/* Indicateurs de progression */}
                        <div className="flex justify-center gap-2 mb-6">
                            {steps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full transition-all duration-500 ${index === activeStep ? "w-8 bg-white" : "w-2 bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Instructions d'interaction */}
                        <p className="text-white/60 text-xs italic">
                            Cliquez pour fermer ou attendez {Math.ceil(autoDismissTime / 1000)}s
                        </p>
                    </div>

                    {/* Boutons d'action */}
                    <div className="px-6 py-4 bg-black/40 flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-semibold"
                        >
                            Fermer
                        </button>

                        <button
                            onClick={handleInteraction}
                            className="flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-semibold"
                        >
                            Commencer
                        </button>
                    </div>
                </div>

                {/* Sous-texte informatif */}
                <div className="mt-6 text-center text-white/60 text-sm pointer-events-auto">
                    <p>Assurez-vous que votre caméra est active et bien éclairée</p>
                </div>
            </div>
        </div>
    );
};

export default GestureDemo;
