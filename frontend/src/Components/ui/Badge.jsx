import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function Badge({ 
  children, 
  icon: Icon, 
  variant = "green",
  className = "",
  ...props 
}) {
  const variants = {
    green: "bg-neon-green/10 border-neon-green/20 text-neon-green",
    cyan: "bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan",
    blue: "bg-neon-blue/10 border-neon-blue/20 text-neon-blue",
  };

  return (
    <motion.div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-mono uppercase tracking-wider">{children}</span>
    </motion.div>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType,
  variant: PropTypes.oneOf(["green", "cyan", "blue"]),
  className: PropTypes.string,
};
