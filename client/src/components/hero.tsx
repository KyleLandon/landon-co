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
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const direction = Math.random() * Math.PI * 2;
      const strokeLength = 80 + Math.random() * 120;
      
      // Generate organic path points similar to your grunge logo style
      const points: Array<{ x: number; y: number; pressure: number }> = [];
      let currentX = startX;
      let currentY = startY;
      let currentDirection = direction;
      
      for (let i = 0; i < strokeLength; i++) {
        // Add organic variation to direction (like hand-drawn strokes)
        currentDirection += (Math.random() - 0.5) * 0.2;
        
        // Variable step size for natural movement
        const stepSize = 1.5 + Math.random() * 2;
        currentX += Math.cos(currentDirection) * stepSize;
        currentY += Math.sin(currentDirection) * stepSize;
        
        // Varying pressure throughout the stroke (thick to thin like your logo)
        const progress = i / strokeLength;
        let pressure = 1.0;
        
        // Start thin, get thick in middle, end thin (like natural brush strokes)
        if (progress < 0.1) {
          pressure = progress * 10;
        } else if (progress > 0.8) {
          pressure = (1 - progress) * 5;
        } else {
          pressure = 0.8 + Math.random() * 0.4;
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
        speed: 1 + Math.random() * 2,
        baseWidth: 8 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.4,
        isActive: true,
        color: `rgba(255, 255, 255, ${0.6 + Math.random() * 0.4})`
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
            
            // Draw each segment with varying width based on pressure
            for (let i = 0; i < pointsToDraw - 1; i++) {
              const point1 = stroke.points[i];
              const point2 = stroke.points[i + 1];
              
              if (!point1 || !point2) continue;
              
              // Calculate width based on pressure and add roughness like your logo
              const avgPressure = (point1.pressure + point2.pressure) / 2;
              const width = stroke.baseWidth * avgPressure;
              
              // Add some roughness/texture variation
              const roughness = 1 + (Math.random() - 0.5) * 0.3;
              ctx.lineWidth = width * roughness;
              
              ctx.beginPath();
              ctx.moveTo(point1.x, point1.y);
              ctx.lineTo(point2.x, point2.y);
              ctx.stroke();
              
              // Add some organic texture spots occasionally (like ink bleeding)
              if (Math.random() < 0.1 && avgPressure > 0.7) {
                ctx.fillStyle = stroke.color;
                ctx.globalAlpha = stroke.opacity * 0.3;
                const spotSize = width * 0.3;
                ctx.beginPath();
                ctx.arc(point1.x + (Math.random() - 0.5) * 2, 
                       point1.y + (Math.random() - 0.5) * 2, 
                       spotSize, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = stroke.opacity;
              }
            }
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