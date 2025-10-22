import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* 🌟 Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.brand}>WealthLog</h2>
          <p className={styles.text}>
            Empowering you to track, save, and grow your wealth — anytime,
            anywhere. Manage your finances smarter with confidence.
          </p>
        </motion.div>

        {/* 🧭 Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className={styles.heading}>Quick Links</h3>
          <ul className={styles.links}>
            <li>
              <Link to="/" className={styles.link}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/features" className={styles.link}>
                Features
              </Link>
            </li>
            <li>
              <Link to="/getStarted" className={styles.link}>
                Get Started
              </Link>
            </li>
            <li>
              <Link to="/login" className={styles.link}>
                Login
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* ⚙️ Resources */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className={styles.heading}>Resources</h3>
          <ul className={styles.links}>
            <li>
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className={styles.link}>
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className={styles.link}>
                Support
              </a>
            </li>
            <li>
              <a href="#" className={styles.link}>
                Community
              </a>
            </li>
          </ul>
        </motion.div>

        {/* 🌍 Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className={styles.heading}>Connect With Us</h3>
          <div className={styles.socials}>
            <a
              href="https://www.facebook.com/musab.ha.2025"
              className={styles.icon}
            >
              <FaFacebook />
            </a>
            <a href="#" className={styles.icon}>
              <FaTwitter />
            </a>
            <a href="#" className={styles.icon}>
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/musab-hassen-b86247316"
              className={styles.icon}
            >
              <FaLinkedin />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className={styles.bottom}>
        © {new Date().getFullYear()}{" "}
        <span className={styles.highlight}>WealthLog</span>. All rights
        reserved.
        <br />
        <span style={{ fontStyle: "italic", color: "#9ca3af" }}>
          Designed & Developed by{" "}
          <span className={styles.highlight}>Musab Hassen</span>
        </span>
      </div>
    </footer>
  );
}

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// export default function Footer() {
//   return (
//     <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-12 px-6 border-t border-gray-800">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//         {/* 🌟 Brand */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-3">
//             WealthLog
//           </h2>
//           <p className="text-sm leading-relaxed">
//             Empowering you to track, save, and grow your wealth — anytime,
//             anywhere. Manage your finances smarter with confidence.
//           </p>
//         </motion.div>

//         {/* 🧭 Quick Links */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
//           <ul className="space-y-2">
//             <li>
//               <Link to="/" className="hover:text-emerald-400 transition">
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/features"
//                 className="hover:text-emerald-400 transition"
//               >
//                 Features
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/getStarted"
//                 className="hover:text-emerald-400 transition"
//               >
//                 Get Started
//               </Link>
//             </li>
//             <li>
//               <Link to="/login" className="hover:text-emerald-400 transition">
//                 Login
//               </Link>
//             </li>
//           </ul>
//         </motion.div>

//         {/* ⚙️ Resources */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
//           <ul className="space-y-2">
//             <li>
//               <a href="#" className="hover:text-emerald-400 transition">
//                 Privacy Policy
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-emerald-400 transition">
//                 Terms of Service
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-emerald-400 transition">
//                 Support
//               </a>
//             </li>
//             <li>
//               <a href="#" className="hover:text-emerald-400 transition">
//                 Community
//               </a>
//             </li>
//           </ul>
//         </motion.div>

//         {/* 🌍 Socials */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h3 className="text-lg font-semibold text-white mb-3">
//             Connect With Us
//           </h3>
//           <div className="flex space-x-4 text-xl">
//             <a href="#" className="hover:text-emerald-400 transition">
//               <FaFacebook />
//             </a>
//             <a href="#" className="hover:text-emerald-400 transition">
//               <FaTwitter />
//             </a>
//             <a href="#" className="hover:text-emerald-400 transition">
//               <FaInstagram />
//             </a>
//             <a href="#" className="hover:text-emerald-400 transition">
//               <FaLinkedin />
//             </a>
//           </div>
//         </motion.div>
//       </div>

//       {/* Divider */}
//       <div className="mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
//         © {new Date().getFullYear()}{" "}
//         <span className="text-emerald-400 font-semibold">WealthLog</span>. All
//         rights reserved.
//       </div>
//     </footer>
//   );
// }
