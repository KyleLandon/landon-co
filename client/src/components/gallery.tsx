import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import willWorkImage from "@/assets/willwork-project.webp";
import comicMysteryImage from "@/assets/comic-project.webp";
import ThreePortfolioCard from "./three-portfolio-card";

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedProject, setSelectedProject] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const projects = [
    {
      src: willWorkImage,
      alt: "Will Work Construction website",
      title: "WILL WORK CONSTRUCTION",
      category: "CONSTRUCTION",
      url: "https://willworkconstruction.com/home",
    },
    {
      src: comicMysteryImage,
      alt: "Comic Mystery Boxes e-commerce website featuring curated comic book mystery boxes",
      title: "COMIC MYSTERY BOXES",
      category: "E-COMMERCE",
      url: "https://comic-mysteries.com",
    },
  ];

  return (
    <section id="gallery" className="relative py-20 bg-zinc-900">
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
              className="group relative overflow-hidden rounded-none border-2 border-white/20 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onClick={() => setSelectedProject({
                title: project.title,
                url: project.url
              })}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.src}
                  alt={project.alt}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:contrast-125 group-hover:saturate-0"
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
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
                <div className="mt-4 flex items-center gap-2 text-white">
                  <ExternalLink size={16} />
                  <span className="text-xs font-mono uppercase tracking-wider">Preview Website</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3D Interactive Portfolio Cards */}
        <motion.h3
          className="text-3xl font-bold text-white font-mono tracking-wider text-center mt-20 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            filter: "contrast(1.2)",
          }}
        >
          INTERACTIVE 3D SHOWCASE
        </motion.h3>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <ThreePortfolioCard
              title="WEB DEVELOPMENT"
              description="Modern websites built with cutting-edge technology and responsive design"
              onClick={() => setSelectedProject({
                title: "WEB DEVELOPMENT SHOWCASE",
                url: "https://willworkconstruction.com/"
              })}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <ThreePortfolioCard
              title="E-COMMERCE"
              description="Full-featured online stores with payment integration and inventory management"
              onClick={() => setSelectedProject({
                title: "E-COMMERCE SOLUTIONS",
                url: "https://comic-mysteries.com"
              })}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <ThreePortfolioCard
              title="BRANDING & DESIGN"
              description="Complete brand identity packages including logos, colors, and visual systems"
              onClick={() => window.open('/projects', '_blank')}
            />
          </motion.div>
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

      {/* Website Preview Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] bg-zinc-900 border-white/20 p-0">
          <DialogHeader className="border-b border-white/10 px-4 py-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white font-mono text-lg uppercase tracking-wider">
                  {selectedProject?.title}
                </DialogTitle>
                <DialogDescription className="text-gray-400 font-mono text-xs">
                  Live website preview
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 mr-8"
                onClick={() => selectedProject?.url && window.open(selectedProject.url, '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                Open in New Tab
              </Button>
            </div>
          </DialogHeader>
          {selectedProject && (
            <div className="flex-1 bg-white overflow-hidden" style={{ height: 'calc(95vh - 80px)' }}>
              <iframe
                src={selectedProject.url}
                className="w-full h-full border-0"
                title={`Preview of ${selectedProject.title}`}
                loading="lazy"
                style={{ minHeight: '100%' }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;