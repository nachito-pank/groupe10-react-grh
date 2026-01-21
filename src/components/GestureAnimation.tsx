import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import type { HandDetectionResult } from "../services/handDetection";

interface GestureAnimationProps {
    gesture?: HandDetectionResult;
    showDebug?: boolean;
    className?: string;
}

interface AnimatedObject {
    mesh: THREE.Mesh;
    baseRotation: THREE.Euler;
    baseScale: THREE.Vector3;
    targetRotation: THREE.Euler;
    targetScale: THREE.Vector3;
}

const GestureAnimation: React.FC<GestureAnimationProps> = ({
    gesture,
    showDebug = false,
    className = "",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const objectsRef = useRef<AnimatedObject[]>([]);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialiser Three.js
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e27);
        scene.fog = new THREE.Fog(0x0a0e27, 100, 500);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 30;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
        pointLight.position.set(20, 20, 20);
        scene.add(pointLight);

        // Créer des objets interactifs
        const geometries = [
            new THREE.IcosahedronGeometry(2, 4),
            new THREE.OctahedronGeometry(2),
            new THREE.TetrahedronGeometry(2),
        ];

        const colors = [0x00ff88, 0x00d4ff, 0xff00ff];
        const objects: AnimatedObject[] = [];

        geometries.forEach((geometry, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: colors[index],
                emissive: colors[index],
                emissiveIntensity: 0.3,
                wireframe: false,
            });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = (index - 1) * 12;
            mesh.position.y = Math.sin(index * 1.2) * 8;
            mesh.position.z = Math.cos(index * 0.8) * 10;

            scene.add(mesh);

            objects.push({
                mesh,
                baseRotation: new THREE.Euler(0, 0, 0),
                baseScale: new THREE.Vector3(1, 1, 1),
                targetRotation: new THREE.Euler(0, 0, 0),
                targetScale: new THREE.Vector3(1, 1, 1),
            });
        });

        objectsRef.current = objects;

        // Ajouter des particules
        const particleCount = 200;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 100;
            particlePositions[i + 1] = (Math.random() - 0.5) * 100;
            particlePositions[i + 2] = (Math.random() - 0.5) * 100;
        }

        particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(particlePositions, 3)
        );

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00ff88,
            size: 0.5,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Variables pour l'animation
        let targetRotationX = 0;
        let targetRotationY = 0;
        let targetCameraZ = 30;

        // Animation loop
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // Appliquer les transformations selon le geste
            if (gesture) {
                switch (gesture.gesture) {
                    case "one-palm":
                        // Rotation et zoom pour le scroll vers le bas
                        targetRotationX = 0.1;
                        targetRotationY += 0.02;
                        targetCameraZ = 25;
                        objects.forEach((obj) => {
                            obj.targetScale.set(1.1, 1.1, 1.1);
                        });
                        break;

                    case "two-palms":
                        // Rotation inverse et zoom arrière pour le scroll vers le haut
                        targetRotationX = -0.1;
                        targetRotationY -= 0.02;
                        targetCameraZ = 35;
                        objects.forEach((obj) => {
                            obj.targetScale.set(0.9, 0.9, 0.9);
                        });
                        break;

                    case "none":
                    default:
                        // État neutre
                        targetRotationX = 0;
                        targetRotationY *= 0.98;
                        targetCameraZ = 30;
                        objects.forEach((obj) => {
                            obj.targetScale.set(1, 1, 1);
                        });
                        break;
                }
            }

            // Interpoler les rotations et positions
            objects.forEach((obj) => {
                obj.mesh.rotation.x += (targetRotationX - obj.mesh.rotation.x) * 0.05;
                obj.mesh.rotation.y += (targetRotationY - obj.mesh.rotation.y) * 0.05;
                obj.mesh.rotation.z += obj.mesh.rotation.z * 0.02;

                obj.mesh.scale.lerp(obj.targetScale, 0.1);

                // Animation de base
                obj.mesh.position.y += Math.sin(Date.now() * 0.001) * 0.01;
            });

            // Animer les particules
            particles.rotation.x += 0.0002;
            particles.rotation.y += 0.0001;

            // Animer la caméra
            camera.position.z += (targetCameraZ - camera.position.z) * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Gestion du redimensionnement
        const handleResize = () => {
            if (!containerRef.current) return;

            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (containerRef.current && rendererRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }

            // Libérer les ressources Three.js
            geometries.forEach((geom) => geom.dispose());
            objects.forEach((obj) => {
                (obj.mesh.material as THREE.Material).dispose();
                obj.mesh.geometry.dispose();
            });
            particleGeometry.dispose();
            (particleMaterial as THREE.Material).dispose();
            renderer.dispose();
        };
    }, [gesture]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-black ${className}`}
        >
            {showDebug && gesture && (
                <div className="absolute top-4 left-4 bg-black/50 text-green-400 font-mono text-xs p-3 rounded border border-green-400">
                    <div>Gesture: {gesture.gesture}</div>
                    <div>Hands: {gesture.handsDetected}</div>
                    <div>Confidence: {(gesture.confidence * 100).toFixed(0)}%</div>
                </div>
            )}
        </div>
    );
};

export default GestureAnimation;
