import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import willWorkImage from "@assets/image_1750913419157.png";
import comicMysteryImage from "@assets/comic_mystery_boxes.png";

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
          <DialogHeader className="border-b border-white/10 p-4 flex-shrink-0">
            <DialogTitle className="text-white font-mono text-xl uppercase tracking-wider">
              {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-mono">
              Live website preview - Click "Open in New Tab" for full functionality
            </DialogDescription>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
                onClick={() => selectedProject?.url && window.open(selectedProject.url, '_blank')}
              >
                <ExternalLink size={16} className="mr-2" />
                Open in New Tab
              </Button>
            </div>
          </DialogHeader>
          {selectedProject && (
            <div className="flex-1 bg-white overflow-hidden" style={{ height: 'calc(95vh - 120px)' }}>
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