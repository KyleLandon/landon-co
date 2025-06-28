import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreePortfolioCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  className?: string;
  onHover?: (isHovered: boolean) => void;
  onClick?: () => void;
}

export default function ThreePortfolioCard({
  title,
  description,
  imageUrl,
  className = "",
  onHover,
  onClick
}: ThreePortfolioCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create card geometry
    const geometry = new THREE.PlaneGeometry(2, 1.2, 32, 32);
    
    // Create material
    const material = new THREE.MeshPhongMaterial({
      color: 0x2a2a2a,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Add wireframe overlay
    const wireframeGeometry = new THREE.PlaneGeometry(2, 1.2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframeMesh);

    // Add floating particles around the card
    const particleGeometry = new THREE.SphereGeometry(0.01, 8, 8);
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.8,
    });

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.x = (Math.random() - 0.5) * 4;
      particle.position.y = (Math.random() - 0.5) * 2;
      particle.position.z = (Math.random() - 0.5) * 2;
      
      (particle as any).originalPosition = particle.position.clone();
      (particle as any).animationOffset = Math.random() * Math.PI * 2;
      
      particles.push(particle);
      scene.add(particle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      mouseX = mouse.x * 0.3;
      mouseY = mouse.y * 0.3;
    };

    const onMouseEnter = () => {
      setIsHovered(true);
      onHover?.(true);
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      onHover?.(false);
    };

    const onClickHandler = () => {
      onClick?.();
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mouseenter', onMouseEnter);
    containerRef.current.addEventListener('mouseleave', onMouseLeave);
    containerRef.current.addEventListener('click', onClickHandler);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate and scale the main card based on hover state
      if (mesh) {
        mesh.rotation.x = mouseY + Math.sin(time * 0.5) * 0.1;
        mesh.rotation.y = mouseX + Math.sin(time * 0.3) * 0.1;
        
        const targetScale = isHovered ? 1.1 : 1;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      }

      // Animate wireframe
      wireframeMesh.rotation.x = mouseY * 1.2 + Math.sin(time * 0.7) * 0.05;
      wireframeMesh.rotation.y = mouseX * 1.2 + Math.cos(time * 0.5) * 0.05;

      // Animate particles
      particles.forEach((particle, index) => {
        const offset = (particle as any).animationOffset;
        const originalPos = (particle as any).originalPosition;
        
        particle.position.x = originalPos.x + Math.sin(time + offset) * 0.2;
        particle.position.y = originalPos.y + Math.cos(time * 1.5 + offset) * 0.1;
        particle.position.z = originalPos.z + Math.sin(time * 2 + offset) * 0.1;
        
        // Change opacity based on hover
        (particle.material as THREE.MeshBasicMaterial).opacity = isHovered ? 1 : 0.5;
      });

      // Update material color based on hover
      (material as THREE.MeshPhongMaterial).color.setHex(
        isHovered ? 0x404040 : 0x2a2a2a
      );

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeEventListener('mousemove', onMouseMove);
        containerRef.current.removeEventListener('mouseenter', onMouseEnter);
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
        containerRef.current.removeEventListener('click', onClickHandler);
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      wireframeGeometry.dispose();
      wireframeMaterial.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isHovered, onHover, onClick]);

  return (
    <div className={`relative ${className}`}>
      {/* 3D Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-64 cursor-pointer"
        style={{ zIndex: 1 }}
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center pointer-events-none z-10 px-4">
        <h3 className="text-xl font-bold text-white font-mono mb-2 drop-shadow-lg">
          {title}
        </h3>
        <p className="text-sm text-gray-300 font-mono max-w-xs drop-shadow-md">
          {description}
        </p>
      </div>
    </div>
  );
}