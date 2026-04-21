import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";
import { useAuth } from "@/hooks/useAuth";
import whiteLogo from "@/assets/logo-white.webp";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  const isDashboardPage =
    typeof window !== "undefined" &&
    (window.location.pathname.includes("/dashboard") ||
      window.location.pathname.includes("/admin"));
  const isHomePage =
    typeof window !== "undefined" && window.location.pathname === "/";

  useEffect(() => {
    setIsScrolled(scrollY > 24);
  }, [scrollY]);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = navRef.current?.offsetHeight ?? 80;
      const top =
        element.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const navItems = [
    { label: "Services", id: "services" },
    { label: "Work", id: "gallery" },
    { label: "About", id: "about" },
  ];

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav border-b border-[var(--border-color)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            className="cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
            onClick={() => (window.location.href = "/")}
            aria-label="Landon & Co. — Home"
          >
            <img
              src={whiteLogo}
              alt="Landon & Co."
              width={640}
              height={640}
              decoding="async"
              className="h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {(!isDashboardPage || !isAuthenticated) &&
              navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}

            {(!isDashboardPage || !isAuthenticated) && (
              <button
                onClick={() => scrollToSection("contact")}
                className="btn-primary magnetic-button text-sm"
              >
                Start a project
              </button>
            )}

            {/* Account */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                    className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                    aria-label="Account menu"
                  >
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </button>

                  <AnimatePresence>
                    {accountMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-3 w-64 bg-[var(--bg-elevated)] backdrop-blur-xl border border-[var(--border-color)] rounded-xl py-2 z-50 shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-[var(--border-color)]">
                          <p className="text-white text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-[var(--text-muted)] text-xs mt-0.5">
                            {user?.email}
                          </p>
                          {isAdmin && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium uppercase tracking-wider rounded">
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
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center"
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
                              className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center"
                            >
                              <Settings className="w-4 h-4 mr-3" />
                              Admin Panel
                            </button>
                          )}

                          <button
                            onClick={() => {
                              window.location.href = "/api/logout";
                            }}
                            className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => (window.location.href = "/api/login")}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                  aria-label="Sign in"
                >
                  <User className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-white"
                >
                  <X size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-white"
                >
                  <Menu size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden overflow-hidden mt-4 border-t border-[var(--border-color)] pt-4"
            >
              <div className="flex flex-col gap-1">
                {(!isDashboardPage || !isAuthenticated) &&
                  navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-base font-medium text-white/80 hover:text-white transition-colors duration-200 py-2.5"
                    >
                      {item.label}
                    </button>
                  ))}
                {(!isDashboardPage || !isAuthenticated) && (
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="btn-primary w-full justify-center mt-3"
                  >
                    Start a project
                  </button>
                )}

                <div className="border-t border-[var(--border-color)] mt-4 pt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 pb-2">
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
                          <p className="text-white text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-[var(--text-muted)] text-xs">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          window.location.href = "/dashboard";
                          setIsOpen(false);
                        }}
                        className="w-full text-left text-white/80 hover:text-white text-sm flex items-center py-2"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            window.location.href = "/admin";
                            setIsOpen(false);
                          }}
                          className="w-full text-left text-white/80 hover:text-white text-sm flex items-center py-2"
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => (window.location.href = "/api/logout")}
                        className="w-full text-left text-white/80 hover:text-white text-sm flex items-center py-2"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = "/api/login";
                        setIsOpen(false);
                      }}
                      className="w-full text-left text-white/80 hover:text-white text-sm flex items-center py-2"
                    >
                      <User className="w-4 h-4 mr-3" />
                      Sign In
                    </button>
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
