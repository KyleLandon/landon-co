import { motion } from "framer-motion";
import { Code, Palette, ShoppingCart, Smartphone, Wrench, Search } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Website Development",
      description: "Custom websites built with modern technologies, optimized for performance and user experience.",
      features: ["Responsive design", "SEO optimization", "Fast loading times", "Mobile-first approach"]
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers and enhance user engagement.",
      features: ["User research & personas", "Wireframing & prototyping", "Brand identity design", "Usability testing"]
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description: "Complete online stores with payment processing, inventory management, and analytics.",
      features: ["Shopify & WooCommerce", "Payment gateway integration", "Inventory management", "Analytics & reporting"]
    },
    {
      icon: Smartphone,
      title: "Mobile Optimization",
      description: "Ensure your website looks and performs perfectly on all devices and screen sizes.",
      features: ["Responsive design", "Touch-friendly interfaces", "Progressive Web Apps", "Mobile performance optimization"]
    },
    {
      icon: Wrench,
      title: "Maintenance & Support",
      description: "Ongoing website maintenance, updates, and technical support to keep your site running smoothly.",
      features: ["Regular backups", "Security updates", "Performance monitoring", "Content updates"]
    },
    {
      icon: Search,
      title: "SEO & Analytics",
      description: "Improve your search rankings and understand your website's performance with detailed analytics.",
      features: ["Keyword research", "On-page SEO", "Google Analytics setup", "Performance reporting"]
    }
  ];

  return (
    <section id="services" className="py-20 px-6 bg-[var(--dark-secondary)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Services
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            Comprehensive web solutions to help your business succeed online.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-[var(--dark-primary)] p-8 rounded-xl group"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-12 h-12 bg-[var(--blue-accent)] rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="text-[var(--text-secondary)] space-y-2 text-sm">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                      className="flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-[var(--blue-accent)] rounded-full mr-3"></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
