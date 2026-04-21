import { motion } from "framer-motion";
import { Code2, Palette, ShoppingBag, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Fast, modern websites built with React and TypeScript. Responsive, accessible, and easy to update.",
  },
  {
    icon: Palette,
    title: "Branding & Design",
    description:
      "Logos, color systems, and visual identity that make your business feel unmistakably yours.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description:
      "Online stores with seamless checkout, payment integration, and inventory tools that scale.",
  },
  {
    icon: Zap,
    title: "Automation",
    description:
      "Custom workflows that connect your tools and handle the busywork so you can focus on customers.",
  },
];

const Services = () => {
  return (
    <section id="services" className="relative section-padding bg-black">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mb-16"
        >
          <p className="eyebrow mb-4">What we do</p>
          <h2 className="heading-xl text-white mb-5">
            Everything you need to launch and grow online.
          </h2>
          <p className="body-md">
            From your first website to ongoing optimization, we work as a
            long-term partner — not a one-off contractor.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                viewport={{ once: true, margin: "-50px" }}
                className="surface-card hover-lift p-6 group"
              >
                <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
