import { Link } from "react-router-dom";

export default function TestNavigation() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-dark-secondary/90 backdrop-blur-lg border border-neon-cyan/30 rounded-lg p-4 space-y-2">
      <h3 className="text-neon-cyan font-semibold text-sm mb-2">Quick Navigation</h3>
      <div className="space-y-1">
        <Link 
          to="/" 
          className="block text-gray-300 hover:text-neon-cyan text-sm transition-colors"
        >
          Home
        </Link>
        <Link 
          to="/login" 
          className="block text-gray-300 hover:text-neon-cyan text-sm transition-colors"
        >
          Login
        </Link>
        <Link 
          to="/getStarted" 
          className="block text-gray-300 hover:text-neon-cyan text-sm transition-colors"
        >
          Register
        </Link>
        <Link 
          to="/dashboard" 
          className="block text-gray-300 hover:text-neon-cyan text-sm transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}