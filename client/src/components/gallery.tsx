import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const projects = [
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      alt: "E-commerce website design",
      title: "ARTISAN COFFEE",
      category: "E-COMMERCE",
    },
    {
      src: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop",
      alt: "Restaurant website design",
      title: "BELLA VISTA",
      category: "RESTAURANT",
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      alt: "Tech startup website",
      title: "FITCORE STUDIO",
      category: "FITNESS",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
      alt: "Legal firm website",
      title: "STERLING LEGAL",
      category: "CORPORATE",
    },
  ];

  return (
    <section className="relative py-20 bg-zinc-900">
      <div ref={ref} className="container mx-auto px-4">
        <motion.h2
          className="mb-12 text-center text-4xl font-bold tracking-wider sm:text-5xl font-mono uppercase"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
            filter: "contrast(1.3)",
          }}
        >
          FEATURED WORK
        </motion.h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-none border-2 border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.src}
                  alt={project.alt}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:contrast-125 group-hover:saturate-0"
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3
                  className="text-2xl font-bold text-white font-mono tracking-wider mb-2"
                  style={{
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    filter: "contrast(1.2)",
                  }}
                >
                  {project.title}
                </h3>
                <p className="text-sm text-gray-300 font-mono tracking-widest uppercase">{project.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* View All Projects Button */}
        <motion.div 
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <Link href="/projects">
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-mono px-8 py-3 text-sm tracking-wider uppercase transition-all duration-300"
            >
              VIEW ALL PROJECTS
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;