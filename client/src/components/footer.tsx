import { Mail, Phone, MessageCircle, Instagram, Twitter, Briefcase } from "lucide-react";
import whiteLogo from "@/assets/logo-white.png";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <img
              src={whiteLogo}
              alt="Landon & Co. Logo"
              className="w-32 h-auto mb-6 opacity-80"
            />
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6 max-w-md">
              Transforming digital visions into reality. We build long-term partnerships 
              with local businesses through innovative web solutions.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://instagram.com/landonandco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
              </a>
              <a
                href="https://x.com/landonandco"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group"
              >
                <Twitter className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
              </a>
              <a
                href="https://indeed.com/cmp/landon-and-co"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300 group"
              >
                <Briefcase className="w-5 h-5 text-white group-hover:text-black transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-white font-mono text-lg font-bold uppercase tracking-wider mb-6">Contact</h3>
            <div className="space-y-4">
              <a
                href="mailto:info@landonco.co"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                <span className="font-mono text-sm">info@landonco.co</span>
              </a>
              <a
                href="tel:+19403892685"
                className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                <span className="font-mono text-sm">(940) 389-2685</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span className="font-mono text-sm">kylelandon</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-white font-mono text-lg font-bold uppercase tracking-wider mb-6">Services</h3>
            <div className="space-y-2">
              <p className="text-gray-400 font-mono text-sm">Web Development</p>
              <p className="text-gray-400 font-mono text-sm">Brand Design</p>
              <p className="text-gray-400 font-mono text-sm">Digital Strategy</p>
              <p className="text-gray-400 font-mono text-sm">E-commerce</p>
              <p className="text-gray-400 font-mono text-sm">SEO Optimization</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-4 md:mb-0">
              © {new Date().getFullYear()} Landon & Co. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <a
                href="#about"
                className="text-gray-500 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors duration-300"
              >
                About
              </a>
              <a
                href="#gallery"
                className="text-gray-500 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors duration-300"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="text-gray-500 hover:text-white font-mono text-xs uppercase tracking-wider transition-colors duration-300"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;