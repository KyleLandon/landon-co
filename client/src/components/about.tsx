import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import aboutImage from "@assets/image_1751028167774.jpeg";

const About = () => {
  const skills = [
    "Web Development", "Branding", "Workflow Automation", "IT Consulting",
    "Custom Solutions", "Business Strategy", "Technical Support", "Digital Marketing",
    "React", "TypeScript", "WordPress", "Shopify"
  ];

  return (
    <section id="about" className="relative py-20 bg-gradient-to-b from-black via-zinc-900 to-black">
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
              <div className="relative bg-zinc-800/30 p-6 rounded-lg border border-zinc-700/50">
                <motion.img
                  src={aboutImage}
                  alt="Kyle Landon, founder of Landon & Co. web development services"
                  className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 rounded"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-6 bg-black/10 rounded pointer-events-none"></div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8">
              <div className="bg-zinc-800/20 p-6 rounded-lg border border-zinc-700/30">
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-mono">
                  <motion.p variants={fadeInUp}>
                    Landon & Co. was founded to help entrepreneurs overcome the hurdle of building a 
                    digital presence—without breaking the bank. Our mission is simple: provide 
                    affordable, high-quality services that empower hardworking business owners and 
                    give them a head start in the modern online world.
                  </motion.p>
                  
                  <motion.p variants={fadeInUp}>
                    We specialize in web development, branding, workflow automations, and IT consulting. 
                    Whether you're launching your first website or need a digital facelift, Landon & Co. 
                    is here to guide you. We don't just build sites—we solve problems. From technical 
                    issues to business process inefficiencies, we offer custom solutions to help your 
                    business run smarter.
                  </motion.p>
                </div>
              </div>

              <div className="bg-zinc-800/20 p-6 rounded-lg border border-zinc-700/30">
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-mono">
                  <motion.p variants={fadeInUp}>
                    What sets us apart is our commitment to people over profit. We care deeply about 
                    our clients' success and aim to build lasting relationships based on trust, 
                    transparency, and results.
                  </motion.p>
                  
                  <motion.p variants={fadeInUp}>
                    Kyle Landon, the founder, was raised by an entrepreneur and started working in his 
                    family's small business at the age of 11. Growing up in the fast-paced world of 
                    small business taught him what owners truly need to succeed—and he's bringing that 
                    experience to every project.
                  </motion.p>
                  
                  <motion.p variants={fadeInUp} className="text-white font-semibold">
                    At Landon & Co., we're not just building websites—we're building long-term partnerships.
                  </motion.p>
                </div>
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
      
      {/* Subtle background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-white/10 rounded-full"></div>
        <div className="absolute top-3/4 right-20 w-1 h-1 bg-white/20 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-white/15 rounded-full"></div>
      </div>
    </section>
  );
};

export default About;
