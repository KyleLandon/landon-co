import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const About = () => {
  const skills = [
    "React", "Next.js", "WordPress", "Shopify", "Figma", "SEO",
    "Vue.js", "Node.js", "TypeScript", "Tailwind CSS", "GraphQL", "MongoDB"
  ];

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={fadeInUp}>
            <div className="relative">
              <motion.img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
                alt="Professional workspace"
                className="rounded-xl shadow-2xl w-full h-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--blue-accent)] rounded-xl opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              About Landon & Co.
            </motion.h2>
            
            <div className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed">
              <motion.p variants={fadeInUp}>
                Hi, I'm Landon – a web designer and developer passionate about creating digital experiences that help local businesses thrive online.
              </motion.p>
              
              <motion.p variants={fadeInUp}>
                With over 5 years of experience in web development, I specialize in building modern, responsive websites that not only look great but also drive real business results. I believe in the power of good design to transform how customers interact with your brand.
              </motion.p>
              
              <motion.p variants={fadeInUp}>
                When I'm not coding or designing, you can find me exploring the local coffee scene, hiking mountain trails, or collaborating with fellow creatives in the community. I'm committed to supporting local businesses and helping them succeed in the digital world.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="px-4 py-2 bg-[var(--dark-secondary)] rounded-full text-sm cursor-pointer hover:bg-[var(--blue-accent)] transition-colors duration-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
