import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeInteractiveOrbProps {
  size?: number;
  color?: number;
  className?: string;
  intensity?: number;
  rotationSpeed?: number;
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function ThreeInteractiveOrb({
  size = 1,
  color = 0x00ff88,
  className = "",
  intensity = 1,
  rotationSpeed = 0.01
}: ThreeInteractiveOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();
  const orbRef = useRef<THREE.Mesh | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!isWebGLAvailable()) return;

    let renderer: THREE.WebGLRenderer;

    try {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 3;

      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      containerRef.current.appendChild(renderer.domElement);

      const geometry = new THREE.SphereGeometry(size, 64, 64);
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(color) },
          intensity: { value: intensity },
          hover: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          uniform float intensity;
          uniform float hover;
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            float wave1 = sin(vPosition.x * 10.0 + time * 2.0) * 0.1;
            float wave2 = sin(vPosition.y * 10.0 + time * 1.5) * 0.1;
            float wave3 = sin(vPosition.z * 10.0 + time * 2.5) * 0.1;
            
            float energy = wave1 + wave2 + wave3;
            
            float pulse = sin(time * 3.0) * 0.3 + 0.7;
            
            float fresnel = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
            fresnel = pow(fresnel, 2.0);
            
            float finalIntensity = (intensity + energy * 0.5 + fresnel * 0.8) * pulse;
            finalIntensity *= (1.0 + hover * 0.5);
            
            vec3 finalColor = color * finalIntensity;
            
            gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      const orb = new THREE.Mesh(geometry, material);
      orbRef.current = orb;
      scene.add(orb);

      const wireframeGeometry = new THREE.SphereGeometry(size * 1.05, 32, 32);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      scene.add(wireframeMesh);

      const particleCount = 100;
      const particleGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = size * (1.2 + Math.random() * 0.8);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(1 - 2 * Math.random());
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      (particleGeometry as any).velocities = velocities;

      const particleMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      const mouse = new THREE.Vector2();
      let targetRotationX = 0;
      let targetRotationY = 0;

      const onMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        targetRotationY = mouse.x * 0.5;
        targetRotationX = mouse.y * 0.5;
      };

      const onMouseEnter = () => setIsHovered(true);
      const onMouseLeave = () => setIsHovered(false);

      containerRef.current.addEventListener('mousemove', onMouseMove);
      containerRef.current.addEventListener('mouseenter', onMouseEnter);
      containerRef.current.addEventListener('mouseleave', onMouseLeave);

      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        (material.uniforms.time as any).value = time;
        (material.uniforms.hover as any).value = isHovered ? 1 : 0;

        if (orb) {
          orb.rotation.x += (targetRotationX - orb.rotation.x) * 0.05;
          orb.rotation.y += (targetRotationY - orb.rotation.y) * 0.05;
          orb.rotation.z += rotationSpeed;
        }

        wireframeMesh.rotation.x = time * 0.5;
        wireframeMesh.rotation.y = time * 0.3;

        const pos = particles.geometry.attributes.position.array as Float32Array;
        const vel = (particles.geometry as any).velocities;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          pos[i3] += vel[i3];
          pos[i3 + 1] += vel[i3 + 1];
          pos[i3 + 2] += vel[i3 + 2];
          
          const distance = Math.sqrt(pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2);
          
          if (distance > size * 3) {
            const radius = size * 1.2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(1 - 2 * Math.random());
            
            pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i3 + 2] = radius * Math.cos(phi);
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!containerRef.current || !renderer) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
        if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
          containerRef.current.removeEventListener('mousemove', onMouseMove);
          containerRef.current.removeEventListener('mouseenter', onMouseEnter);
          containerRef.current.removeEventListener('mouseleave', onMouseLeave);
          containerRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize', handleResize);
        
        geometry.dispose();
        material.dispose();
        wireframeGeometry.dispose();
        wireframeMaterial.dispose();
        particleGeometry.dispose();
        particleMaterial.dispose();
        renderer.dispose();
      };
    } catch (err) {
      console.warn('ThreeInteractiveOrb: WebGL initialization failed, skipping 3D effect.', err);
    }
  }, [size, color, intensity, rotationSpeed, isHovered]);

  return (
    <div 
      ref={containerRef} 
      className={`cursor-pointer ${className}`}
    />
  );
}
