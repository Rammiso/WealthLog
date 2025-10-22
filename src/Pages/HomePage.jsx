import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import image1 from "../assets/Images/bg-7.jpeg";
import styles from "./Homepage.module.css";
import AnimatedGraph from "./AnimatedGraph";
import Features from "./Features";
import Faqs from "./Faqs";

export default function Homepage() {
  return (
    <section>
      <main className={styles.homepage}>
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Hero Section */}
          <aside className={styles.aside}>
            <div className={styles.textContent}>
              <h1>
                Take control of your{" "}
                <span className={styles.highlight}>money</span>.
                <br />
                <span className={styles.brand}>WealthLog</span> helps you grow
                smarter and track your financial goals with clarity.
              </h1>
              <p className={styles.subtitle}>
                Manage your income, spending, and goals effortlessly. Visualize
                where your money goes — and where it should go.
              </p>
            </div>

            <motion.div
              className={styles.imageWrapper}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              {/* <img
              loading="lazy"
              src={image1}
              alt="WealthLog dashboard preview"
              className={styles.heroImage}
            /> */}
              <div className={styles.imageWrapper}>
                <img
                  src={image1}
                  alt="WealthLog preview"
                  className={styles.heroImage}
                />
                {/* <AnimatedGraph /> */}
              </div>

              <motion.img
                src="/assets/Images/graph-line.svg"
                alt="animated finance graph"
                className={styles.graphAnimation}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>

            {/* Trust Badge */}
          </aside>
          <div className={styles.actions}>
            <Link to="/getStarted" className={styles.btnPrimary}>
              Get Started for Free
            </Link>
            <Link to="/login" className={styles.btnSecondary}>
              Already have an account?
            </Link>
            <p className={styles.trustNote}>
              🌍 Trusted by thousands of Ethiopians to manage their finances
              confidently.
            </p>
          </div>
        </motion.section>
      </main>
      <Features />
      <Faqs />
    </section>
  );
}

// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import image1 from "../assets/Images/bg-7.jpeg";
// import styles from "./Homepage.module.css";

// export default function Homepage() {
//   return (
//     <main className={styles.homepage}>
//       <motion.section
//         className={styles.hero}
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <aside className={styles.aside}>
//           <div>
//             <h1>
//               Take control of your{" "}
//               <span className={styles.highlight}>money</span>
//               .
//               <br />
//               <span className={styles.brand}>WealthLog</span> keeps your
//               finances clear and confident.
//             </h1>
//           </div>
//           <div>
//             <img src={image1} alt="bg-5" />
//           </div>
//         </aside>
//         <p className={styles.subtitle}>
//           Track your income, spending, and goals effortlessly. Visualize where
//           your money goes — and where it should go.
//         </p>

//         <div className={styles.actions}>
//           <Link to="/getStarted" className={styles.btnPrimary}>
//             Get Started for Free
//           </Link>
//           <Link to="/login" className={styles.btnSecondary}>
//             Already have an account?
//           </Link>
//         </div>
//       </motion.section>
//       {/* <motion.section
//         className={styles.features}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.6, duration: 0.8 }}
//       >
//         <div className={styles.featureCard}>
//           <h3>💡 Smart Budgeting</h3>
//           <p>Create budgets that adapt to your habits and goals.</p>
//         </div>
//         <div className={styles.featureCard}>
//           <h3>📊 Insightful Analytics</h3>
//           <p>Understand your spending trends through visual reports.</p>
//         </div>
//         <div className={styles.featureCard}>
//           <h3>🔒 Secure & Private</h3>
//           <p>Your financial data stays safe — only visible to you.</p>
//         </div>
//       </motion.section> */}
//     </main>
//   );
// }
