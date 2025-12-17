import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-10 h-10 rounded-lg bg-neon-gradient flex items-center justify-center shadow-neon-cyan group-hover:shadow-neon-cyan-lg transition-all duration-300 relative overflow-hidden">
            <span className="text-dark-primary font-bold text-xl font-mono relative z-10">W</span>
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-secondary bg-neon-gradient bg-clip-text text-transparent">
              WealthLog
            </h1>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Financial Intelligence</p>
          </div>
        </motion.div>

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
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

export default Header;
