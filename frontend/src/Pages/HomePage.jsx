import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, BarChart3, Target, ArrowRight, CheckCircle, Zap, Activity, DollarSign } from "lucide-react";
import Button from "../Components/ui/Button";
import Features from "./Features";
import Faqs from "./Faqs";

export default function Homepage() {
  return (
    <section className="min-h-screen">
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/20 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Activity className="w-4 h-4 text-neon-green" />
                <span className="text-sm font-mono text-neon-green">Financial Intelligence Platform</span>
              </motion.div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6">
                Control Your
                <br />
                <span className="text-neon-green">Financial Capital</span>
              </h1>

              <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-xl">
                Professional-grade analytics for cash flow optimization, asset allocation, and wealth acceleration. 
                Make data-driven decisions with real-time financial intelligence.
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div 
                  className="glass p-4 rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-2xl font-bold font-mono text-neon-green">99.9%</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Uptime SLA</div>
                </motion.div>
                <motion.div 
                  className="glass p-4 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-2xl font-bold font-mono text-neon-cyan">256-bit</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Encryption</div>
                </motion.div>
                <motion.div 
                  className="glass p-4 rounded-lg border border-neon-blue/20 hover:border-neon-blue/40 transition-all"
                  whileHover={{ y: -2 }}
                >
                  <div className="text-2xl font-bold font-mono text-neon-blue">Real-time</div>
                  <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Insights</div>
                </motion.div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/getStarted">
                  <Button variant="primary" className="text-lg px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="text-lg px-8 py-4 w-full sm:w-auto justify-center">
                    Sign In
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-neon-green" />
                  <span className="font-mono">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="font-mono">SOC 2 Certified</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="glass p-6 rounded-2xl border border-neon-cyan/30 shadow-2xl backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-mono">Total Assets</div>
                      <div className="text-3xl font-bold font-mono text-neon-green">ETB 125,450</div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/20">
                      <TrendingUp className="w-4 h-4 text-neon-green" />
                      <span className="font-mono text-sm text-neon-green">+12.5%</span>
                    </div>
                  </div>

                  {/* Chart Visualization */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-400 w-20 font-mono uppercase">Revenue</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-neon-green to-neon-green/80 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                        ></motion.div>
                      </div>
                      <div className="text-xs font-mono text-gray-300 w-10 text-right">75%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-400 w-20 font-mono uppercase">Liabilities</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-neon-cyan to-neon-cyan/80 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '45%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                        ></motion.div>
                      </div>
                      <div className="text-xs font-mono text-gray-300 w-10 text-right">45%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-400 w-20 font-mono uppercase">Capital</div>
                      <div className="flex-1 bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-neon-blue to-neon-blue/80 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          transition={{ duration: 1, delay: 0.9 }}
                        ></motion.div>
                      </div>
                      <div className="text-xs font-mono text-gray-300 w-10 text-right">60%</div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-dark-primary/50 p-3 rounded-lg border border-neon-cyan/20 hover:border-neon-cyan/40 transition-all">
                      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-mono">Cash Flow</div>
                      <div className="text-lg font-mono text-neon-cyan">+ETB 45K</div>
                    </div>
                    <div className="bg-dark-primary/50 p-3 rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-all">
                      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-mono">ROI</div>
                      <div className="text-lg font-mono text-neon-green">+18.2%</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 glass p-3 rounded-lg border border-neon-green/30 shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BarChart3 className="w-6 h-6 text-neon-green" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 glass p-3 rounded-lg border border-neon-cyan/30 shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <Target className="w-6 h-6 text-neon-cyan" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-20 border-y border-gray-800/50 bg-dark-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Active Accounts", color: "text-neon-green", icon: DollarSign },
              { value: "ETB 2M+", label: "Assets Under Management", color: "text-neon-cyan", icon: TrendingUp },
              { value: "50K+", label: "Monthly Transactions", color: "text-neon-blue", icon: Activity },
              { value: "99.9%", label: "Client Satisfaction", color: "text-neon-green", icon: CheckCircle }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-3">
                  <stat.icon className={`w-8 h-8 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                </div>
                <div className={`text-4xl lg:text-5xl font-bold font-mono mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & FAQs Sections */}
      <Features />
      <Faqs />
    </section>
  );
}