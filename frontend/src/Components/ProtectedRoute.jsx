import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { motion } from 'framer-motion';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer ring */}
      <motion.div
        className="w-16 h-16 border-4 border-neon-cyan/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 w-12 h-12 border-4 border-neon-green/50 rounded-full border-t-transparent"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute inset-6 w-4 h-4 bg-neon-cyan rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Loading text */}
      <motion.p
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-neon-cyan font-mono text-sm uppercase tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Authenticating...
      </motion.p>
    </motion.div>
  </div>
);

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}