import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-dark-secondary via-[#0d0d0d] to-black text-gray-300 py-16 px-6 border-t border-neon-cyan/30 relative overflow-hidden">
      {/* Neon Divider Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
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
                <h2 className="text-2xl font-bold font-secondary text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(57,255,20,0.7)] transition-all duration-300">
                  WealthLog
                </h2>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Financial Intelligence</p>
              </div>
            </div>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Professional financial intelligence platform for cash flow optimization, 
            asset management, and wealth acceleration.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold font-secondary text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/getStarted"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Get Started
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Sign In
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-lg font-semibold font-secondary text-white mb-3">
            Resources
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Privacy Policy
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Terms of Service
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Support
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm hover:text-neon-cyan transition-all duration-300 relative inline-block group"
              >
                <span className="relative">
                  Community
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-neon-cyan group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </li>
          </ul>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold font-secondary text-white mb-3">
            Connect With Us
          </h3>
          <div className="flex space-x-4 text-2xl">
            <a
              href="https://www.facebook.com/musab.ha.2025"
              className="text-gray-400 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-neon-blue hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-neon-magenta hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.8)] transition-all duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/musab-hassen-b86247316"
              className="text-gray-400 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] transition-all duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-16 relative z-10">
        {/* Gradient divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent mb-8"></div>
        
        <div className="text-center text-sm text-gray-500">
          <p className="font-mono">
            © {new Date().getFullYear()}{" "}
            <span className="text-neon-green font-semibold drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">WealthLog</span>. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">
            Built with precision by{" "}
            <span className="text-neon-blue font-mono">Musab Hassen</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
