import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-dark-secondary to-black text-gray-300 py-16 px-6 border-t border-neon-cyan/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-neon-green/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center shadow-neon-cyan">
              <span className="text-dark-primary font-bold text-lg font-mono">W</span>
            </div>
            <h2 className="text-2xl font-bold font-secondary bg-neon-gradient bg-clip-text text-transparent">
              WealthLog
            </h2>
          </div>
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
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/features"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/getStarted"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Get Started
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Login
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
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-neon-cyan transition-colors duration-300"
              >
                Community
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
      <div className="mt-12 border-t border-gray-800/50 pt-8 text-center text-sm text-gray-500 relative z-10">
        <p className="font-mono">
          © {new Date().getFullYear()}{" "}
          <span className="text-neon-cyan font-semibold">WealthLog</span>. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          Built with precision by{" "}
          <span className="text-neon-blue font-mono">Musab Hassen</span>
        </p>
      </div>
    </footer>
  );
}
