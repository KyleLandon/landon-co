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
      points: Array<{ x: number; y: number }>;
      progress: number;
      opacity: number;
      width: number;
      speed: number;
      maxLength: number;
    }> = [];
    const strokeCount = 8;

    for (let i = 0; i < strokeCount; i++) {
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;
      const maxLength = Math.random() * 150 + 100;
      
      brushStrokes.push({
        points: [{ x: startX, y: startY }],
        progress: 0,
        opacity: Math.random() * 0.15 + 0.05,
        width: Math.random() * 20 + 5,
        speed: Math.random() * 0.3 + 0.1,
        maxLength: maxLength,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      brushStrokes.forEach((stroke) => {
        // Update stroke progress
        stroke.progress += stroke.speed;
        
        // Add new point to the stroke path
        if (stroke.points.length < stroke.maxLength && stroke.progress > stroke.points.length) {
          const lastPoint = stroke.points[stroke.points.length - 1];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 30 + 10;
          
          const newPoint = {
            x: lastPoint.x + Math.cos(angle) * distance,
            y: lastPoint.y + Math.sin(angle) * distance
          };
          
          // Keep stroke within canvas bounds
          newPoint.x = Math.max(0, Math.min(canvas.width, newPoint.x));
          newPoint.y = Math.max(0, Math.min(canvas.height, newPoint.y));
          
          stroke.points.push(newPoint);
        }
        
        // Reset stroke when it reaches max length
        if (stroke.points.length >= stroke.maxLength) {
          stroke.points = [{ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height 
          }];
          stroke.progress = 0;
        }
        
        // Draw the brush stroke
        if (stroke.points.length > 1) {
          ctx.globalAlpha = stroke.opacity;
          ctx.strokeStyle = 'white';
          ctx.lineWidth = stroke.width;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          ctx.beginPath();
          ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
          
          for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
          }
          
          ctx.stroke();
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