// src/Pages/GetStarted.jsx
import { useState } from "react";
import styles from "./GetStarted.module.css";
import { motion } from "framer-motion";

export default function GetStarted() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    income: "",
    currency: "USD",
    financialGoal: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [success, setSuccess] = useState(false);

  // Real-time validation
  const validateField = (name, value) => {
    switch (name) {
      case "fullname":
        if (!value) return "Full name is required";
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value))
          return "Invalid email address";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (value !== formData.password) return "Passwords do not match";
        break;
      case "income":
        if (!value) return "Please enter your monthly income";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Inline validation
    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleNext = () => {
    // Validate current step fields
    const stepErrors = {};
    if (step === 1) {
      ["fullname", "email", "password", "confirmPassword"].forEach((f) => {
        const errorMsg = validateField(f, formData[f]);
        if (errorMsg) stepErrors[f] = errorMsg;
      });
    } else if (step === 2) {
      ["income"].forEach((f) => {
        const errorMsg = validateField(f, formData[f]);
        if (errorMsg) stepErrors[f] = errorMsg;
      });
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Final validation for all fields
    const allErrors = {};
    Object.keys(formData).forEach((f) => {
      const errorMsg = validateField(f, formData[f]);
      if (errorMsg) allErrors[f] = errorMsg;
    });
    setErrors(allErrors);

    if (Object.keys(allErrors).length === 0) {
      console.log("Form submitted: ", formData);
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <h1>
          🎉 Welcome to <span className={styles.brand}>WealthLog</span>!
        </h1>
        <p>Your account is ready. Start tracking your finances now.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Lottie Animation */}
      {/* <div className={styles.lottieWrapper}>
        <Lottie animationData={financeAnim} loop={true} />
      </div> */}

      <h1>
        Create your <span className={styles.brand}>WealthLog</span> account
      </h1>
      <p>Track your income, spending, and reach your financial goals!</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {step === 1 && (
          <>
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="Musab Hassen"
              />
              {errors.fullname && (
                <span className={`${styles.error} show`}>
                  {errors.fullname}
                </span>
              )}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && (
                <span className={`${styles.error} show`}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.toggleBtn}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className={`${styles.error} show`}>
                  {errors.password}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span className={`${styles.error} show`}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.formGroup}>
              <label>Monthly Income</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="5000"
              />
              {errors.income && (
                <span className={`${styles.error} show`}>{errors.income}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Preferred Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="ETB">ETB (Br)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Financial Goal</label>
              <input
                type="text"
                name="financialGoal"
                value={formData.financialGoal}
                onChange={handleChange}
                placeholder="Save $10,000 this year"
              />
            </div>
          </>
        )}

        <div className={styles.buttonWrapper}>
          {step === 1 && (
            <button
              type="button"
              onClick={handleNext}
              className={styles.submitBtn}
            >
              Next Step
            </button>
          )}
          {step === 2 && (
            <button type="submit" className={styles.submitBtn}>
              Get Started
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
