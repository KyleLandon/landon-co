import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeLoadingSpinnerProps {
  size?: number;
  color?: number;
  className?: string;
}

export default function ThreeLoadingSpinner({
  size = 1,
  color = 0x00ff88,
  className = ""
}: ThreeLoadingSpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create spinning rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const geometry = new THREE.TorusGeometry(size * (0.5 + i * 0.3), 0.05, 8, 32);
      const material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8 - i * 0.2,
        wireframe: true
      });
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      rings.push(ring);
      scene.add(ring);
    }

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      rings.forEach((ring, index) => {
        ring.rotation.z += 0.02 * (index + 1);
        ring.rotation.x += 0.01 * (index + 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      rings.forEach(ring => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [size, color]);

  return (
    <div 
      ref={containerRef} 
      className={`w-16 h-16 ${className}`}
    />
  );
}