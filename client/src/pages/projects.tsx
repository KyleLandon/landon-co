import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import willWorkImage from "@/assets/willwork-project.webp";
import comicMysteryImage from "@/assets/comic-project.webp";

const projects = [
  {
    id: 1,
    title: "Will Work Construction",
    description: "Professional construction company website with modern design and service showcases",
    image: willWorkImage,
    tags: ["React", "TypeScript", "Responsive Design", "Business Website"],
    demoUrl: "https://willworkconstruction.com/home",
    category: "Web Development"
  },
  {
    id: 2,
    title: "Comic Mystery Boxes",
    description: "E-commerce platform for curated comic book mystery boxes with modern design and seamless shopping experience",
    image: comicMysteryImage,
    tags: ["React", "E-commerce", "Comic Books", "Mystery Boxes"],
    demoUrl: "https://comic-mysteries.com",
    category: "Web Development"
  }
];

const categories = ["All", "Web Development", "Branding", "Design", "Digital Marketing", "Automation"];

export default function Projects() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header 
        className="border-b border-white/20 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 font-mono">
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO HOME
              </Button>
            </Link>
            <h1 className="text-2xl font-mono font-bold tracking-wider">ALL PROJECTS</h1>
          </div>
        </div>
      </motion.header>

      {/* Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            {/* Filter Tabs */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap justify-center gap-4"
            >
              {categories.map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 font-mono text-sm"
                >
                  {category}
                </Button>
              ))}
            </motion.div>

            {/* Projects Grid */}
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.div key={project.id} variants={fadeInUp}>
                  <Card className="bg-black border-white/20 rounded-none overflow-hidden group hover:border-white/40 transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${project.title} live site`}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      >
                        <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 pointer-events-none">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Site
                        </Button>
                      </a>
                    </div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                          {project.category}
                        </span>
                      </div>
                      <CardTitle className="text-white font-mono text-lg">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-gray-400 font-mono text-sm mb-4">
                        {project.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 text-white text-xs font-mono rounded-none border border-white/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}