// import { NavLink } from "react-router-dom";
// import styles from "./Header.module.css";
// import logo from "../assets/Images/Logo.png";
// function Header() {
//   return (
//     <header className={styles.header}>
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <img src={logo} alt="Logo" />
//           <h1>WealthLog</h1>
//         </div>

//         <ul className={styles.navLinks}>
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//             >
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/features"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//             >
//               Features
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/faqs"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//             >
//               FAQs
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/login"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//             >
//               Login
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/getStarted"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//             >
//               Get Started
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// }

// export default Header;
// import { useState } from "react";
// import { NavLink } from "react-router-dom";
// import styles from "./Header.module.css";
// import logo from "../assets/Images/Logo.png";
// import { Menu, X } from "lucide-react"; // optional if you have lucide-react installed

// function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   const closeMenu = () => {
//     setMenuOpen(false);
//   };

//   return (
//     <header className={styles.header}>
//       <nav className={styles.navbar}>
//         <div className={styles.logo}>
//           <img src={logo} alt="Logo" />
//           <h1>WealthLog</h1>
//         </div>

//         <button className={styles.menuButton} onClick={toggleMenu}>
//           {menuOpen ? <X size={28} /> : <Menu size={28} />}
//         </button>

//         <ul
//           className={`${styles.navLinks} ${menuOpen ? styles.navActive : ""}`}
//         >
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//               onClick={closeMenu}
//             >
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/features"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//               onClick={closeMenu}
//             >
//               Features
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/faqs"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//               onClick={closeMenu}
//             >
//               FAQs
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/login"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//               onClick={closeMenu}
//             >
//               Login
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/getStarted"
//               className={({ isActive }) =>
//                 isActive ? `${styles.link} ${styles.active}` : styles.link
//               }
//               onClick={closeMenu}
//             >
//               Get Started
//             </NavLink>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// }

// export default Header;

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";
import logo from "../assets/Images/Logo.png";
import { Menu, X } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
          <h1>WealthLog</h1>
        </div>

        <button className={styles.menuButton} onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <ul
          className={`${styles.navLinks} ${menuOpen ? styles.navActive : ""}`}
        >
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={closeMenu}
            >
              Features
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/faqs"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={closeMenu}
            >
              FAQs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={closeMenu}
            >
              Login
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/getStarted"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
              onClick={closeMenu}
            >
              Get Started
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
