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
        
        // Paint brush pressure - more consistent width like actual paint strokes
        const progress = i / strokeLength;
        let pressure = 1.0;
        
        // Paint brush characteristics: consistent width with subtle fade at ends
        if (progress < 0.1) {
          // Gradual start
          pressure = 0.6 + (progress / 0.1) * 0.4;
        } else if (progress > 0.9) {
          // Gradual end
          const fadeProgress = (progress - 0.9) / 0.1;
          pressure = 1.0 - (fadeProgress * 0.3);
        } else {
          // Main body - consistent pressure with minimal variation
          pressure = 0.95 + Math.sin(progress * Math.PI * 2) * 0.05;
        }
        
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
        baseWidth: 8 + Math.random() * 6, // Consistent paint brush width
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
            
            // Draw rough-edged brush stroke with multiple passes for texture
            for (let pass = 0; pass < 3; pass++) {
              ctx.save();
              
              // Each pass creates rougher edges
              const roughness = pass * 0.5 + 0.3;
              const alphaMultiplier = 1 - (pass * 0.2);
              ctx.globalAlpha = stroke.opacity * alphaMultiplier;
              
              ctx.beginPath();
              ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
              
              for (let i = 1; i < pointsToDraw; i++) {
                const point = stroke.points[i];
                const prevPoint = stroke.points[i - 1];
                
                if (!point || !prevPoint) continue;
                
                // Calculate width with slight variation for texture
                const pressure = point.pressure;
                const baseWidth = stroke.baseWidth * pressure;
                const widthVariation = pass === 0 ? 0 : (Math.random() - 0.5) * roughness;
                ctx.lineWidth = Math.max(1, baseWidth + widthVariation);
                
                // Add roughness to the stroke path
                let targetX = point.x;
                let targetY = point.y;
                
                if (pass > 0) {
                  // Add edge roughness - simulate brush bristle separation
                  const roughnessAmount = roughness * baseWidth * 0.1;
                  targetX += (Math.random() - 0.5) * roughnessAmount;
                  targetY += (Math.random() - 0.5) * roughnessAmount;
                }
                
                // Use quadratic curves for more natural brush texture
                if (i < pointsToDraw - 1) {
                  const nextPoint = stroke.points[i + 1];
                  if (nextPoint) {
                    const midX = (targetX + nextPoint.x) / 2;
                    const midY = (targetY + nextPoint.y) / 2;
                    ctx.quadraticCurveTo(targetX, targetY, midX, midY);
                  }
                } else {
                  ctx.lineTo(targetX, targetY);
                }
              }
              
              ctx.stroke();
              ctx.restore();
            }
            
            // Add bristle texture spots for additional roughness
            if (Math.random() < 0.4) {
              ctx.save();
              ctx.fillStyle = stroke.color;
              ctx.globalAlpha = stroke.opacity * 0.3;
              
              // Random bristle marks along the stroke
              for (let i = 5; i < pointsToDraw; i += 8) {
                const point = stroke.points[i];
                if (!point) continue;
                
                const bristleSize = (stroke.baseWidth * point.pressure) * 0.15;
                const bristleCount = 2 + Math.floor(Math.random() * 3);
                
                for (let b = 0; b < bristleCount; b++) {
                  const offsetDistance = stroke.baseWidth * 0.3;
                  const angle = Math.random() * Math.PI * 2;
                  const bristleX = point.x + Math.cos(angle) * offsetDistance * Math.random();
                  const bristleY = point.y + Math.sin(angle) * offsetDistance * Math.random();
                  
                  ctx.beginPath();
                  ctx.arc(bristleX, bristleY, bristleSize, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
              
              ctx.restore();
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
          className="mb-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Two-part painting animation */}
          <div className="relative">
            {/* LANDON - Top part */}
            <motion.div
              className="relative overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                WebkitMaskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 85% 65%, 70% 60%, 50% 57%, 30% 60%, 15% 65%, 0% 70%)" // Curved arc under LANDON
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
                duration: 2,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              <img
                src={whiteLogo}
                alt="Landon & Co."
                className="w-80 h-auto sm:w-96 lg:w-[500px] drop-shadow-2xl"
              />
            </motion.div>

            {/* C&O. - Bottom part */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              style={{
                maskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                WebkitMaskImage: "linear-gradient(90deg, white 0%, white 0%, transparent 0%)",
                clipPath: "polygon(0% 70%, 15% 65%, 30% 60%, 50% 57%, 70% 60%, 85% 65%, 100% 70%, 100% 100%, 0% 100%)" // Show bottom part following curve
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
                duration: 1.5,
                ease: "easeInOut",
                delay: 2.8 // Start after LANDON finishes
              }}
            >
              <img
                src={whiteLogo}
                alt="Landon & Co."
                className="w-80 h-auto sm:w-96 lg:w-[500px] drop-shadow-2xl"
              />
            </motion.div>
          </div>
          
          {/* Paint brush effect for LANDON */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 85% 65%, 70% 60%, 50% 57%, 30% 60%, 15% 65%, 0% 70%)"
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <div
              className="h-full w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
              style={{
                filter: "blur(8px)"
              }}
            />
          </motion.div>

          {/* Paint brush effect for C&O. */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: "polygon(0% 70%, 15% 65%, 30% 60%, 50% 57%, 70% 60%, 85% 65%, 100% 70%, 100% 100%, 0% 100%)"
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              delay: 2.8
            }}
          >
            <div
              className="h-full w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
              style={{
                filter: "blur(8px)"
              }}
            />
          </motion.div>
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