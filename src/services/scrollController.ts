export class ScrollController {
    private currentVelocity = 0;
    private targetVelocity = 0;
    private maxVelocity = 5; // pixels per frame
    private acceleration = 0.15;
    private friction = 0.08;
    private animationFrameId: number | null = null;
    private isActive = false;

    startScrolling(direction: 'up' | 'down'): void {
        this.targetVelocity = direction === 'down' ? this.maxVelocity : -this.maxVelocity;
    }

    stopScrolling(): void {
        this.targetVelocity = 0;
    }

    setMaxVelocity(velocity: number): void {
        this.maxVelocity = Math.max(1, Math.min(velocity, 10));
    }

    private updateVelocity(): void {
        // Smooth acceleration towards target velocity
        if (this.currentVelocity < this.targetVelocity) {
            this.currentVelocity += this.acceleration;
            this.currentVelocity = Math.min(this.currentVelocity, this.targetVelocity);
        } else if (this.currentVelocity > this.targetVelocity) {
            this.currentVelocity -= this.acceleration;
            this.currentVelocity = Math.max(this.currentVelocity, this.targetVelocity);
        }

        // Apply friction when stopping
        if (this.targetVelocity === 0 && Math.abs(this.currentVelocity) > 0.1) {
            this.currentVelocity *= (1 - this.friction);
        } else if (this.targetVelocity === 0) {
            this.currentVelocity = 0;
        }
    }

    private performScroll(): void {
        this.updateVelocity();

        if (Math.abs(this.currentVelocity) > 0.01) {
            window.scrollBy({
                top: this.currentVelocity,
                behavior: 'auto',
            });
        }

        if (this.isActive) {
            this.animationFrameId = requestAnimationFrame(() => this.performScroll());
        }
    }

    start(): void {
        if (this.isActive) return;

        this.isActive = true;
        this.performScroll();
    }

    stop(): void {
        this.isActive = false;
        this.targetVelocity = 0;
        this.currentVelocity = 0;

        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    getCurrentVelocity(): number {
        return this.currentVelocity;
    }

    getCurrentTargetVelocity(): number {
        return this.targetVelocity;
    }
}

export const scrollController = new ScrollController();
