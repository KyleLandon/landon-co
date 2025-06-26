import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "Artisan Coffee Co.",
      description: "E-commerce website with inventory management and online ordering system.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["React", "Shopify"],
      category: "E-commerce"
    },
    {
      id: 2,
      title: "Sterling Legal Group",
      description: "Professional law firm website with client portal and appointment booking.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["WordPress", "Custom PHP"],
      category: "Corporate"
    },
    {
      id: 3,
      title: "Bella Vista Restaurant",
      description: "Modern restaurant site with online menu and reservation system.",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["Vue.js", "Node.js"],
      category: "Restaurant"
    },
    {
      id: 4,
      title: "FitCore Studio",
      description: "Fitness studio website with class scheduling and member portal.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["Next.js", "Stripe"],
      category: "Fitness"
    },
    {
      id: 5,
      title: "Premier Properties",
      description: "Real estate platform with advanced search and virtual tours.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["Angular", "Firebase"],
      category: "Real Estate"
    },
    {
      id: 6,
      title: "HealthFirst Clinic",
      description: "Medical practice website with patient portal and online booking.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      tech: ["React", "HIPAA"],
      category: "Healthcare"
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Recent Work
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            A selection of websites and digital experiences I've crafted for local businesses.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              className="bg-[var(--dark-secondary)] rounded-xl overflow-hidden group cursor-pointer"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/20 rounded-full backdrop-blur-sm"
                  >
                    <Github className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <span className="text-xs px-2 py-1 bg-[var(--dark-tertiary)] rounded-full text-[var(--text-secondary)]">
                    {project.category}
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-[var(--dark-tertiary)] rounded-full text-sm text-[var(--text-primary)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
