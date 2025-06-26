import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";

// SVG brush stroke data as base64 - realistic white brush textures
const brushStrokes = [
  // Brush stroke 1 - thick textured stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="200" height="50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="roughPaper">
          <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed="1"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
        </filter>
      </defs>
      <path d="M10,25 Q50,10 100,20 Q150,30 190,15" 
            stroke="#ffffff" 
            stroke-width="8" 
            stroke-linecap="round" 
            stroke-linejoin="round"
            fill="none" 
            filter="url(#roughPaper)"/>
      <path d="M15,28 Q55,15 105,25 Q155,35 185,20" 
            stroke="#ffffff" 
            stroke-width="4" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.6"/>
    </svg>
  `),
  // Brush stroke 2 - thin wispy stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="150" height="60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="roughPaper2">
          <feTurbulence baseFrequency="0.05" numOctaves="4" result="noise" seed="2"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8"/>
        </filter>
      </defs>
      <path d="M5,30 Q40,10 80,35 Q120,50 145,25" 
            stroke="#ffffff" 
            stroke-width="6" 
            stroke-linecap="round" 
            fill="none" 
            filter="url(#roughPaper2)"/>
      <path d="M8,33 Q43,13 83,38 Q123,53 142,28" 
            stroke="#ffffff" 
            stroke-width="2" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.5"/>
    </svg>
  `),
  // Brush stroke 3 - bold artistic stroke
  "data:image/svg+xml;base64," + btoa(`
    <svg width="180" height="70" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="roughPaper3">
          <feTurbulence baseFrequency="0.03" numOctaves="6" result="noise" seed="3"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2"/>
        </filter>
      </defs>
      <path d="M10,35 Q60,15 120,40 Q160,60 170,30" 
            stroke="#ffffff" 
            stroke-width="12" 
            stroke-linecap="round" 
            fill="none" 
            filter="url(#roughPaper3)"/>
      <path d="M12,38 Q62,18 122,43 Q162,63 168,33" 
            stroke="#ffffff" 
            stroke-width="6" 
            stroke-linecap="round" 
            fill="none" 
            opacity="0.4"/>
      <path d="M14,40 Q64,20 124,45 Q164,65 166,35" 
            stroke="#ffffff" 
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
      rotation: number;
      opacity: number;
      targetOpacity: number;
      fadeSpeed: number;
      lifetime: number;
      maxLifetime: number;
      isPermanent: boolean;
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
        y: Math.random() * canvas.height,
        size: 100 + Math.random() * 150,
        rotation: Math.random() * 2 * Math.PI,
        opacity: 0,
        targetOpacity: 0.2 + Math.random() * 0.3,
        fadeSpeed: 0.005 + Math.random() * 0.01,
        lifetime: 0,
        maxLifetime: 200 + Math.random() * 300,
        isPermanent: false
      };
    }

    function startAnimation() {
      // Create new strokes periodically
      const strokeInterval = setInterval(() => {
        strokes.push(createStroke());
      }, 1200);

      function animate() {
        if (!ctx) return;
        
        // Don't clear the canvas completely - let strokes accumulate like paint
        // Only clear occasionally to prevent too much buildup
        if (strokes.length > 30) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        strokes.forEach((stroke, index) => {
          stroke.lifetime++;
          
          // Fade in the stroke
          if (stroke.opacity < stroke.targetOpacity) {
            stroke.opacity += stroke.fadeSpeed;
          } else {
            stroke.isPermanent = true;
          }
          
          // Draw the stroke
          ctx.save();
          ctx.globalAlpha = stroke.opacity;
          ctx.translate(stroke.x, stroke.y);
          ctx.rotate(stroke.rotation);
          
          // Use source-over for normal blending
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(
            stroke.img, 
            -stroke.size / 2, 
            -stroke.size / 2, 
            stroke.size, 
            stroke.size
          );
          ctx.restore();
          
          // Remove strokes after their lifetime (for performance)
          if (stroke.lifetime > stroke.maxLifetime && strokes.length > 15) {
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