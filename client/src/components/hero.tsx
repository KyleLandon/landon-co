import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";



const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const strokes: Array<{
      points: Array<{ x: number; y: number; pressure: number }>;
      currentPointIndex: number;
      direction: number;
      speed: number;
      baseWidth: number;
      opacity: number;
      isActive: boolean;
      color: string;
      inkDensity: number;
    }> = [];

    function createStroke() {
      // Define center exclusion zone (where logo and text are)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const exclusionRadius = Math.min(canvas.width, canvas.height) * 0.35;
      
      let startX, startY;
      let attempts = 0;
      
      // Find a starting point outside the center exclusion zone
      do {
        startX = Math.random() * canvas.width;
        startY = Math.random() * canvas.height;
        attempts++;
      } while (
        Math.sqrt((startX - centerX) ** 2 + (startY - centerY) ** 2) < exclusionRadius &&
        attempts < 50
      );
      
      // If we can't find a good spot, place it at the edges
      if (attempts >= 50) {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0: // top
            startX = Math.random() * canvas.width;
            startY = Math.random() * (canvas.height * 0.15);
            break;
          case 1: // bottom
            startX = Math.random() * canvas.width;
            startY = canvas.height - Math.random() * (canvas.height * 0.15);
            break;
          case 2: // left
            startX = Math.random() * (canvas.width * 0.15);
            startY = Math.random() * canvas.height;
            break;
          case 3: // right
            startX = canvas.width - Math.random() * (canvas.width * 0.15);
            startY = Math.random() * canvas.height;
            break;
        }
      }
      
      const direction = Math.random() * Math.PI * 2;
      const strokeLength = 40 + Math.random() * 60; // Shorter, more controlled strokes
      
      // Generate Japanese brush-style path points
      const points: Array<{ x: number; y: number; pressure: number }> = [];
      let currentX = startX;
      let currentY = startY;
      let currentDirection = direction;
      let velocity = 0.5 + Math.random() * 1.5; // Variable brush speed
      
      for (let i = 0; i < strokeLength; i++) {
        // Slight directional variation like natural brush movement
        currentDirection += (Math.random() - 0.5) * 0.08;
        
        // Variable step size simulating brush pressure and speed
        const stepSize = velocity * (1.5 + Math.random() * 0.5);
        currentX += Math.cos(currentDirection) * stepSize;
        currentY += Math.sin(currentDirection) * stepSize;
        
        // Slow down brush towards the end (like lifting brush)
        velocity *= 0.995;
        
        // Check if we're getting too close to center - if so, curve away
        const distToCenter = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);
        if (distToCenter < exclusionRadius * 1.2) {
          // Curve away from center
          const angleToCenter = Math.atan2(centerY - currentY, centerX - currentX);
          currentDirection = angleToCenter + Math.PI + (Math.random() - 0.5) * 0.3;
        }
        
        // Japanese brush pressure curve - starts thick, tapers to fine point
        const progress = i / strokeLength;
        let pressure = 1.0;
        
        // Japanese brush characteristics: bold start, gradual taper to fine tip
        if (progress < 0.05) {
          // Initial brush contact - builds up quickly
          pressure = Math.pow(progress / 0.05, 0.3) * 1.2;
        } else if (progress < 0.3) {
          // Main stroke body - full pressure with slight variation
          pressure = 1.0 + Math.sin(progress * Math.PI * 3) * 0.15;
        } else {
          // Gradual taper to fine point (characteristic of Japanese brushes)
          const taperProgress = (progress - 0.3) / 0.7;
          pressure = 1.0 * Math.pow(1 - taperProgress, 1.8); // Sharp taper to fine point
        }
        
        // Add subtle pressure variations for organic feel
        pressure *= (0.9 + Math.random() * 0.2);
        
        points.push({
          x: Math.max(0, Math.min(canvas.width, currentX)),
          y: Math.max(0, Math.min(canvas.height, currentY)),
          pressure: Math.max(0.05, Math.min(1.2, pressure)) // Clamp pressure
        });
      }
      
      return {
        points: points,
        currentPointIndex: 0,
        direction: direction,
        speed: 2.5,
        baseWidth: 12 + Math.random() * 16, // Wider for Japanese brush effect
        opacity: 0.6 + Math.random() * 0.3,
        isActive: true,
        color: `rgba(255, 255, 255, ${0.8 + Math.random() * 0.2})`,
        inkDensity: 0.7 + Math.random() * 0.3 // For ink bleeding effects
      };
    }

    function startAnimation() {
      // Create new strokes more frequently
      const strokeInterval = setInterval(() => {
        if (strokes.length < 12) {
          strokes.push(createStroke());
        }
      }, 800);

      function animate() {
        if (!ctx) return;
        
        // Clear canvas for each frame to see progressive drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        strokes.forEach((stroke, strokeIndex) => {
          if (!stroke.isActive) return;
          
          // Progress the stroke drawing
          if (stroke.currentPointIndex < stroke.points.length - 1) {
            stroke.currentPointIndex += stroke.speed;
          } else {
            // Stroke is complete, but keep it visible
            stroke.currentPointIndex = stroke.points.length - 1;
          }
          
          // Draw the stroke progressively like someone painting it
          const pointsToDraw = Math.floor(stroke.currentPointIndex);
          
          if (pointsToDraw > 0) {
            ctx.strokeStyle = stroke.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = stroke.opacity;
            
            // Draw Japanese brush stroke with pressure-sensitive width
            for (let i = 0; i < pointsToDraw - 1; i++) {
              const point1 = stroke.points[i];
              const point2 = stroke.points[i + 1];
              
              if (!point1 || !point2) continue;
              
              // Calculate width with Japanese brush taper characteristics
              const avgPressure = (point1.pressure + point2.pressure) / 2;
              const width = stroke.baseWidth * avgPressure;
              
              // Main brush stroke
              ctx.lineWidth = width;
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);
              ctx.stroke();
              
              // Add ink bleeding effect for Japanese brush authenticity
              if (avgPressure > 0.6 && Math.random() < 0.3) {
                ctx.save();
                const bleedIntensity = stroke.inkDensity * avgPressure;
                ctx.globalAlpha = stroke.opacity * 0.2 * bleedIntensity;
                ctx.lineWidth = width * 1.5;
                ctx.beginPath();
                ctx.moveTo(point1.x, point1.y);
                ctx.lineTo(point2.x, point2.y);
                ctx.stroke();
                ctx.restore();
              }
              
              // Add subtle fiber texture spots (brush bristle effects)
              if (avgPressure > 0.8 && Math.random() < 0.15) {
                ctx.save();
                ctx.fillStyle = stroke.color;
                ctx.globalAlpha = stroke.opacity * 0.4;
                const bristleSize = width * 0.2;
                
                // Multiple small dots to simulate brush fibers
                for (let j = 0; j < 3; j++) {
                  const offsetX = (Math.random() - 0.5) * width * 0.8;
                  const offsetY = (Math.random() - 0.5) * width * 0.8;
                  ctx.beginPath();
                  ctx.arc(point1.x + offsetX, point1.y + offsetY, bristleSize, 0, Math.PI * 2);
                  ctx.fill();
                }
                ctx.restore();
              }
            }
          }
        });
        
        // Remove completed strokes quickly to keep animation fresh
        for (let i = strokes.length - 1; i >= 0; i--) {
          const stroke = strokes[i];
          if (stroke.currentPointIndex >= stroke.points.length - 1) {
            // Mark stroke as completed and remove after short delay
            setTimeout(() => {
              const index = strokes.findIndex(s => s === stroke);
              if (index !== -1) {
                strokes.splice(index, 1);
              }
            }, 1500);
          }
        }
        
        requestAnimationFrame(animate);
      }

      animate();

      // Cleanup interval on component unmount
      return () => clearInterval(strokeInterval);
    }

    window.addEventListener("resize", resizeCanvas);
    
    // Start the brush stroke animation
    const cleanup = startAnimation();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden" id="home">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full bg-black" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img
            src={whiteLogo}
            alt="Landon & Co."
            className="w-80 h-auto sm:w-96 lg:w-[500px] drop-shadow-2xl"
          />
        </motion.div>
        <motion.p
          className="max-w-[600px] text-lg text-gray-300 sm:text-xl font-mono tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            filter: "contrast(1.2)",
          }}
        >
          WEB DESIGN • BRANDING • DIGITAL EXPERIENCES • BUSINESS OPTIMIZATION • AUTOMATION
        </motion.p>
        <motion.div
          className="mt-8 text-sm text-gray-500 font-mono uppercase tracking-[0.2em]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          EST. 2020
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;