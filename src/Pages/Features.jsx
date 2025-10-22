import { motion } from "framer-motion";
import styles from "./Features.module.css";

import { Link } from "react-router-dom";
// import Lottie from "lottie-react";
// import savingAnim from "../assets/animations/saving.json";

// Animation variants for smooth reveal
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: -10 },
};

export default function Features() {
  return (
    <main className={styles.featuresPage}>
      {/* === HEADER === */}
      <motion.section
        className={styles.hero}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 2 }}
        variants={fadeUp}
      >
        <h1 className={styles.title}>Empower Your Financial Journey</h1>
        <p className={styles.subtitle}>
          WealthLog brings clarity, control, and confidence to your finances.
          Discover the smart tools designed to help you grow, save, and manage
          your wealth effectively — wherever you are.
        </p>
      </motion.section>

      {/* === FEATURES GRID === */}
      <section className={styles.featureGrid}>
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className={styles.featureCard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            variants={fadeUp}
          >
            <div className={styles.icon}>
              {feature.icon}
              {/* <Lottie
                animationData={savingAnim}
                loop={true}
                className={styles.lottieIcon}
              /> */}
            </div>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <p className={styles.featureDesc}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>
      <motion.div
        className={styles.ctaSection}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.7 }}
        variants={fadeUp}
      >
        <h2>Ready to Take Control of Your Finances?</h2>
        <p>Start using WealthLog today — it’s free, fast, and made for you.</p>
        <Link to="/getStarted" className={styles.ctaButton}>
          Get Started
        </Link>
      </motion.div>
    </main>
  );
}

// === FEATURES DATA ===
// === FEATURES DATA ===
const features = [
  {
    icon: "💰",
    title: "Smart Expense Tracking",
    desc: "Record every transaction with ease. WealthLog categorizes spending automatically, helping you visualize where your money goes.",
  },
  {
    icon: "📊",
    title: "Insightful Analytics",
    desc: "See detailed charts and monthly breakdowns. Understand your habits and adjust your goals for smarter financial planning.",
  },
  {
    icon: "🏦",
    title: "Goal-Based Saving",
    desc: "Set personalized goals — from emergency funds to business capital — and track your progress in real time.",
  },
  {
    icon: "🌍",
    title: "Multi-Currency Support",
    desc: "Perfect for Ethiopians and global users. Track transactions in ETB, USD, EUR, and more — effortlessly converted for clarity.",
  },
  {
    icon: "🤝",
    title: "Equb Tracking",
    desc: "Track your rotating savings group (Equb) contributions and payouts easily — join the savings tradition with digital clarity.",
  },
  {
    icon: "🔒",
    title: "Bank-Level Security",
    desc: "Your data stays safe with advanced encryption and local device privacy. Only you have access to your financial logs.",
  },
  {
    icon: "📄",
    title: "Bill & Utility Tracking",
    desc: "Track monthly bills for services like EthioTelecom and EEPCO, and receive timely reminders to avoid late fees.",
  },
  // {
  //   icon: "📶",
  //   title: "Offline Sync Mode",
  //   desc: "Work seamlessly even with limited internet access. Data syncs automatically when connectivity is restored.",
  // },
  {
    icon: "💹",
    title: "Investment Insights",
    desc: "Simulate local cooperative or microloan returns and understand the best ways to grow your savings.",
  },
  {
    icon: "🌐",
    title: "Language Support",
    desc: "Toggle between Amharic and Afan Oromo to make WealthLog inclusive for the Ethiopian community.",
  },
];
