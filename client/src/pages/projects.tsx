import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "wouter";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const projects = [
  {
    id: 1,
    title: "Will Work Construction",
    description: "Professional construction company website with modern design and service showcases",
    image: "/api/placeholder/600/400",
    tags: ["React", "TypeScript", "Responsive Design", "Business Website"],
    demoUrl: "https://willworkconstruction.com/home",
    githubUrl: "#",
    category: "Web Development"
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Modern e-commerce solution with React, Node.js, and Stripe integration",
    image: "/api/placeholder/600/400",
    tags: ["React", "Node.js", "Stripe", "MongoDB"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Web Development"
  },
  {
    id: 2,
    title: "Brand Identity System",
    description: "Complete brand redesign with logo, guidelines, and digital assets",
    image: "/api/placeholder/600/400",
    tags: ["Branding", "Logo Design", "Style Guide"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Branding"
  },
  {
    id: 3,
    title: "Restaurant Management System",
    description: "Full-stack application for restaurant operations and customer management",
    image: "/api/placeholder/600/400",
    tags: ["React", "Express", "PostgreSQL", "Real-time"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Web Development"
  },
  {
    id: 4,
    title: "Digital Marketing Campaign",
    description: "Comprehensive digital marketing strategy with automation tools",
    image: "/api/placeholder/600/400",
    tags: ["Marketing", "Automation", "Analytics"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Digital Marketing"
  },
  {
    id: 5,
    title: "Mobile App UI/UX",
    description: "Clean and intuitive mobile application design for fintech startup",
    image: "/api/placeholder/600/400",
    tags: ["UI/UX", "Mobile", "Figma", "Prototyping"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Design"
  },
  {
    id: 6,
    title: "Business Process Automation",
    description: "Custom automation solutions to streamline business operations",
    image: "/api/placeholder/600/400",
    tags: ["Automation", "Python", "APIs", "Workflow"],
    demoUrl: "#",
    githubUrl: "#",
    category: "Automation"
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
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                          <Github className="h-4 w-4" />
                        </Button>
                      </div>
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