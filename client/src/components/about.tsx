import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const About = () => {
  const skills = [
    "React", "TypeScript", "WordPress", "Shopify", "Figma", "SEO",
    "Next.js", "Node.js", "Tailwind CSS", "GraphQL", "MongoDB", "Automation"
  ];

  return (
    <section id="about" className="relative py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="mb-12 text-center text-4xl font-bold tracking-wider sm:text-5xl font-mono uppercase text-white"
            style={{
              textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
              filter: "contrast(1.3)",
            }}
          >
            ABOUT LANDON & CO.
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeInUp}>
              <div className="relative">
                <motion.img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
                  alt="Professional workspace"
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-6">
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-mono">
                <motion.p variants={fadeInUp}>
                  Hi, I'm Landon – a web designer and developer passionate about creating digital experiences that help local businesses thrive online.
                </motion.p>
                
                <motion.p variants={fadeInUp}>
                  With over 5 years of experience in web development, I specialize in building modern, responsive websites that not only look great but also drive real business results.
                </motion.p>
                
                <motion.p variants={fadeInUp}>
                  I'm committed to supporting local businesses and helping them succeed in the digital world through clean design, solid code, and authentic user experiences.
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white font-mono uppercase tracking-wider">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-black/50 border border-white/20 text-sm cursor-pointer hover:bg-white/10 transition-colors duration-300 font-mono text-white"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: 30 }).map((_, i) => (
            <line key={i} x1={i * 3.33} y1="0" x2={i * 3.33} y2="100" stroke="white" strokeWidth="0.2" />
          ))}
        </svg>
      </div>
    </section>
  );
};

export default About;
