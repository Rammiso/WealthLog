import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Shield, Zap, Lock, TrendingUp } from "lucide-react";

export default function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="py-20 px-6 bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 right-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <motion.section
        className="max-w-4xl mx-auto text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
          <HelpCircle className="w-4 h-4 text-neon-cyan" />
          <span className="text-sm font-mono text-neon-cyan uppercase tracking-wider">Support Center</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-secondary mb-6">
          Frequently Asked{" "}
          <span className="text-neon-green">
            Questions
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Get clarity on platform capabilities, security protocols, and how{" "}
          <span className="text-neon-cyan font-semibold font-mono">WealthLog</span> helps you 
          achieve financial control and growth.
        </p>
      </motion.section>

      {/* FAQ List */}
      <section className="max-w-4xl mx-auto space-y-4 relative z-10">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className={`glass rounded-xl overflow-hidden cursor-pointer transition-all duration-300 backdrop-blur-xl ${
              activeIndex === index
                ? "border-neon-cyan shadow-lg shadow-neon-cyan/20"
                : "border-gray-700/50 hover:border-neon-cyan/30"
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => toggleFAQ(index)}
            whileHover={{ scale: 1.01 }}
          >
            {/* Question */}
            <div className="flex justify-between items-center p-6">
              <div className="flex items-start gap-3 flex-1">
                {faq.icon && (
                  <faq.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    activeIndex === index ? 'text-neon-cyan' : 'text-gray-500'
                  } transition-colors`} />
                )}
                <h3 className={`text-lg font-semibold pr-4 transition-colors ${
                  activeIndex === index ? 'text-neon-cyan' : 'text-gray-200'
                }`}>
                  {faq.question}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`flex-shrink-0 transition-colors ${
                  activeIndex === index ? 'text-neon-cyan' : 'text-gray-500'
                }`}
              >
                <ChevronDown size={24} />
              </motion.div>
            </div>

            {/* Answer */}
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-0">
                    <p className="text-gray-400 leading-relaxed border-t border-gray-700/50 pt-4 pl-8">
                      {faq.answer}
                    </p>
                  </div>
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
    question: "What is WealthLog?",
    icon: TrendingUp,
    answer:
      "WealthLog is a professional financial intelligence platform that provides real-time analytics, cash flow optimization, and asset management tools. Built for individuals and professionals who demand precision and control over their financial performance.",
  },
  {
    question: "What are the platform capabilities?",
    icon: Zap,
    answer:
      "WealthLog offers comprehensive financial management including real-time analytics, multi-currency support, goal-based planning, automated reporting, predictive insights, and secure cloud synchronization. All features are designed for ease of use while maintaining professional-grade accuracy.",
  },
  {
    question: "How secure is my financial data?",
    icon: Shield,
    answer:
      "Security is our foundation. WealthLog implements bank-grade AES-256 encryption, zero-knowledge architecture, SOC 2 Type II certification, and GDPR compliance. Your data is protected by multi-layer security protocols with regular third-party audits.",
  },
  {
    question: "Does WealthLog support Ethiopian Birr (ETB)?",
    icon: null,
    answer:
      "Yes. WealthLog provides full support for ETB alongside 15+ international currencies including USD, EUR, GBP, and more. Real-time exchange rates and automatic conversion ensure accurate multi-currency portfolio tracking.",
  },
  {
    question: "Can I access WealthLog offline?",
    icon: null,
    answer:
      "Yes. WealthLog supports offline functionality for recording transactions and viewing data. Once reconnected, all changes synchronize automatically across devices with encrypted cloud infrastructure maintaining 99.9% uptime.",
  },
  {
    question: "What reporting capabilities are available?",
    icon: null,
    answer:
      "Generate professional financial reports including income statements, cash flow analysis, tax summaries, and performance metrics. All reports are exportable in PDF and CSV formats for accounting, tax filing, or investment analysis.",
  },
  {
    question: "How does goal tracking work?",
    icon: null,
    answer:
      "Set financial objectives with target amounts and deadlines. WealthLog provides automated progress monitoring, predictive completion forecasts, and milestone tracking to keep you on target for savings, investment, or debt reduction goals.",
  },
  {
    question: "Is there customer support available?",
    icon: null,
    answer:
      "Yes. WealthLog provides comprehensive support through documentation, email assistance, and community resources. Premium users receive priority support with dedicated account management and technical assistance.",
  },
];
