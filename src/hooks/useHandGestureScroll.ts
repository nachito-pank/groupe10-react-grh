import { useEffect, useRef, useState, useCallback } from 'react';
import { handDetectionService, HandDetectionResult } from '../services/handDetection';
import { scrollController, ScrollController } from '../services/scrollController';

interface UseHandGestureScrollOptions {
    enabled?: boolean;
    showDebug?: boolean;
    maxVelocity?: number;
    onDetectionChange?: (result: HandDetectionResult) => void;
}

interface UseHandGestureScrollReturn {
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    detectionResult: HandDetectionResult | null;
    startDetection: () => Promise<void>;
    stopDetection: () => void;
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const useHandGestureScroll = (
    options: UseHandGestureScrollOptions = {}
): UseHandGestureScrollReturn => {
    const {
        enabled = true,
        showDebug = false,
        maxVelocity = 5,
        onDetectionChange,
    } = options;

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollControllerRef = useRef<ScrollController | null>(null);

    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [detectionResult, setDetectionResult] = useState<HandDetectionResult | null>(null);

    // Initialize hand detection and scroll controller
    useEffect(() => {
        if (!enabled) return;

        const initializeServices = async () => {
            try {
                setIsLoading(true);

                if (!videoRef.current) {
                    throw new Error('Video element not found');
                }

                // Initialize hand detection
                await handDetectionService.initialize(videoRef.current, canvasRef.current || undefined);

                // Setup scroll controller
                scrollControllerRef.current = scrollController;
                scrollControllerRef.current.setMaxVelocity(maxVelocity);

                // Set up detection callback
                handDetectionService.onDetection((result: HandDetectionResult) => {
                    setDetectionResult(result);
                    onDetectionChange?.(result);

                    if (showDebug) {
                        console.log('Detection Result:', result);
                    }

                    // Control scroll based on gesture
                    if (result.gestureAction === 'scroll-down') {
                        scrollControllerRef.current?.startScrolling('down');
                    } else if (result.gestureAction === 'scroll-up') {
                        scrollControllerRef.current?.startScrolling('up');
                    } else {
                        scrollControllerRef.current?.stopScrolling();
                    }
                });

                // Error handler
                handDetectionService.onError((err: Error) => {
                    setError(err.message);
                    console.error('Hand detection error:', err);
                });

                setIsInitialized(true);
                setIsLoading(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                setIsLoading(false);
                console.error('Initialization error:', err);
            }
        };

        initializeServices();

        return () => {
            handDetectionService.dispose();
        };
    }, [enabled, maxVelocity, onDetectionChange, showDebug]);

    // Start detection with camera
    const startDetection = useCallback(async () => {
        try {
            setError(null);
            if (!isInitialized) {
                throw new Error('Services not initialized');
            }

            await handDetectionService.startDetection();

            // Start scroll controller
            if (scrollControllerRef.current) {
                scrollControllerRef.current.start();
            }

            if (showDebug) {
                console.log('Hand gesture detection started');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to start detection';
            setError(errorMessage);
            console.error('Start detection error:', err);
        }
    }, [isInitialized, showDebug]);

    // Stop detection
    const stopDetection = useCallback(() => {
        handDetectionService.stopDetection();

        if (scrollControllerRef.current) {
            scrollControllerRef.current.stop();
        }

        setDetectionResult(null);

        if (showDebug) {
            console.log('Hand gesture detection stopped');
        }
    }, [showDebug]);

    return {
        isInitialized,
        isLoading,
        error,
        detectionResult,
        startDetection,
        stopDetection,
        videoRef,
        canvasRef,
    };
};
