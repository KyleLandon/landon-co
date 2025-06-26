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

    const brushStrokes: Array<{
      points: Array<{ x: number; y: number; pressure: number }>;
      progress: number;
      opacity: number;
      baseWidth: number;
      speed: number;
      maxLength: number;
      direction: number;
      directionChange: number;
    }> = [];
    const strokeCount = 6;

    for (let i = 0; i < strokeCount; i++) {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const maxLength = Math.random() * 80 + 40;
      
      brushStrokes.push({
        points: [{ x: startX, y: startY, pressure: Math.random() * 0.5 + 0.5 }],
        progress: 0,
        opacity: Math.random() * 0.2 + 0.08,
        baseWidth: Math.random() * 15 + 8,
        speed: Math.random() * 0.4 + 0.2,
        maxLength: maxLength,
        direction: Math.random() * Math.PI * 2,
        directionChange: 0,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      brushStrokes.forEach((stroke) => {
        stroke.progress += stroke.speed;
        
        // Add new point to the stroke path
        if (stroke.points.length < stroke.maxLength && stroke.progress > stroke.points.length * 2) {
          const lastPoint = stroke.points[stroke.points.length - 1];
          
          // Update direction with slight random changes for organic movement
          stroke.directionChange += (Math.random() - 0.5) * 0.3;
          stroke.direction += stroke.directionChange;
          stroke.directionChange *= 0.8; // Damping
          
          const distance = Math.random() * 25 + 15;
          const newPoint = {
            x: lastPoint.x + Math.cos(stroke.direction) * distance,
            y: lastPoint.y + Math.sin(stroke.direction) * distance,
            pressure: Math.random() * 0.6 + 0.3 // Varying pressure for brush effect
          };
          
          // Keep stroke within canvas bounds
          newPoint.x = Math.max(stroke.baseWidth, Math.min(canvas.width - stroke.baseWidth, newPoint.x));
          newPoint.y = Math.max(stroke.baseWidth, Math.min(canvas.height - stroke.baseWidth, newPoint.y));
          
          stroke.points.push(newPoint);
        }
        
        // Reset stroke when it reaches max length
        if (stroke.points.length >= stroke.maxLength) {
          stroke.points = [{ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height,
            pressure: Math.random() * 0.5 + 0.5
          }];
          stroke.progress = 0;
          stroke.direction = Math.random() * Math.PI * 2;
          stroke.directionChange = 0;
        }
        
        // Draw the brush stroke with varying width
        if (stroke.points.length > 1) {
          ctx.globalAlpha = stroke.opacity;
          ctx.strokeStyle = 'white';
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Draw stroke segments with varying thickness
          for (let i = 0; i < stroke.points.length - 1; i++) {
            const point1 = stroke.points[i];
            const point2 = stroke.points[i + 1];
            
            // Calculate brush width based on pressure and position
            const pressureEffect = (point1.pressure + point2.pressure) / 2;
            const positionEffect = 1 - (i / stroke.points.length) * 0.3; // Taper towards end
            const currentWidth = stroke.baseWidth * pressureEffect * positionEffect;
            
            ctx.lineWidth = currentWidth;
            
            ctx.beginPath();
            ctx.moveTo(point1.x, point1.y);
            ctx.lineTo(point2.x, point2.y);
            ctx.stroke();
            
            // Add some texture with smaller random marks
            if (Math.random() < 0.3) {
              const offsetX = (Math.random() - 0.5) * currentWidth * 0.5;
              const offsetY = (Math.random() - 0.5) * currentWidth * 0.5;
              
              ctx.lineWidth = currentWidth * 0.3;
              ctx.globalAlpha = stroke.opacity * 0.4;
              ctx.beginPath();
              ctx.moveTo(point1.x + offsetX, point1.y + offsetY);
              ctx.lineTo(point2.x + offsetX, point2.y + offsetY);
              ctx.stroke();
              ctx.globalAlpha = stroke.opacity;
            }
          }
          
          ctx.globalAlpha = 1;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
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