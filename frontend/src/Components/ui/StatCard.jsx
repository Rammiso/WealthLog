import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function StatCard({ 
  value, 
  label, 
  icon: Icon,
  color = "neon-green",
  className = "",
  ...props 
}) {
  const colorClasses = {
    "neon-green": "text-neon-green border-neon-green/20 hover:border-neon-green/40",
    "neon-cyan": "text-neon-cyan border-neon-cyan/20 hover:border-neon-cyan/40",
    "neon-blue": "text-neon-blue border-neon-blue/20 hover:border-neon-blue/40",
  };

  return (
    <motion.div
      className={`glass p-4 rounded-lg border transition-all ${colorClasses[color]} ${className}`}
      whileHover={{ y: -2 }}
      {...props}
    >
      {Icon && (
        <div className="flex justify-center mb-2">
          <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[0]} opacity-70`} />
        </div>
      )}
      <div className={`text-2xl font-bold font-mono ${colorClasses[color].split(' ')[0]}`}>
        {value}
      </div>
      <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-mono">
        {label}
      </div>
    </motion.div>
  );
}

StatCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.oneOf(["neon-green", "neon-cyan", "neon-blue"]),
  className: PropTypes.string,
};
