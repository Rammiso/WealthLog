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
        {/* Image Section */}
        <motion.div 
          className="hidden lg:block relative"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/30 shadow-2xl shadow-neon-cyan/10 backdrop-blur-sm">
            <img
              src={loginImage}
              alt="Financial intelligence platform"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-green/10 mix-blend-overlay"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 mb-4">
                  <Shield className="w-4 h-4 text-neon-green" />
                  <span className="text-xs font-mono text-neon-green uppercase tracking-wider">Secure Access</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 font-secondary">
                  Access Your Financial
                  <br />
                  <span className="text-neon-green">Command Center</span>
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
                <div className="w-12 h-12 rounded-xl bg-neon-gradient flex items-center justify-center shadow-neon-cyan">
                  <span className="text-dark-primary font-bold text-2xl font-mono">W</span>
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
