import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface GestureDemoProps {
    onDismiss?: () => void;
    autoHideDuration?: number; // en millisecondes
}

const GestureDemo: React.FC<GestureDemoProps> = ({
    onDismiss,
    autoHideDuration = 8000,
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onDismiss?.();
        }, autoHideDuration);

        return () => clearTimeout(timer);
    }, [autoHideDuration, onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-auto" onClick={handleDismiss} />

            {/* Demo Card */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-blue-500/30 pointer-events-auto">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-full transition-colors"
                    aria-label="Close demo"
                >
                    <X className="w-5 h-5 text-gray-300" />
                </button>

                {/* Header */}
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="text-2xl">👋</span> Contrôle par Gestes
                </h2>

                {/* Instructions */}
                <div className="space-y-4 mb-6">
                    {/* Scroll Down */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500/20">
                                <span className="text-lg">👋</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Une paume ouverte</p>
                            <p className="text-sm text-gray-300">↓ Scroll vers le bas</p>
                        </div>
                    </div>

                    {/* Scroll Up */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500/20">
                                <span className="text-lg">🙌</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Deux paumes ouvertes</p>
                            <p className="text-sm text-gray-300">↑ Scroll vers le haut</p>
                        </div>
                    </div>

                    {/* Stop */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-600/20">
                                <span className="text-lg">✋</span>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-white">Aucune main visible</p>
                            <p className="text-sm text-gray-300">⏸ Scroll arrêté</p>
                        </div>
                    </div>
                </div>

                {/* Feature Highlights */}
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                    <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Caractéristiques</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                        <li>✓ Défilement fluide et naturel</li>
                        <li>✓ Caméra activée automatiquement</li>
                        <li>✓ Détection stable et responsive</li>
                    </ul>
                </div>

                {/* CTA */}
                <button
                    onClick={handleDismiss}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                    Commencer
                </button>

                {/* Footer */}
                <p className="text-xs text-gray-400 text-center mt-4">
                    La démo disparaîtra automatiquement dans quelques secondes
                </p>
            </div>
        </div>
    );
};

export default GestureDemo;
