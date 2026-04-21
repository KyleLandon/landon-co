import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import willWorkImage from "@/assets/willwork-project.webp";
import comicMysteryImage from "@/assets/comic-project.webp";
import theRaidImage from "@/assets/theraid-project.png";
import keyplusImage from "@/assets/keyplus-project.png";

const projects = [
  {
    id: 1,
    title: "Will Work Construction",
    description:
      "Professional construction company website with modern design and clear service showcases.",
    image: willWorkImage,
    tags: ["React", "TypeScript", "Responsive", "Business"],
    demoUrl: "https://willworkconstruction.com/home",
    category: "Web Development",
  },
  {
    id: 2,
    title: "Comic Mystery Boxes",
    description:
      "E-commerce platform for curated comic book mystery boxes with a seamless shopping experience.",
    image: comicMysteryImage,
    tags: ["React", "E-commerce", "Storefront", "DTC"],
    demoUrl: "https://comic-mysteries.com",
    category: "Web Development",
  },
  {
    id: 3,
    title: "The Raid",
    description:
      "Team site for a competitive gaming community with a bold visual identity.",
    image: theRaidImage,
    tags: ["React", "Branding", "Community"],
    demoUrl: "https://dollydumpster.com",
    category: "Web Development",
  },
  {
    id: 4,
    title: "Key Plus",
    description:
      "Web app with Discord-gated authentication, transparent pricing, and a public leaderboard.",
    image: keyplusImage,
    tags: ["Web App", "Auth", "Dashboard"],
    demoUrl: "https://keyplus.io",
    category: "Web Development",
  },
];

const categories = [
  "All",
  "Web Development",
  "Branding",
  "Design",
  "Digital Marketing",
  "Automation",
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container-wide py-6 flex items-center justify-between">
          <Link
            href="/"
            className="btn-ghost inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <p className="eyebrow text-white/60">All Projects</p>
        </div>
      </header>

      {/* Hero */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="eyebrow text-white/60 mb-6">Selected work</p>
            <h1 className="heading-xl mb-6">
              Recent projects we&rsquo;ve <span className="text-gradient">shipped</span>.
            </h1>
            <p className="body-lg text-white/70">
              A small sample of brands and products we&rsquo;ve helped build, design
              and grow. Click through any tile to visit the live site.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Filters + Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-2"
            >
              {categories.map((category) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white/70 border-white/15 hover:text-white hover:border-white/40"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project) => (
                <motion.a
                  key={project.id}
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={fadeInUp}
                  className="surface-card hover-lift group block overflow-hidden"
                >
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="eyebrow text-white/50">
                        {project.category}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="body-md text-white/65 mb-5">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs rounded-full bg-white/5 text-white/70 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <p className="text-center text-white/50 py-12">
                No projects in this category yet — more on the way.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
