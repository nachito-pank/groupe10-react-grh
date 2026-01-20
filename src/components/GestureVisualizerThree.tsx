import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GestureVisualizerProps {
    isActive: boolean;
    handsDetected: number;
    gestureAction: 'scroll-down' | 'scroll-up' | 'stop';
    velocity?: number;
}

const GestureVisualizerThree: React.FC<GestureVisualizerProps> = ({
    isActive,
    handsDetected,
    gestureAction,
    velocity = 0,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    const arrowsRef = useRef<THREE.Group | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e27);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create particle system
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 8;
            positions[i + 1] = (Math.random() - 0.5) * 8;
            positions[i + 2] = (Math.random() - 0.5) * 4;

            velocities[i] = (Math.random() - 0.5) * 0.02;
            velocities[i + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i + 2] = (Math.random() - 0.5) * 0.02;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const material = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.08,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.7,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        particlesRef.current = particles;

        // Create arrow indicators
        const arrowsGroup = new THREE.Group();
        scene.add(arrowsGroup);
        arrowsRef.current = arrowsGroup;

        // Hand detector visuals
        const handGeometries: THREE.Object3D[] = [];
        for (let i = 0; i < 2; i++) {
            const handShape = new THREE.Group();

            // Palm circle
            const palmGeometry = new THREE.CircleGeometry(0.3, 32);
            const palmMaterial = new THREE.LineBasicMaterial({
                color: i === 0 ? 0xff6b6b : 0x4ecdc4,
                linewidth: 2,
            });
            const palmLine = new THREE.LineSegments(
                new THREE.EdgesGeometry(palmGeometry),
                palmMaterial
            );
            handShape.add(palmLine);

            scene.add(handShape);
            handGeometries.push(handShape);
        }

        // Animation loop
        const animate = () => {
            const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
            const velocityAttribute = geometry.getAttribute('velocity') as THREE.BufferAttribute;
            const positions = positionAttribute.array as Float32Array;
            const velocities = velocityAttribute.array as Float32Array;

            for (let i = 0; i < particleCount * 3; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Wrap around
                if (Math.abs(positions[i]) > 4) velocities[i] *= -1;
                if (Math.abs(positions[i + 1]) > 4) velocities[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 2) velocities[i + 2] *= -1;
            }

            positionAttribute.needsUpdate = true;

            // Rotate particles based on gesture
            if (gestureAction === 'scroll-down') {
                particles.rotation.x += 0.001;
                particles.rotation.z += 0.002;
            } else if (gestureAction === 'scroll-up') {
                particles.rotation.x -= 0.001;
                particles.rotation.z -= 0.002;
            }

            // Update arrow direction based on gesture
            arrowsGroup.clear();

            if (gestureAction === 'scroll-down') {
                const downArrowGeometry = createArrowGeometry(0, -0.5, 0.3);
                const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0x00d4ff });
                const downArrow = new THREE.Mesh(downArrowGeometry, arrowMaterial);
                arrowsGroup.add(downArrow);
            } else if (gestureAction === 'scroll-up') {
                const upArrowGeometry = createArrowGeometry(0, 0.5, 0.3);
                const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
                const upArrow = new THREE.Mesh(upArrowGeometry, arrowMaterial);
                arrowsGroup.add(upArrow);
            }

            // Update opacity based on velocity
            if (velocity !== undefined) {
                const opacity = 0.5 + Math.abs(velocity) * 0.1;
                (material as THREE.PointsMaterial).opacity = Math.min(opacity, 1);
            }

            renderer.render(scene, camera);
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameIdRef.current !== null) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            containerRef.current?.removeChild(renderer.domElement);
        };
    }, [gestureAction, velocity]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full rounded-lg overflow-hidden"
            style={{
                minHeight: '300px',
                border: '2px solid #00d4ff',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            }}
        >
            {isActive && (
                <div
                    className="absolute inset-0 flex items-center justify-center text-white text-center pointer-events-none z-10"
                    style={{
                        background: 'rgba(10, 14, 39, 0.3)',
                    }}
                >
                    <div className="font-bold text-lg">
                        <div className="text-xl mb-2">
                            {handsDetected === 0 && '🫥 Aucune main détectée'}
                            {handsDetected === 1 && '👋 Une main - Scroll vers le bas'}
                            {handsDetected >= 2 && '🙌 Deux mains - Scroll vers le haut'}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function createArrowGeometry(x: number, y: number, size: number): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
        x, y, 0,                          // center
        x - size / 2, y + size, 0,       // top left
        x + size / 2, y + size, 0,       // top right
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex([0, 1, 2]);
    return geometry;
}

export default GestureVisualizerThree;
