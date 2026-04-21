import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "websites", "branding", "mobile", "ecommerce"];

  const works = [
    {
      id: 1,
      title: "ARTISAN COFFEE CO.",
      category: "websites",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      year: "2024",
      tech: "React, Shopify",
    },
    {
      id: 2,
      title: "STERLING LEGAL GROUP",
      category: "branding",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      year: "2024",
      tech: "Brand Identity",
    },
    {
      id: 3,
      title: "FITNESS STUDIO APP",
      category: "mobile",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      year: "2023",
      tech: "React Native",
    },
    {
      id: 4,
      title: "BELLA VISTA RESTAURANT",
      category: "ecommerce",
      image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop",
      year: "2024",
      tech: "Vue.js, Node.js",
    },
    {
      id: 5,
      title: "PREMIER PROPERTIES",
      category: "websites",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      year: "2023",
      tech: "Angular, Firebase",
    },
    {
      id: 6,
      title: "HEALTHFIRST CLINIC",
      category: "branding",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      year: "2024",
      tech: "WordPress, Custom PHP",
    },
  ];

  const filteredWorks = works.filter((work) => 
    selectedCategory === "all" ? true : work.category === selectedCategory
  );

  return (
    <section id="portfolio" className="bg-black py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="mb-12 text-center text-4xl font-bold tracking-wider sm:text-5xl uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            textShadow: "3px 3px 6px rgba(0,0,0,0.8)",
            filter: "contrast(1.3)",
          }}
        >
          ALL PROJECTS
        </motion.h2>
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="text-sm uppercase tracking-wider border-2 border-white/30 bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-none"
              style={{
                filter: selectedCategory === category ? "contrast(1.2)" : "none",
              }}
            >
              {category}
            </Button>
          ))}
        </div>
        <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredWorks.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="overflow-hidden bg-zinc-900 border-2 border-white/20 rounded-none">
                  <CardContent className="p-0">
                    <div className="group relative">
                      <img
                        src={work.image}
                        alt={work.title}
                        className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105 group-hover:contrast-125"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <h3
                          className="text-xl font-bold text-white tracking-wider mb-2 text-center px-4"
                          style={{
                            textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                          }}
                        >
                          {work.title}
                        </h3>
                        <p className="text-sm text-gray-300 tracking-widest uppercase mb-1">{work.year}</p>
                        <p className="text-xs text-gray-400 text-center px-4">{work.tech}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;