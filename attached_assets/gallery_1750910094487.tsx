"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

export default function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const projects = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "E-commerce website design",
      title: "REBEL THREADS",
      category: "E-COMMERCE",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Restaurant website design",
      title: "URBAN BITES",
      category: "RESTAURANT",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Tech startup website",
      title: "NEXUS TECH",
      category: "STARTUP",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Music band website",
      title: "STATIC NOISE",
      category: "MUSIC",
    },
  ]

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
                  src={project.src || "/placeholder.svg"}
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
      </div>
    </section>
  )
}
