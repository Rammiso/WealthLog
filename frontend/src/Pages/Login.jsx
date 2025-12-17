import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Chrome, Shield } from "lucide-react";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import Card from "../Components/ui/Card";
import loginImage from "../assets/Images/bg-5.jpeg";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Please enter a valid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Login submitted:", formData);
        setIsLoading(false);
        // Redirect to dashboard on successful login
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <main className="min-h-screen py-8 px-4 flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/3 rounded-full blur-3xl"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <motion.section
        className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Image Section - Futuristic Visualization */}
        <motion.div 
          className="hidden lg:block relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/30 shadow-2xl shadow-neon-cyan/10 backdrop-blur-sm h-[600px] bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary">
            {/* Animated Background */}
            <div className="absolute inset-0">
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* Animated Gradient Orbs */}
              <motion.div 
                className="absolute top-20 right-20 w-64 h-64 bg-neon-cyan/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="absolute bottom-20 left-20 w-64 h-64 bg-neon-green/20 rounded-full blur-3xl"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              ></motion.div>
              
              {/* Data Streams */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
                    style={{
                      top: `${20 + i * 15}%`,
                      left: '-100%',
                      width: '100%'
                    }}
                    animate={{
                      left: ['100%', '-100%']
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>
              
              {/* Floating Data Points */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute w-2 h-2 rounded-full bg-neon-cyan/50"
                  style={{
                    left: `${10 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
              
              {/* Holographic Chart Lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 600">
                <motion.path
                  d="M 50 400 Q 100 300, 150 350 T 250 300 T 350 350"
                  stroke="url(#gradient1)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.path
                  d="M 50 450 Q 100 380, 150 420 T 250 380 T 350 420"
                  stroke="url(#gradient2)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00ffff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00ffff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#39ff14" stopOpacity="0" />
                    <stop offset="50%" stopColor="#39ff14" stopOpacity="1" />
                    <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-green/5 mix-blend-overlay"></div>
            
            {/* Content */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 mb-4 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-mono text-neon-green uppercase tracking-wider">Secure Access</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 font-secondary drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                  Access Your Financial
                  <br />
                  <span className="text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Command Center</span>
                </h3>
                <p className="text-gray-300 font-mono text-sm">
                  Real-time analytics • Portfolio management • Growth insights
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="p-8 lg:p-10 max-w-md mx-auto border-neon-cyan/30 backdrop-blur-xl" hover={false}>
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center gap-2 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                  <img 
                    src="/Logo_Small.png" 
                    alt="WealthLog Logo" 
                    className="w-full h-full object-contain"
                  />
                  {/* Subtle static glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-neon-cyan/10 mix-blend-screen"></div>
                  {/* Border with neon-green */}
                  <div className="absolute inset-0 border-2 border-neon-green/40 rounded-xl"></div>
                </div>
              </motion.div>
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold font-secondary mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                className="text-gray-400 font-mono text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                Sign in to access your financial intelligence platform
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                    className="pl-12"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                    className="pl-12 pr-12"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-gray-400 hover:text-neon-cyan transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-neon-cyan hover:text-neon-blue transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full relative overflow-hidden group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-dark-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="font-mono">Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 font-mono uppercase tracking-wider">Access Platform</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div
                className="relative my-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-dark-secondary text-gray-500 font-mono uppercase tracking-wider">Or continue with</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 font-mono"
                >
                  <Chrome className="w-5 h-5" />
                  <span className="uppercase tracking-wider text-sm">Google SSO</span>
                </Button>
              </motion.div>

              <motion.p 
                className="text-center text-gray-400 mt-8 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <span className="font-mono">New to WealthLog?</span>{" "}
                <Link
                  to="/getStarted"
                  className="text-neon-cyan hover:text-neon-green transition-colors font-semibold font-mono uppercase tracking-wider text-xs"
                >
                  Create Account →
                </Link>
              </motion.p>
            </form>
          </Card>
        </motion.div>
      </motion.section>
    </main>
  );
}
