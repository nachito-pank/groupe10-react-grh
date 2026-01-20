import React from 'react';
import { useHandGestureScroll } from './useHandGestureScroll';
import GestureDemo from '../components/GestureDemo';
import GestureVisualizerThree from '../components/GestureVisualizerThree';

/**
 * Exemple d'utilisation du système de contrôle par gestes
 * 
 * Ce composant montre comment intégrer le système de contrôle par gestes
 * dans une application React
 */

interface ExampleGestureComponentProps {
    showDemo?: boolean;
    showVisualizer?: boolean;
}

export const ExampleGestureComponent: React.FC<ExampleGestureComponentProps> = ({
    showDemo = true,
    showVisualizer = true,
}) => {
    const [isCameraActive, setIsCameraActive] = React.useState(false);
    const [showDemoModal, setShowDemoModal] = React.useState(showDemo);

    const {
        isInitialized,
        isLoading,
        error,
        detectionResult,
        startDetection,
        stopDetection,
        videoRef,
    } = useHandGestureScroll({
        enabled: true,
        showDebug: false,
        maxVelocity: 5,
        onDetectionChange: (result) => {
            console.log('Gesture detected:', result);
        },
    });

    const handleEnableCamera = async () => {
        try {
            await startDetection();
            setIsCameraActive(true);
        } catch (err) {
            console.error('Failed to enable camera:', err);
        }
    };

    const handleDisableCamera = () => {
        stopDetection();
        setIsCameraActive(false);
    };

    return (
        <div className="w-full">
            {/* Demo Modal */}
            {showDemoModal && (
                <GestureDemo
                    onDismiss={() => setShowDemoModal(false)}
                    autoHideDuration={8000}
                />
            )}

            {/* Main Container */}
            <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Contrôle par Gestes</h2>

                    {/* Status Display */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-700/50 rounded p-4">
                            <p className="text-sm text-gray-400 mb-1">Statut</p>
                            <p className="text-white font-semibold">
                                {isLoading ? '⏳ Initialisation...' : isInitialized ? '✓ Prêt' : '✗ Erreur'}
                            </p>
                        </div>
                        <div className="bg-slate-700/50 rounded p-4">
                            <p className="text-sm text-gray-400 mb-1">Caméra</p>
                            <p className="text-white font-semibold">
                                {isCameraActive ? '🎥 Active' : '📴 Inactive'}
                            </p>
                        </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={isCameraActive ? handleDisableCamera : handleEnableCamera}
                            disabled={!isInitialized || isLoading}
                            className={`flex-1 px-4 py-2 rounded font-semibold transition ${isCameraActive
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isCameraActive ? 'Désactiver Caméra' : 'Activer Caméra'}
                        </button>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-900/30 border border-red-700 rounded p-4 text-red-300 text-sm">
                            ⚠️ {error}
                        </div>
                    )}
                </div>

                {/* Detection Stats */}
                {isCameraActive && detectionResult && (
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Informations de Détection</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-700/50 rounded p-3">
                                <p className="text-xs text-gray-400 mb-1">Mains</p>
                                <p className="text-2xl font-bold text-cyan-400">
                                    {detectionResult.handsDetected}
                                </p>
                            </div>

                            <div className="bg-slate-700/50 rounded p-3">
                                <p className="text-xs text-gray-400 mb-1">Main Gauche</p>
                                <p className="text-sm font-semibold text-white">
                                    {detectionResult.leftPalmOpen ? '✋ Ouverte' : '✊ Fermée'}
                                </p>
                            </div>

                            <div className="bg-slate-700/50 rounded p-3">
                                <p className="text-xs text-gray-400 mb-1">Main Droite</p>
                                <p className="text-sm font-semibold text-white">
                                    {detectionResult.rightPalmOpen ? '✋ Ouverte' : '✊ Fermée'}
                                </p>
                            </div>

                            <div className="bg-slate-700/50 rounded p-3">
                                <p className="text-xs text-gray-400 mb-1">Action</p>
                                <p className="text-sm font-semibold text-white">
                                    {detectionResult.gestureAction === 'scroll-down' && '⬇️ Bas'}
                                    {detectionResult.gestureAction === 'scroll-up' && '⬆️ Haut'}
                                    {detectionResult.gestureAction === 'stop' && '⏸️ Arrêt'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Three.js Visualizer */}
                {showVisualizer && isCameraActive && detectionResult && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Visualisation 3D</h3>
                        <GestureVisualizerThree
                            isActive={isCameraActive}
                            handsDetected={detectionResult.handsDetected}
                            gestureAction={detectionResult.gestureAction}
                            velocity={0}
                        />
                    </div>
                )}

                {/* Instructions */}
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-blue-300 mb-4">📋 Instructions</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                        <p>👋 <strong>Une paume ouverte</strong> → Scroll vers le bas</p>
                        <p>🙌 <strong>Deux paumes ouvertes</strong> → Scroll vers le haut</p>
                        <p>✋ <strong>Aucune main visible</strong> → Arrêt du scroll</p>
                    </div>
                </div>
            </div>

            {/* Hidden Video Element */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
            />
        </div>
    );
};

export default ExampleGestureComponent;
