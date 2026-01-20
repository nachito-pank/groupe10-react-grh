import React, { useState } from 'react';
import { Camera, Eye, EyeOff, AlertCircle } from 'lucide-react';
import GestureDemo from './GestureDemo';
import GestureVisualizerThree from './GestureVisualizerThree';
import { useHandGestureScroll } from '../hooks/useHandGestureScroll';

interface GestureScrollControllerProps {
    showDemo?: boolean;
    showVisualizer?: boolean;
    showDebug?: boolean;
}

const GestureScrollController: React.FC<GestureScrollControllerProps> = ({
    showDemo = true,
    showVisualizer = true,
    showDebug = false,
}) => {
    const [isDemoVisible, setIsDemoVisible] = useState(showDemo);
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [showVisualizerPanel, setShowVisualizerPanel] = useState(showVisualizer);

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
        showDebug,
        onDetectionChange: (result) => {
            if (showDebug) {
                console.log('Detection updated:', result);
            }
        },
    });

    // Auto-start detection when user clicks start
    const handleEnableCamera = async () => {
        if (!isInitialized) return;

        try {
            await startDetection();
            setIsCameraEnabled(true);
        } catch (err) {
            console.error('Failed to enable camera:', err);
        }
    };

    const handleDisableCamera = () => {
        stopDetection();
        setIsCameraEnabled(false);
    };

    return (
        <div className="w-full">
            {/* Demo Modal */}
            {isDemoVisible && (
                <GestureDemo
                    onDismiss={() => setIsDemoVisible(false)}
                    autoHideDuration={8000}
                />
            )}

            {/* Control Panel */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'
                                    } animate-pulse`}
                            />
                            <span className="text-sm font-medium text-white">
                                {isLoading
                                    ? 'Initialisation...'
                                    : isInitialized
                                        ? isCameraEnabled
                                            ? '🎥 Caméra active'
                                            : '✓ Prêt à démarrer'
                                        : 'Erreur d\'initialisation'}
                            </span>
                        </div>

                        {/* Camera Toggle */}
                        {isInitialized && !error && (
                            <button
                                onClick={isCameraEnabled ? handleDisableCamera : handleEnableCamera}
                                disabled={isLoading}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isCameraEnabled
                                        ? 'bg-red-600 hover:bg-red-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isCameraEnabled ? (
                                    <>
                                        <EyeOff className="w-4 h-4" />
                                        Désactiver caméra
                                    </>
                                ) : (
                                    <>
                                        <Camera className="w-4 h-4" />
                                        Activer caméra
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex gap-3 bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-red-300">Erreur</p>
                                <p className="text-sm text-red-200">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Info Message */}
                    {isInitialized && !isCameraEnabled && !error && (
                        <div className="text-sm text-gray-400 bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                            ℹ️ Cliquez sur "Activer caméra" pour commencer la détection des gestes
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden Video Element */}
            <video
                ref={videoRef}
                style={{ display: 'none' }}
                playsInline
            />

            {/* Detection Status */}
            {isCameraEnabled && detectionResult && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Detection Stats */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                            <Eye className="w-4 h-4" /> Détection
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Mains détectées:</span>
                                <span className="text-white font-medium">{detectionResult.handsDetected}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Action:</span>
                                <span className="text-white font-medium">
                                    {detectionResult.gestureAction === 'scroll-down' && '↓ Vers le bas'}
                                    {detectionResult.gestureAction === 'scroll-up' && '↑ Vers le haut'}
                                    {detectionResult.gestureAction === 'stop' && '⏸ Arrêt'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Main gauche:</span>
                                <span className="text-white font-medium">
                                    {detectionResult.leftPalmOpen ? '✓ Ouverte' : '✗ Fermée'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Main droite:</span>
                                <span className="text-white font-medium">
                                    {detectionResult.rightPalmOpen ? '✓ Ouverte' : '✗ Fermée'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Visualizer Toggle */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setShowVisualizerPanel(!showVisualizerPanel)}
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-4 text-left transition-colors"
                        >
                            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                {showVisualizerPanel ? '👁️ Masquer' : '👁️ Afficher'} visualisation 3D
                            </h3>
                        </button>
                    </div>
                </div>
            )}

            {/* Three.js Visualizer */}
            {showVisualizerPanel && isCameraEnabled && detectionResult && (
                <div className="mb-6">
                    <GestureVisualizerThree
                        isActive={isCameraEnabled}
                        handsDetected={detectionResult.handsDetected}
                        gestureAction={detectionResult.gestureAction}
                        velocity={0}
                    />
                </div>
            )}

            {/* Instructions Card */}
            {isCameraEnabled && (
                <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700/50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-semibold text-blue-300 mb-3">📋 Contrôles</h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                        <li>👋 <strong>Une paume</strong> = Scroll vers le bas</li>
                        <li>🙌 <strong>Deux paumes</strong> = Scroll vers le haut</li>
                        <li>✋ <strong>Aucune main</strong> = Arrêt du scroll</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GestureScrollController;
