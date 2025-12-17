import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Shield, 
  Zap, 
  PieChart, 
  Wallet, 
  LineChart,
  Lock,
  Globe,
  Bell,
  FileText
} from "lucide-react";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <main className="py-20 px-6 bg-gradient-to-b from-dark-primary via-dark-secondary to-dark-primary">
      {/* Header */}
      <motion.section
        className="max-w-4xl mx-auto text-center mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        variants={fadeUp}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 mb-6">
          <Zap className="w-4 h-4 text-neon-green" />
          <span className="text-sm font-mono text-neon-green uppercase tracking-wider">Platform Capabilities</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-secondary mb-6">
          Professional-Grade
          <br />
          <span className="text-neon-green">Financial Control</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Built for precision, designed for performance. Access institutional-quality tools 
          to optimize cash flow, manage assets, and accelerate capital growth.
        </p>
      </motion.section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              variants={fadeUp}
            >
              <motion.div
                className="h-full relative group cursor-pointer"
                whileHover={{ 
                  y: -8,
                  rotateX: 5,
                  rotateY: 2,
                  scale: 1.02
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <div className="h-full p-6 rounded-xl backdrop-blur-xl bg-gradient-to-br from-dark-secondary/80 via-dark-primary/60 to-dark-secondary/80 border border-neon-green/20 group-hover:border-neon-cyan/60 transition-all duration-500 relative overflow-hidden shadow-lg shadow-dark-primary/50 group-hover:shadow-2xl group-hover:shadow-neon-green/20">
                  
                  {/* Multi-layer background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  {/* Corner accent lines */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-neon-green/0 group-hover:border-neon-green/80 transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/0 group-hover:border-neon-cyan/80 transition-all duration-300"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-neon-green/0 group-hover:border-neon-green/80 transition-all duration-300"></div>
                  
                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-green/0 via-transparent to-neon-cyan/0 group-hover:from-neon-green/10 group-hover:to-neon-cyan/10 transition-all duration-500"></div>
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon section */}
                    <div className="mb-4">
                      <motion.div 
                        className="inline-flex p-4 rounded-xl bg-gradient-to-br from-neon-green/10 to-neon-cyan/10 border border-neon-green/30 group-hover:border-neon-cyan/50 group-hover:shadow-lg group-hover:shadow-neon-green/30 transition-all duration-300"
                        whileHover={{ 
                          rotate: [0, -5, 5, 0],
                          scale: 1.1,
                        }}
                        transition={{ 
                          duration: 0.6,
                          ease: "easeInOut"
                        }}
                      >
                        <feature.icon className="w-7 h-7 text-neon-green group-hover:text-neon-cyan transition-colors duration-300" />
                        
                        {/* Icon glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-neon-green/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    </div>
                    
                    {/* Content section */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-100 mb-3 group-hover:text-neon-green transition-colors duration-300 font-secondary tracking-tight">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1 group-hover:text-gray-300 transition-colors duration-300">
                        {feature.desc}
                      </p>
                      
                      {/* Status indicator */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700/50 group-hover:border-neon-green/30 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                          <motion.div 
                            className="w-2 h-2 rounded-full bg-neon-green"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7]
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          ></motion.div>
                          <span className="text-xs font-mono text-neon-green/80 uppercase tracking-wider group-hover:text-neon-green transition-colors duration-300">
                            {feature.metric}
                          </span>
                        </div>
                        
                        {/* Data visualization element */}
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, idx) => (
                            <motion.div
                              key={idx}
                              className="w-1 bg-neon-cyan/40 rounded-full group-hover:bg-neon-cyan transition-colors duration-300"
                              style={{ height: `${8 + idx * 3}px` }}
                              animate={{
                                height: [`${8 + idx * 3}px`, `${12 + idx * 4}px`, `${8 + idx * 3}px`]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: idx * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="max-w-7xl mx-auto mb-20">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Advanced <span className="text-neon-cyan">Intelligence Engine</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leverage real-time data processing and predictive algorithms to optimize financial performance and capital efficiency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {advancedFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              variants={fadeUp}
            >
              <Card className="p-8 h-full hover:border-neon-cyan/30 transition-all backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
                    <feature.icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">{feature.desc}</p>
                <ul className="space-y-3">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-2 flex-shrink-0"></div>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <motion.section
        className="max-w-5xl mx-auto mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <Card className="p-8 md:p-12 border-neon-green/30 backdrop-blur-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-neon-green" />
                <h2 className="text-3xl font-bold">
                  <span className="text-neon-green">Bank-Grade</span> Security
                </h2>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Your financial data is protected by institutional-grade encryption and 
                multi-layer security protocols. We maintain the highest standards of data integrity and confidentiality.
              </p>
              <ul className="space-y-3">
                {[
                  "AES-256 encryption standard",
                  "Zero-knowledge architecture",
                  "SOC 2 Type II certified",
                  "Regular third-party security audits",
                  "GDPR & compliance infrastructure"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <Lock className="w-4 h-4 text-neon-green flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="glass p-4 rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-all">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-mono">Encryption Level</div>
                <div className="text-2xl font-mono font-bold text-neon-green">256-bit AES</div>
              </div>
              <div className="glass p-4 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-mono">Uptime SLA</div>
                <div className="text-2xl font-mono font-bold text-neon-cyan">99.99%</div>
              </div>
              <div className="glass p-4 rounded-lg border border-neon-blue/20 hover:border-neon-blue/40 transition-all">
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-mono">Infrastructure</div>
                <div className="text-2xl font-mono font-bold text-neon-blue">Multi-Region</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* CTA Section */}
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={fadeUp}
      >
        <Card className="p-12 border-neon-green/30 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Optimize Your
            <br />
            <span className="text-neon-green">Financial Performance</span>?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals leveraging data-driven insights to build sustainable wealth and achieve financial goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/getStarted">
              <Button variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto justify-center">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" className="text-lg px-8 py-4 w-full sm:w-auto justify-center">
                View Demo
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </main>
  );
}

// Core Features Data
const coreFeatures = [
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Monitor cash flow, track spending patterns, and identify optimization opportunities with live data visualization and performance metrics.",
    metric: "< 100ms latency"
  },
  {
    icon: Target,
    title: "Goal-Based Planning",
    desc: "Set financial objectives with milestone tracking, automated progress monitoring, and predictive completion forecasts for capital targets.",
    metric: "Smart projections"
  },
  {
    icon: PieChart,
    title: "Asset Allocation",
    desc: "Comprehensive portfolio view with category breakdowns, diversification analysis, and risk-adjusted performance metrics.",
    metric: "Multi-asset support"
  },
  {
    icon: TrendingUp,
    title: "Growth Insights",
    desc: "Data-driven recommendations to maximize returns, reduce liabilities, and accelerate wealth accumulation through strategic planning.",
    metric: "Predictive analytics"
  },
  {
    icon: Wallet,
    title: "Multi-Currency Support",
    desc: "Manage assets across ETB, USD, EUR, and more with real-time exchange rates, automatic conversion, and FX tracking.",
    metric: "15+ currencies"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated alerts for budget thresholds, payment schedules, unusual activity patterns, and investment opportunities.",
    metric: "Instant delivery"
  },
  {
    icon: FileText,
    title: "Financial Reporting",
    desc: "Generate detailed statements, tax summaries, and performance reports with professional formatting and exportable formats.",
    metric: "PDF/CSV export"
  },
  {
    icon: Globe,
    title: "Cloud Infrastructure",
    desc: "Access your financial data anywhere with encrypted cloud synchronization, offline capability, and multi-device support.",
    metric: "99.9% uptime"
  },
  {
    icon: LineChart,
    title: "Trend Analysis",
    desc: "Historical data visualization with pattern recognition, seasonal analysis, and forecasting to predict future performance.",
    metric: "12-month history"
  }
];

// Advanced Features
const advancedFeatures = [
  {
    icon: BarChart3,
    title: "Predictive Cash Flow Modeling",
    desc: "Leverage advanced algorithms to forecast revenue, expenses, and liquidity positions with precision analytics.",
    points: [
      "30-day rolling forecasts with confidence intervals",
      "Scenario planning and stress testing tools",
      "Risk assessment and exposure metrics",
      "Automated rebalancing recommendations"
    ]
  },
  {
    icon: Target,
    title: "Performance Tracking",
    desc: "Monitor ROI across savings, investments, and business ventures with institutional-grade analytics and benchmarking.",
    points: [
      "Real-time portfolio valuation and P&L",
      "Benchmark comparisons and peer analysis",
      "Tax optimization and loss harvesting insights",
      "Dividend and income tracking"
    ]
  }
];