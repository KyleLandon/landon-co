import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import whiteLogo from "@assets/white_transparent_1750909506258.png";

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
            className="mb-6 cursor-pointer"
            onClick={scrollToTop}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={whiteLogo}
              alt="Landon & Co."
              className="h-16 w-auto mx-auto object-contain"
              style={{
                filter: "drop-shadow(2px 2px 8px rgba(0, 0, 0, 0.6))",
              }}
            />
          </motion.div>
          
          <motion.p
            variants={fadeInUp}
            className="text-[var(--text-secondary)] mb-6 font-semibold"
          >
            Raw. Uncompromising. Digital experiences that demand attention.
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
