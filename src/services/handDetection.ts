import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface HandDetectionResult {
    handsDetected: number;
    leftHandConfidence: number;
    rightHandConfidence: number;
    leftPalmOpen: boolean;
    rightPalmOpen: boolean;
    gestureAction: 'scroll-down' | 'scroll-up' | 'stop';
}

class HandDetectionService {
    private handLandmarker: HandLandmarker | null = null;
    private videoElement: HTMLVideoElement | null = null;
    private isInitialized = false;
    private animationFrameId: number | null = null;
    private callbacks: {
        onDetection?: (result: HandDetectionResult) => void;
        onError?: (error: Error) => void;
    } = {};

    async initialize(videoElement: HTMLVideoElement, _canvasElement?: HTMLCanvasElement): Promise<void> {
        if (this.isInitialized) return;

        try {
            this.videoElement = videoElement;

            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
            );

            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker.task',
                    delegate: 'GPU',
                },
                runningMode: 'VIDEO',
                numHands: 2,
            });

            this.isInitialized = true;
            console.log('Hand Detection initialized successfully');
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Unknown error');
            console.error('Failed to initialize Hand Detection:', err);
            this.callbacks.onError?.(err);
            throw err;
        }
    }

    async startDetection(): Promise<void> {
        if (!this.videoElement) {
            throw new Error('Video element not initialized');
        }

        // Request camera access
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user',
                },
                audio: false,
            });

            this.videoElement.srcObject = stream;
            this.videoElement.onloadedmetadata = () => {
                this.videoElement!.play();
                this.startDetectionLoop();
            };
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Could not access camera');
            console.error('Camera access error:', err);
            this.callbacks.onError?.(err);
            throw err;
        }
    }

    private startDetectionLoop(): void {
        const detectFrame = async () => {
            if (!this.handLandmarker || !this.videoElement || this.videoElement.paused) {
                this.animationFrameId = requestAnimationFrame(detectFrame);
                return;
            }

            try {
                const results = this.handLandmarker.detectForVideo(
                    this.videoElement,
                    performance.now()
                );

                const detection = this.processResults(results);
                this.callbacks.onDetection?.(detection);
            } catch (error) {
                console.error('Detection error:', error);
            }

            this.animationFrameId = requestAnimationFrame(detectFrame);
        };

        detectFrame();
    }

    private processResults(results: any): HandDetectionResult {
        const handsDetected = results.landmarks?.length || 0;
        let leftHandConfidence = 0;
        let rightHandConfidence = 0;
        let leftPalmOpen = false;
        let rightPalmOpen = false;

        if (handsDetected > 0) {
            // Detect hand orientation and palm openness
            for (let i = 0; i < handsDetected; i++) {
                const hand = results.handedness[i];
                const landmarks = results.landmarks[i];
                const confidence = results.handedness[i]?.displayName === 'Right' ? 0.8 : 0.8;

                const palmOpen = this.isPalmOpen(landmarks);

                if (hand?.displayName === 'Right') {
                    rightHandConfidence = confidence;
                    rightPalmOpen = palmOpen;
                } else {
                    leftHandConfidence = confidence;
                    leftPalmOpen = palmOpen;
                }
            }
        }

        let gestureAction: 'scroll-down' | 'scroll-up' | 'stop' = 'stop';

        if (handsDetected === 1) {
            if ((leftPalmOpen && leftHandConfidence > 0.5) || (rightPalmOpen && rightHandConfidence > 0.5)) {
                gestureAction = 'scroll-down';
            }
        } else if (handsDetected === 2) {
            if ((leftPalmOpen && leftHandConfidence > 0.5) && (rightPalmOpen && rightHandConfidence > 0.5)) {
                gestureAction = 'scroll-up';
            }
        }

        return {
            handsDetected,
            leftHandConfidence,
            rightHandConfidence,
            leftPalmOpen,
            rightPalmOpen,
            gestureAction,
        };
    }

    private isPalmOpen(landmarks: any[]): boolean {
        if (!landmarks || landmarks.length < 21) return false;

        // Landmarks: 0=wrist, 5=index_mcp, 9=middle_mcp, 13=ring_mcp, 17=pinky_mcp
        // 4=index_tip, 8=middle_tip, 12=ring_tip, 16=pinky_tip, 20=pinky_tip
        const wrist = landmarks[0];
        const middleFingerTip = landmarks[12];

        // Check if fingers are extended (tip is higher than wrist in Y)
        const distance = Math.abs(middleFingerTip.y - wrist.y);

        // Check if palm is facing camera (check z coordinates)
        const fingerSpread = this.calculateFingerSpread(landmarks);

        // Palm is open if fingers are extended and spread apart
        return distance > 0.1 && fingerSpread > 0.08;
    }

    private calculateFingerSpread(landmarks: any[]): number {
        // Calculate spread between index and pinky fingers
        const indexTip = landmarks[8]; // middle finger
        const pinkyTip = landmarks[16];

        const spread = Math.sqrt(
            Math.pow(indexTip.x - pinkyTip.x, 2) +
            Math.pow(indexTip.y - pinkyTip.y, 2)
        );

        return spread;
    }

    stopDetection(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.videoElement && this.videoElement.srcObject) {
            const stream = this.videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
    }

    onDetection(callback: (result: HandDetectionResult) => void): void {
        this.callbacks.onDetection = callback;
    }

    onError(callback: (error: Error) => void): void {
        this.callbacks.onError = callback;
    }

    dispose(): void {
        this.stopDetection();
        this.isInitialized = false;
        this.handLandmarker = null;
        this.videoElement = null;
    }
}

export const handDetectionService = new HandDetectionService();
