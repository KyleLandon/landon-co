import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroBackgroundProps {
  className?: string;
}

export default function ThreeHeroBackground({ className = "" }: ThreeHeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();

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
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create interactive snow particle system
    const particleCount = 300;
    const snowGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positioning
      positions[i3] = (Math.random() - 0.5) * 20;     // x
      positions[i3 + 1] = Math.random() * 15 - 5;     // y
      positions[i3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // Falling velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;     // x drift
      velocities[i3 + 1] = -Math.random() * 0.05 - 0.01; // falling
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02; // z drift
      
      // Random sizes and opacities
      sizes[i] = Math.random() * 0.02 + 0.01;
      opacities[i] = Math.random() * 0.8 + 0.2;
    }
    
    snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    snowGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    snowGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    // Store velocities on the geometry
    (snowGeometry as any).velocities = velocities;
    (snowGeometry as any).originalOpacities = opacities.slice();
    
    // Snow material with custom shader
    const snowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        mouseInfluence: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        uniform float time;
        uniform vec2 mouse;
        uniform float mouseInfluence;
        varying float vOpacity;
        
        void main() {
          vOpacity = opacity;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Mouse interaction - push particles away from mouse
          vec2 mousePos = mouse * 10.0;
          float distanceToMouse = distance(position.xy, mousePos);
          float mouseEffect = exp(-distanceToMouse * 0.5) * mouseInfluence;
          
          mvPosition.xy += normalize(position.xy - mousePos) * mouseEffect * 0.5;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * 300.0 / -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying float vOpacity;
        
        void main() {
          // Create circular snowflake
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft edge
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          alpha *= vOpacity;
          
          // Sparkle effect
          float sparkle = sin(time * 3.0 + gl_FragCoord.x * 0.1) * 0.3 + 0.7;
          
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * sparkle);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const snowParticles = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snowParticles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    let mouseInfluence = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      mouseInfluence = 1.0;
    };

    const onMouseLeave = () => {
      mouseInfluence = 0;
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mouseleave', onMouseLeave);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Smooth mouse following
      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      // Update snow particles
      const positions = snowParticles.geometry.attributes.position.array as Float32Array;
      const velocities = (snowGeometry as any).velocities;
      const originalOpacities = (snowGeometry as any).originalOpacities;
      const currentOpacities = snowParticles.geometry.attributes.opacity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Update positions
        positions[i3] += velocities[i3];     // x
        positions[i3 + 1] += velocities[i3 + 1]; // y
        positions[i3 + 2] += velocities[i3 + 2]; // z
        
        // Add wind effect
        positions[i3] += Math.sin(time + positions[i3 + 1] * 0.1) * 0.001;
        
        // Reset particles that fall below screen
        if (positions[i3 + 1] < -8) {
          positions[i3 + 1] = 8;
          positions[i3] = (Math.random() - 0.5) * 20;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
        }
        
        // Wrap particles horizontally
        if (positions[i3] > 10) positions[i3] = -10;
        if (positions[i3] < -10) positions[i3] = 10;
        if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
        if (positions[i3 + 2] < -5) positions[i3 + 2] = 5;
        
        // Mouse interaction - fade particles near mouse
        const distToMouse = Math.sqrt(
          Math.pow(positions[i3] - target.x * 10, 2) + 
          Math.pow(positions[i3 + 1] - target.y * 8, 2)
        );
        
        if (distToMouse < 2 && mouseInfluence > 0) {
          currentOpacities[i] = originalOpacities[i] * (distToMouse / 2);
        } else {
          currentOpacities[i] = originalOpacities[i];
        }
      }

      // Update uniforms
      (snowMaterial.uniforms.time as any).value = time;
      (snowMaterial.uniforms.mouse as any).value = target;
      (snowMaterial.uniforms.mouseInfluence as any).value = mouseInfluence;

      // Fade mouse influence
      mouseInfluence *= 0.95;

      // Mark attributes as needing update
      snowParticles.geometry.attributes.position.needsUpdate = true;
      snowParticles.geometry.attributes.opacity.needsUpdate = true;

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
        containerRef.current.removeEventListener('mouseleave', onMouseLeave);
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
      
      // Dispose of Three.js resources
      snowGeometry.dispose();
      snowMaterial.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
}