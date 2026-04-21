import { Mail, Phone, Instagram, ArrowUpRight } from "lucide-react";
import whiteLogo from "@/assets/logo-white.webp";

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)] bg-black">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <img
              src={whiteLogo}
              alt="Landon & Co."
              width={640}
              height={640}
              loading="lazy"
              decoding="async"
              className="h-9 w-auto mb-5 opacity-90"
            />
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-sm">
              Web design, branding, and automation built for small businesses
              that want to look great and run smoother.
            </p>
            <div className="flex gap-2">
              <a
                href="https://instagram.com/landonco.co"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Services</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/services/web-design" className="text-white/70 hover:text-white transition-colors">
                  Web Design
                </a>
              </li>
              <li>
                <a href="/services/branding" className="text-white/70 hover:text-white transition-colors">
                  Branding
                </a>
              </li>
              <li>
                <a href="/services/ecommerce" className="text-white/70 hover:text-white transition-colors">
                  E-commerce
                </a>
              </li>
              <li>
                <a href="/services/automation" className="text-white/70 hover:text-white transition-colors">
                  Automation
                </a>
              </li>
              <li>
                <a href="/insights" className="text-white/70 hover:text-white transition-colors">
                  Insights
                </a>
              </li>
            </ul>
          </div>

          {/* Service area */}
          <div className="md:col-span-2">
            <p className="eyebrow mb-4">Service area</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/web-design-san-antonio" className="text-white/70 hover:text-white transition-colors">
                  San Antonio, TX
                </a>
              </li>
              <li>
                <a href="/web-design-corpus-christi" className="text-white/70 hover:text-white transition-colors">
                  Corpus Christi, TX
                </a>
              </li>
              <li>
                <a href="/web-design-victoria-tx" className="text-white/70 hover:text-white transition-colors">
                  Victoria, TX
                </a>
              </li>
              <li>
                <span className="text-white/50">South Texas + remote</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Get in touch</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@landonco.co"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4" />
                  info@landonco.co
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              </li>
              <li>
                <a
                  href="tel:+19403892685"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (940) 389-2685
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-color)] mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-[var(--text-muted)]">
              © {new Date().getFullYear()} Landon & Co. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms
              </a>
              <span>Built in Texas. Made for the long haul.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
