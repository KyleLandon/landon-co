import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";

// SVG brush stroke data as base64 - realistic brush textures
const brushStrokes = [
  // Brush stroke 1 - thick textured stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,25 Q50,10 100,20 Q150,30 190,15" 
            stroke="white" 
            stroke-width="8" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            fill="none" 
            opacity="0.8"/>
      <path d="M15,28 Q55,15 105,25 Q155,35 185,20" 
            stroke="white" 
            stroke-width="4" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.4"/>
    </svg>
  `),
  // Brush stroke 2 - thin wispy stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="150" height="60" xmlns="http://www.w3.org/2000/svg">
      <path d="M5,30 Q40,10 80,35 Q120,50 145,25" 
            stroke="white" 
            stroke-width="6" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.7"/>
      <path d="M8,33 Q43,13 83,38 Q123,53 142,28" 
            stroke="white" 
            stroke-width="2" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.3"/>
    </svg>
  `),
  // Brush stroke 3 - bold artistic stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="180" height="70" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,35 Q60,15 120,40 Q160,60 170,30" 
            stroke="white" 
            stroke-width="12" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.9"/>
      <path d="M12,38 Q62,18 122,43 Q162,63 168,33" 
            stroke="white" 
            stroke-width="6" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.3"/>
      <path d="M14,40 Q64,20 124,45 Q164,65 166,35" 
            stroke="white" 
            stroke-width="2" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.2"/>
    </svg>
  `)
];

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
      img: HTMLImageElement;
      x: number;
      y: number;
      size: number;
      speed: number;
      rotation: number;
      opacity: number;
    }> = [];

    const brushImages: HTMLImageElement[] = [];
    let loadedImages = 0;

    // Load brush stroke images
    brushStrokes.forEach((strokeData, index) => {
      const img = new Image();
      img.src = strokeData;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === brushStrokes.length) {
          startAnimation();
        }
      };
      brushImages.push(img);
    });

    function createStroke() {
      return {
        img: brushImages[Math.floor(Math.random() * brushImages.length)],
        x: Math.random() * canvas.width,
        y: canvas.height + 100,
        size: 80 + Math.random() * 120,
        speed: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * 2 * Math.PI,
        opacity: 0.15 + Math.random() * 0.25
      };
    }

    function startAnimation() {
      // Create new strokes periodically
      const strokeInterval = setInterval(() => {
        strokes.push(createStroke());
      }, 800);

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        strokes.forEach((stroke, index) => {
          ctx.save();
          ctx.globalAlpha = stroke.opacity;
          ctx.translate(stroke.x, stroke.y);
          ctx.rotate(stroke.rotation);
          ctx.drawImage(
            stroke.img, 
            -stroke.size / 2, 
            -stroke.size / 2, 
            stroke.size, 
            stroke.size
          );
          ctx.restore();
          
          stroke.y -= stroke.speed;
          
          // Remove strokes that have moved off screen
          if (stroke.y < -stroke.size) {
            strokes.splice(index, 1);
          }
        });
        
        requestAnimationFrame(animate);
      }

      animate();

      // Cleanup interval on component unmount
      return () => clearInterval(strokeInterval);
    }

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