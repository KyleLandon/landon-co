import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Sitemap", href: "#" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-6 border-t border-[var(--dark-tertiary)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center space-x-2 mb-4 cursor-pointer"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-[var(--text-primary)] rounded-full flex items-center justify-center">
              <span className="text-[var(--dark-primary)] font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-semibold">Landon & Co.</span>
          </motion.div>
          
          <motion.p
            variants={fadeInUp}
            className="text-[var(--text-secondary)] mb-6"
          >
            Creating exceptional web experiences for local businesses.
          </motion.p>
          
          <motion.div
            variants={fadeInUp}
            className="flex justify-center space-x-8 mb-6 text-sm"
          >
            {footerLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
          
          <motion.p
            variants={fadeInUp}
            className="text-[var(--text-secondary)] text-sm"
          >
            © {currentYear} Landon & Co. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
