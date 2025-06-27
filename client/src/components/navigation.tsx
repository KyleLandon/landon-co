import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings, MessageCircle } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { useAuth } from "@/hooks/useAuth";
import whiteLogo from "@assets/super_white_transparent_1750910829574.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  // Check if we're on a dashboard page
  const isDashboardPage = window.location.pathname.includes('/dashboard') || window.location.pathname.includes('/admin');

  useEffect(() => {
    setIsScrolled(scrollY > 50);
  }, [scrollY]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 100; // Account for navigation bar height
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: "Projects", id: "gallery" },
    { label: "About", id: "about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="cursor-pointer group"
            onClick={() => window.location.href = "/"}
          >
            <img
              src={whiteLogo}
              alt="Landon & Co."
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {(!isDashboardPage || !isAuthenticated) && navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                onClick={() => scrollToSection(item.id)}
                className="relative text-white hover:text-white transition-colors duration-300 font-medium group drop-shadow-lg"
                style={{
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0px 0px 8px rgba(0,0,0,0.6)"
                }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
            
            {(!isDashboardPage || !isAuthenticated) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                onClick={() => scrollToSection("project-submission")}
                className="btn-primary magnetic-button shadow-xl backdrop-blur-sm"
                style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)"
                }}
              >
                Let's Build
              </motion.button>
            )}

            {/* Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="relative"
                >
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {user?.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-black" />
                    )}
                  </button>

                  {/* Account Dropdown */}
                  <AnimatePresence>
                    {accountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white font-mono text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-gray-400 font-mono text-xs">
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-600 text-white text-xs font-mono rounded">
                              Admin
                            </span>
                          )}
                        </div>
                        
                        <div className="py-1">
                          <button
                            onClick={() => {
                              window.location.href = "/dashboard";
                              setAccountMenuOpen(false);
                            }}
                            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors font-mono text-sm flex items-center"
                          >
                            <User className="w-4 h-4 mr-3" />
                            Dashboard
                          </button>
                          
                          {isAdmin && (
                            <button
                              onClick={() => {
                                window.location.href = "/admin";
                                setAccountMenuOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors font-mono text-sm flex items-center"
                            >
                              <Settings className="w-4 h-4 mr-3" />
                              Admin Panel
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              window.location.href = "/api/logout";
                            }}
                            className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors font-mono text-sm flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  onClick={() => window.location.href = "/api/login"}
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <User className="w-5 h-5 text-black" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md:hidden w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-black"
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-black"
                >
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden overflow-hidden mt-6 pt-6 border-t border-white/30 bg-black/80 backdrop-blur-md rounded-lg px-4 pb-4"
            >
              <div className="space-y-6">
                {(!isDashboardPage || !isAuthenticated) && navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left text-lg font-medium text-white hover:text-gray-300 transition-colors duration-300"
                    style={{
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
                    }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {(!isDashboardPage || !isAuthenticated) && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1, duration: 0.4 }}
                    onClick={() => scrollToSection("project-submission")}
                    className="btn-primary w-full justify-center mt-4"
                  >
                    Let's Build
                  </motion.button>
                )}

                {/* Mobile Account Section */}
                <div className="border-t border-white/20 pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 px-2">
                        {user?.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt="Profile" 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-mono text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-gray-400 font-mono text-xs">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.4 }}
                        onClick={() => {
                          window.location.href = "/dashboard";
                          setIsOpen(false);
                        }}
                        className="w-full text-left text-white hover:text-gray-300 transition-colors font-mono text-sm flex items-center px-2 py-2"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </motion.button>
                      
                      {isAdmin && (
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (navItems.length + 2) * 0.1, duration: 0.4 }}
                          onClick={() => {
                            window.location.href = "/admin";
                            setIsOpen(false);
                          }}
                          className="w-full text-left text-white hover:text-gray-300 transition-colors font-mono text-sm flex items-center px-2 py-2"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Admin Panel
                        </motion.button>
                      )}
                      
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navItems.length + 3) * 0.1, duration: 0.4 }}
                        onClick={() => window.location.href = "/api/logout"}
                        className="w-full text-left text-white hover:text-gray-300 transition-colors font-mono text-sm flex items-center px-2 py-2"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.4 }}
                      onClick={() => {
                        window.location.href = "/api/login";
                        setIsOpen(false);
                      }}
                      className="w-full text-left text-white hover:text-gray-300 transition-colors font-mono text-sm flex items-center px-2 py-2"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Sign In
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;