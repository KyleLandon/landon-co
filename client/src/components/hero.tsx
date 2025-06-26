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
      speed: number;
      baseWidth: number;
      opacity: number;
      isActive: boolean;
      color: string;
    }> = [];

    function createStroke() {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const exclusionRadius = Math.min(canvas.width, canvas.height) * 0.35;
      
      let startX, startY;
      let attempts = 0;
      
      do {
        startX = Math.random() * canvas.width;
        startY = Math.random() * canvas.height;
        attempts++;
      } while (
        Math.sqrt((startX - centerX) ** 2 + (startY - centerY) ** 2) < exclusionRadius &&
        attempts < 50
      );
      
      if (attempts >= 50) {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
          case 0:
            startX = Math.random() * canvas.width;
            startY = Math.random() * (canvas.height * 0.15);
            break;
          case 1:
            startX = Math.random() * canvas.width;
            startY = canvas.height - Math.random() * (canvas.height * 0.15);
            break;
          case 2:
            startX = Math.random() * (canvas.width * 0.15);
            startY = Math.random() * canvas.height;
            break;
          case 3:
            startX = canvas.width - Math.random() * (canvas.width * 0.15);
            startY = Math.random() * canvas.height;
            break;
        }
      }
      
      const direction = Math.random() * Math.PI * 2;
      const strokeLength = 40 + Math.random() * 60;
      const points: Array<{ x: number; y: number; pressure: number }> = [];
      let currentX = startX;
      let currentY = startY;
      let currentDirection = direction;
      let velocity = 0.5 + Math.random() * 1.5;
      
      for (let i = 0; i < strokeLength; i++) {
        currentDirection += (Math.random() - 0.5) * 0.08;
        const stepSize = velocity * (1.5 + Math.random() * 0.5);
        currentX += Math.cos(currentDirection) * stepSize;
        currentY += Math.sin(currentDirection) * stepSize;
        velocity *= 0.995;
        
        const distanceToCenter = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);
        if (distanceToCenter < exclusionRadius * 1.2) {
          const angleToCenter = Math.atan2(centerY - currentY, centerX - currentX);
          currentDirection = angleToCenter + Math.PI + (Math.random() - 0.5) * 0.5;
        }
        
        if (currentX < 0 || currentX > canvas.width || currentY < 0 || currentY > canvas.height) {
          break;
        }
        
        const progress = i / strokeLength;
        let pressure = Math.sin(progress * Math.PI) * (0.7 + Math.random() * 0.3);
        pressure += (Math.random() - 0.5) * 0.3;
        pressure = Math.max(0.3, Math.min(1.0, pressure));
        
        points.push({ x: currentX, y: currentY, pressure });
      }
      
      return {
        points,
        currentPointIndex: 0,
        speed: 2.5,
        baseWidth: 8 + Math.random() * 6,
        opacity: 0.6 + Math.random() * 0.3,
        isActive: true,
        color: `rgba(255, 255, 255, ${0.8 + Math.random() * 0.2})`
      };
    }

    function startAnimation() {
      const strokeInterval = setInterval(() => {
        if (strokes.length < 12) {
          strokes.push(createStroke());
        }
      }, 800);

      function animate() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        strokes.forEach((stroke) => {
          if (!stroke.isActive) return;
          
          if (stroke.currentPointIndex < stroke.points.length - 1) {
            stroke.currentPointIndex += stroke.speed;
          } else {
            stroke.currentPointIndex = stroke.points.length - 1;
          }
          
          const pointsToDraw = Math.floor(stroke.currentPointIndex);
          
          if (pointsToDraw > 0) {
            ctx.strokeStyle = stroke.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalAlpha = stroke.opacity;
            
            ctx.beginPath();
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            
            for (let i = 1; i < pointsToDraw; i++) {
              const point = stroke.points[i];
              if (!point) continue;
              
              const pressure = point.pressure;
              const baseWidth = stroke.baseWidth * pressure;
              ctx.lineWidth = Math.max(1, baseWidth);
              
              ctx.lineTo(point.x, point.y);
            }
            
            ctx.stroke();
          }
          
          if (Math.random() < 0.002 && strokes.length > 8) {
            const index = Math.floor(Math.random() * strokes.length);
            setTimeout(() => {
              if (strokes[index]) {
                strokes.splice(index, 1);
              }
            }, 1500);
          }
        });
        
        requestAnimationFrame(animate);
      }

      animate();
      return () => clearInterval(strokeInterval);
    }

    window.addEventListener("resize", resizeCanvas);
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
          className="mb-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            {/* LANDON - Top part */}
            <motion.div
              className="relative overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                WebkitMaskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 52%, 85% 47%, 70% 47%, 60% 42%, 30% 52%, 15% 57%, 0% 62%)"
              }}
              animate={{
                maskImage: [
                  "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                  "linear-gradient(90deg, white 0%, white 100%, transparent 100%)"
                ],
                WebkitMaskImage: [
                  "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                  "linear-gradient(90deg, white 0%, white 100%, transparent 100%)"
                ]
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <img
                src={whiteLogo}
                alt="Landon & Co."
                className="w-96 h-auto max-w-full"
              />
            </motion.div>

            {/* C&O. - Bottom part */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                WebkitMaskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                clipPath: "polygon(0% 62%, 15% 57%, 30% 52%, 60% 42%, 70% 47%, 85% 47%, 100% 52%, 100% 100%, 0% 100%)"
              }}
              animate={{
                maskImage: [
                  "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                  "linear-gradient(90deg, white 0%, white 100%, transparent 100%)"
                ],
                WebkitMaskImage: [
                  "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                  "linear-gradient(90deg, white 0%, white 100%, transparent 100%)"
                ]
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                delay: 3.5
              }}
            >
              <img
                src={whiteLogo}
                alt="Landon & Co."
                className="w-96 h-auto max-w-full"
              />
            </motion.div>
          </div>

          {/* Paint brush effect for LANDON */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 52%, 85% 47%, 70% 47%, 60% 42%, 30% 52%, 15% 57%, 0% 62%)"
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Paint brush effect for C&O. */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "polygon(0% 62%, 15% 57%, 30% 52%, 60% 42%, 70% 47%, 85% 47%, 100% 52%, 100% 100%, 0% 100%)"
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              delay: 3.5
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        </motion.div>

        <motion.div
          className="max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 6.5 }}
        >
          <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
            We create digital experiences that drive local business growth
          </h2>
          <p className="mb-8 text-lg text-gray-300 md:text-xl">
            From concept to launch, we design and develop websites that convert visitors into customers
          </p>
          <motion.a
            href="#contact"
            className="inline-block bg-white px-8 py-3 text-lg font-semibold text-black transition-all duration-300 hover:bg-gray-200 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;