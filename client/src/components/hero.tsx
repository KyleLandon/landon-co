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
    window.addEventListener('resize', resizeCanvas);

    // Particle class for snow effect
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
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
                clipPath: "polygon(0% 0%, 100% 0%, 100% 52%, 85% 47%, 70% 47%, 60% 42%, 30% 52%, 15% 57%, 0% 62%)" // Curved arc under LANDON
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
                clipPath: "polygon(0% 62%, 15% 57%, 30% 52%, 60% 42%, 70% 47%, 85% 47%, 100% 52%, 100% 100%, 0% 100%)" // Show bottom part following curve
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
              clipPath: "polygon(0% 0%, 100% 0%, 100% 52%, 85% 47%, 70% 47%, 60% 42%, 30% 52%, 15% 57%, 0% 62%)"
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm" />
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
              duration: 1.5,
              ease: "easeInOut",
              delay: 2.8
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm" />
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 4.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 font-mono tracking-tight">
            Web Design & Development
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-mono">
            Creating powerful digital experiences for local businesses. From custom websites to automated workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#gallery"
              className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;