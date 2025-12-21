import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  User, 
  Mail, 
  Lock, 
  DollarSign, 
  Target,
  Chrome,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import Input from "../Components/ui/Input";
import Button from "../Components/ui/Button";
import Card from "../Components/ui/Card";

export default function GetStarted() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    income: "",
    currency: "ETB",
    financialGoal: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        if (!value) return "Full name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Please enter a valid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Password must contain uppercase, lowercase, and number";
        break;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "income":
        if (!value) return "Monthly income is required";
        if (isNaN(value) || value <= 0) return "Please enter a valid amount";
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

  const handleNext = () => {
    const stepErrors = {};
    const step1Fields = ["fullname", "email", "password", "confirmPassword"];
    
    step1Fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    });

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const step2Errors = {};
    const step2Fields = ["income"];
    
    step2Fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) step2Errors[field] = error;
    });

    setErrors(step2Errors);

    if (Object.keys(step2Errors).length === 0) {
      // Split fullname into firstName and lastName
      const nameParts = formData.fullname.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const registrationData = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        currency: formData.currency,
      };

      const result = await register(registrationData);
      
      if (result.success) {
        setSuccess(true);
        // Redirect to dashboard with initial data
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              initialData: {
                income: formData.income,
                financialGoal: formData.financialGoal
              }
            }
          });
        }, 2000);
      } else {
        setErrors({ general: result.error });
      }
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden">
        {/* Success background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(57,255,20,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <motion.div
          className="text-center relative z-10 max-w-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative inline-block mb-6"
          >
            <CheckCircle className="w-24 h-24 mx-auto text-neon-green" />
            <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-2xl"></div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold font-secondary mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-neon-green">Account Initialized</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 mb-8 font-mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Your financial intelligence platform is ready.
            <br />
            <span className="text-sm text-gray-500">Access real-time analytics and portfolio management</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link to="/dashboard">
              <Button variant="primary" className="px-10 py-4 text-lg relative overflow-hidden group">
                <span className="relative z-10 font-mono uppercase tracking-wider flex items-center gap-2">
                  Access Platform
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-gradient-to-br from-dark-primary via-dark-secondary to-dark-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/3 rounded-full blur-3xl"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="p-8 lg:p-12 border-neon-cyan/30 backdrop-blur-xl" hover={false}>
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
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

          {/* Progress Indicator */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-lg transition-all duration-500 border-2 ${
                step >= 1
                  ? "bg-neon-gradient text-dark-primary shadow-neon-cyan border-transparent"
                  : "bg-transparent border-gray-700 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              1
            </motion.div>
            <motion.div
              className={`h-1 w-20 rounded-full transition-all duration-500 relative overflow-hidden ${
                step >= 2 ? "bg-gray-700" : "bg-gray-700"
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-neon-gradient"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: step >= 2 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-lg transition-all duration-500 border-2 ${
                step >= 2
                  ? "bg-neon-gradient text-dark-primary shadow-neon-cyan border-transparent"
                  : "bg-transparent border-gray-700 text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              2
            </motion.div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold font-secondary mb-3">
              {step === 1 ? "Create Account" : "Financial Profile"}
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              {step === 1 
                ? "Join the financial intelligence platform"
                : "Configure your portfolio parameters"
              }
            </p>
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Google Signup Option */}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGoogleSignup}
                    className="w-full flex items-center justify-center gap-3 mb-6 font-mono"
                  >
                    <Chrome className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">Google SSO</span>
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700/50"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 bg-dark-secondary text-gray-500 font-mono uppercase tracking-wider">Or create with email</span>
                    </div>
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                    <Input
                      label="Full Name"
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      error={errors.fullname}
                      className="pl-12"
                    />
                  </div>

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

                  <div className="relative">
                    <Lock className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
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

                  <div className="relative">
                    <Lock className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                    <Input
                      label="Confirm Password"
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      error={errors.confirmPassword}
                      className="pl-12"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                    <Input
                      label="Monthly Income"
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      placeholder="Enter your monthly income"
                      error={errors.income}
                      className="pl-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Currency
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full bg-dark-secondary/50 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 outline-none hover:border-gray-600 focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="ETB">ETB (Br) - Ethiopian Birr</option>
                    </select>
                  </div>

                  <div className="relative">
                    <Target className="absolute left-3 top-[42px] w-5 h-5 text-gray-400" />
                    <Input
                      label="Financial Goal (Optional)"
                      type="text"
                      name="financialGoal"
                      value={formData.financialGoal}
                      onChange={handleChange}
                      placeholder="e.g., Save $10,000 for emergency fund"
                      className="pl-12"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="pt-6 space-y-4">
              {step === 1 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 relative overflow-hidden group"
                >
                  <span className="relative z-10 font-mono uppercase tracking-wider">Continue</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
                </Button>
              )}

              {step === 2 && (
                <>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full flex items-center justify-center gap-2 relative overflow-hidden group"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-dark-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="font-mono">Initializing...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10 font-mono uppercase tracking-wider">Launch Platform</span>
                        <Sparkles className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green opacity-0 group-hover:opacity-20 transition-opacity bg-[length:200%_100%]"></div>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-2 font-mono"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="uppercase tracking-wider text-sm">Back</span>
                  </Button>
                </>
              )}
            </div>

            {/* Login Link */}
            <p className="text-center text-gray-400 mt-8 text-sm">
              <span className="font-mono">Already have an account?</span>{" "}
              <Link
                to="/login"
                className="text-neon-cyan hover:text-neon-green transition-colors font-semibold font-mono uppercase tracking-wider text-xs"
              >
                Sign In →
              </Link>
            </p>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}