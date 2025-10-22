import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Faqs.module.css";

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className={styles.faqPage}>
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.subtitle}>
          Have questions about <span className={styles.brand}>WealthLog</span>?
          Here are answers to the most common ones — so you can make the most
          out of your financial journey.
        </p>
      </motion.section>

      <section className={styles.faqList}>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`${styles.faqItem} ${
              activeIndex === index ? styles.active : ""
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => toggleFAQ(index)}
          >
            <div className={styles.faqQuestion}>
              <h3>{faq.question}</h3>
              <span>{activeIndex === index ? "−" : "+"}</span>
            </div>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  className={styles.faqAnswer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>
    </main>
  );
}

const faqs = [
  {
    question: `What is WealthLog?`,
    answer:
      "WealthLog is your personal finance companion that helps you track expenses, income, and savings goals in one place — making budgeting simpler and smarter.",
  },
  {
    question: "Is WealthLog free to use?",
    answer:
      "Yes! WealthLog offers free core features for individuals. We’re building optional premium plans with advanced analytics, syncing, and insights — coming soon.",
  },
  {
    question: "Can I use WealthLog offline?",
    answer:
      "Absolutely. You can record and view transactions offline. Once reconnected, your data syncs automatically to keep your logs updated.",
  },
  {
    question: "Does WealthLog support Ethiopian Birr (ETB)?",
    answer:
      "Yes, WealthLog fully supports ETB and provides multi-currency options for travelers, entrepreneurs, and freelancers handling different currencies.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Your privacy is our top priority. WealthLog uses AES-256 encryption, local data storage, and zero third-party tracking to keep your financial information safe.",
  },
  {
    question: "Can I track shared or family expenses?",
    answer:
      "Yes! You can create shared budgets with family members or business partners, allowing everyone to stay on top of collective spending and saving goals.",
  },
];
