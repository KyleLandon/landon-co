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
      const strokeLength = 60 + Math.random() * 80;
      
      // Generate smoother path points
      const points: Array<{ x: number; y: number; pressure: number }> = [];
      let currentX = startX;
      let currentY = startY;
      let currentDirection = direction;
      
      for (let i = 0; i < strokeLength; i++) {
        // Much less direction variation for smoother strokes
        currentDirection += (Math.random() - 0.5) * 0.05;
        
        // Consistent step size for smoother movement
        const stepSize = 2;
        currentX += Math.cos(currentDirection) * stepSize;
        currentY += Math.sin(currentDirection) * stepSize;
        
        // Check if we're getting too close to center - if so, curve away
        const distToCenter = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);
        if (distToCenter < exclusionRadius * 1.2) {
          // Curve away from center
          const angleToCenter = Math.atan2(centerY - currentY, centerX - currentX);
          currentDirection = angleToCenter + Math.PI + (Math.random() - 0.5) * 0.5;
        }
        
        // Smooth pressure variation
        const progress = i / strokeLength;
        let pressure = 1.0;
        
        // Smoother pressure curve
        if (progress < 0.15) {
          pressure = progress / 0.15;
        } else if (progress > 0.85) {
          pressure = (1 - progress) / 0.15;
        } else {
          pressure = 0.9 + Math.sin(progress * Math.PI) * 0.1;
        }
        
        points.push({
          x: Math.max(0, Math.min(canvas.width, currentX)),
          y: Math.max(0, Math.min(canvas.height, currentY)),
          pressure: pressure
        });
      }
      
      return {
        points: points,
        currentPointIndex: 0,
        direction: direction,
        speed: 1.5,
        baseWidth: 6 + Math.random() * 8,
        opacity: 0.4 + Math.random() * 0.3,
        isActive: true,
        color: `rgba(255, 255, 255, ${0.7 + Math.random() * 0.3})`
      };
    }

    function startAnimation() {
      // Create new strokes periodically
      const strokeInterval = setInterval(() => {
        if (strokes.length < 8) {
          strokes.push(createStroke());
        }
      }, 2000);

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
            
            // Draw stroke as one smooth path
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            
            // Use quadratic curves for smooth strokes
            for (let i = 1; i < pointsToDraw; i++) {
              const point = stroke.points[i];
              const prevPoint = stroke.points[i - 1];
              
              if (!point || !prevPoint) continue;
              
              // Calculate smooth width based on pressure without random variations
              const pressure = point.pressure;
              const width = stroke.baseWidth * pressure;
              ctx.lineWidth = width;
              
              // Use quadratic curve for smoother lines
              if (i < pointsToDraw - 1) {
                const nextPoint = stroke.points[i + 1];
                if (nextPoint) {
                  const midX = (point.x + nextPoint.x) / 2;
                  const midY = (point.y + nextPoint.y) / 2;
                  ctx.quadraticCurveTo(point.x, point.y, midX, midY);
                }
              } else {
                ctx.lineTo(point.x, point.y);
              }
            }
            
            ctx.stroke();
          }
        });
        
        // Remove completed strokes after some time to prevent clutter
        for (let i = strokes.length - 1; i >= 0; i--) {
          const stroke = strokes[i];
          if (stroke.currentPointIndex >= stroke.points.length - 1) {
            // Mark stroke as completed and remove after delay
            setTimeout(() => {
              const index = strokes.findIndex(s => s === stroke);
              if (index !== -1) {
                strokes.splice(index, 1);
              }
            }, 8000);
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