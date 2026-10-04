import { motion } from "framer-motion";
import { Code2, Palette, ShoppingBag, Zap } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Design & Development",
    description:
      "Fast, professional websites designed around your business and built to turn visitors into customers.",
  },
  {
    icon: Palette,
    title: "Branding & Design",
    description:
      "Logos, visual identity, and brand systems that help your business look established, consistent, and unmistakably yours.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce",
    description:
      "Online stores that make it easy for customers to browse, buy, and pay — with the tools you need to manage everything behind the scenes.",
  },
  {
    icon: Zap,
    title: "Business Automation",
    description:
      "Connect your tools, streamline repetitive work, and automate everyday processes so you can spend more time running your business.",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-50px" }}
          className="surface-card p-6 mt-4"
        >
          <h3 className="text-lg font-semibold text-white mb-2">
            Website Care — $100/month
          </h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Your website shouldn’t become another thing you have to manage.
            Hosting, updates, backups, monitoring, and small content changes —
            all handled by Landon &amp; Co.
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-3">
            Small content edits are included. Larger design and development
            requests are quoted separately.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
