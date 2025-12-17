import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function Card({
  children,
  className = "",
  hover = true,
  ...props
}) {
  const baseStyles =
    "glass rounded-xl p-6 border-glow transition-all duration-300";
  const hoverStyles = hover
    ? "hover:shadow-neon-cyan-lg hover:border-neon-cyan"
    : "";

  return (
    <motion.div
      className={`${baseStyles} ${hoverStyles} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};
