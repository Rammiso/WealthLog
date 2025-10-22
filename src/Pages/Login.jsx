import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Login.module.css";
import loginImage from "../assets/Images/bg-5.jpeg";

export default function Login() {
  return (
    <main className={styles.loginPage}>
      <motion.section
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.imageSection}>
          <img src={loginImage} alt="Login background" />
        </div>

        <div className={styles.formSection}>
          <h1 className={styles.title}>
            Welcome back to <span className={styles.brand}>WealthLog</span>
          </h1>
          <p className={styles.subtitle}>
            Log in to manage your{" "}
            <span className={styles.highlight}>finances</span> smartly.
          </p>

          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" required />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <button className={styles.btnPrimary} type="submit">
              Login
            </button>

            <p className={styles.linkText}>
              Don’t have an account?{" "}
              <Link to="/getStarted" className={styles.link}>
                Get Started
              </Link>
            </p>
          </form>
        </div>
      </motion.section>
    </main>
  );
}
