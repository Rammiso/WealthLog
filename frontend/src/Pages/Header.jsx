import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `relative text-gray-300 font-medium font-mono text-sm uppercase tracking-wider transition-all duration-300 hover:text-neon-cyan ${
      isActive ? "text-neon-cyan" : ""
    }`;

  const activeLinkUnderline = (
    <motion.div
      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-neon-cyan"
      layoutId="underline"
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.3 }}
    />
  );

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? "glass border-b border-neon-cyan/20 shadow-lg shadow-neon-cyan/5 backdrop-blur-xl" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <NavLink to="/">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden transition-all duration-300">
              <img 
                src="/Logo_Small.png" 
                alt="WealthLog Logo" 
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              {/* Neon glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-green/30 to-neon-cyan/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen"></div>
              {/* Animated pulsing border */}
              <div className="absolute inset-0 border-2 border-neon-green/0 group-hover:border-neon-green/60 rounded-xl transition-all duration-300 group-hover:animate-pulse"></div>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-secondary text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300">
                WealthLog
              </h1>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Financial Intelligence</p>
            </div>
          </motion.div>
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 hover:text-neon-cyan transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 items-center">
          <li>
            <NavLink to="/" className={linkClass} onClick={closeMenu}>
              {({ isActive }) => (
                <motion.div whileHover={{ y: -2 }} className="relative py-1">
                  Home
                  {isActive && activeLinkUnderline}
                </motion.div>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/features" className={linkClass} onClick={closeMenu}>
              {({ isActive }) => (
                <motion.div whileHover={{ y: -2 }} className="relative py-1">
                  Features
                  {isActive && activeLinkUnderline}
                </motion.div>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to="/faqs" className={linkClass} onClick={closeMenu}>
              {({ isActive }) => (
                <motion.div whileHover={{ y: -2 }} className="relative py-1">
                  Support
                  {isActive && activeLinkUnderline}
                </motion.div>
              )}
            </NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
                  {({ isActive }) => (
                    <motion.div whileHover={{ y: -2 }} className="relative py-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Dashboard
                      {isActive && activeLinkUnderline}
                    </motion.div>
                  )}
                </NavLink>
              </li>
              <li>
                <motion.button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-2 text-gray-300 font-medium font-mono text-sm uppercase tracking-wider transition-all duration-300 hover:text-red-400"
                  whileHover={{ y: -2 }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </motion.button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                  {({ isActive }) => (
                    <motion.div whileHover={{ y: -2 }} className="relative py-1">
                      Sign In
                      {isActive && activeLinkUnderline}
                    </motion.div>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/getStarted"
                  onClick={closeMenu}
                >
                  <motion.div
                    className="px-6 py-2.5 rounded-lg bg-neon-gradient text-dark-primary font-semibold font-mono text-sm uppercase tracking-wider shadow-neon-cyan hover:shadow-neon-cyan-lg transition-all duration-300 relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%] animate-shimmer"></div>
                  </motion.div>
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-full left-0 right-0 mt-2 glass border border-white/10 rounded-2xl mx-4 p-6 flex flex-col gap-4 shadow-xl"
            >
              <li>
                <NavLink to="/" className={linkClass} onClick={closeMenu}>
                  {({ isActive }) => (
                    <div className="py-3 px-2">
                      Home
                      {isActive && activeLinkUnderline}
                    </div>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/features"
                  className={linkClass}
                  onClick={closeMenu}
                >
                  {({ isActive }) => (
                    <div className="py-3 px-2">
                      Features
                      {isActive && activeLinkUnderline}
                    </div>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink to="/faqs" className={linkClass} onClick={closeMenu}>
                  {({ isActive }) => (
                    <div className="py-3 px-2">
                      Support
                      {isActive && activeLinkUnderline}
                    </div>
                  )}
                </NavLink>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <NavLink to="/dashboard" className={linkClass} onClick={closeMenu}>
                      {({ isActive }) => (
                        <div className="py-3 px-2 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Dashboard
                          {isActive && activeLinkUnderline}
                        </div>
                      )}
                    </NavLink>
                  </li>
                  <li className="pt-2 border-t border-gray-700/50">
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="w-full px-6 py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-semibold font-mono text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className={linkClass} onClick={closeMenu}>
                      {({ isActive }) => (
                        <div className="py-3 px-2">
                          Sign In
                          {isActive && activeLinkUnderline}
                        </div>
                      )}
                    </NavLink>
                  </li>
                  <li className="pt-2 border-t border-gray-700/50">
                    <NavLink
                      to="/getStarted"
                      className="px-6 py-3 rounded-lg bg-neon-gradient text-dark-primary font-semibold font-mono text-sm uppercase tracking-wider shadow-neon-cyan text-center block"
                      onClick={closeMenu}
                    >
                      Get Started
                    </NavLink>
                  </li>
                </>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header;
