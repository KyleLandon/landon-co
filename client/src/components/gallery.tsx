import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import willWorkImage from "@/assets/willwork-project.webp";
import comicMysteryImage from "@/assets/comic-project.webp";

const projects = [
  {
    src: willWorkImage,
    alt: "Will Work Construction website",
    title: "Will Work Construction",
    category: "Construction · Marketing site",
    url: "https://willworkconstruction.com/home",
  },
  {
    src: comicMysteryImage,
    alt: "Comic Mystery Boxes e-commerce store",
    title: "Comic Mystery Boxes",
    category: "E-commerce · Subscription",
    url: "https://comic-mysteries.com",
  },
];

const Gallery = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<{
    title: string;
    url: string;
  } | null>(null);

  return (
    <section id="gallery" className="relative section-padding bg-black">
      <div ref={ref} className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mb-14"
        >
          <p className="eyebrow mb-4">Featured work</p>
          <h2 className="heading-xl text-white mb-5">
            Recent projects we&rsquo;re proud of.
          </h2>
          <p className="body-md">
            A small selection of sites we&rsquo;ve built for local and
            independent businesses.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <motion.button
              key={p.title}
              type="button"
              onClick={() => setSelected({ title: p.title, url: p.url })}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group surface-card hover-lift overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="eyebrow mb-2">{p.category}</p>
                  <h3 className="text-xl font-semibold text-white">
                    {p.title}
                  </h3>
                </div>
                <div className="mt-1 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:text-white group-hover:border-white/30 transition-colors">
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link href="/projects">
            <Button variant="outline" className="btn-secondary border-0 px-7">
              View all projects
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] bg-zinc-900 border-white/10 p-0">
          <DialogHeader className="border-b border-white/10 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-white text-base font-semibold">
                  {selected?.title}
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-xs">
                  Live website preview
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white/20 text-white hover:bg-white/10 mr-8"
                onClick={() =>
                  selected?.url && window.open(selected.url, "_blank")
                }
              >
                <ExternalLink size={14} className="mr-2" />
                Open in new tab
              </Button>
            </div>
          </DialogHeader>
          {selected && (
            <div
              className="flex-1 bg-white overflow-hidden"
              style={{ height: "calc(95vh - 80px)" }}
            >
              <iframe
                src={selected.url}
                className="w-full h-full border-0"
                title={`Preview of ${selected.title}`}
                loading="lazy"
                style={{ minHeight: "100%" }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Gallery;
