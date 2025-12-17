import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
  disabled = false,
  ...props
}) {
  const baseStyles =
    "px-8 py-3 rounded-lg font-semibold font-secondary transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-neon-gradient text-dark-primary shadow-neon-cyan hover:shadow-neon-cyan-lg hover:scale-105",
    secondary:
      "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon-cyan",
    ghost:
      "bg-transparent text-neon-cyan hover:text-neon-blue hover:bg-white/5",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "ghost"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};
