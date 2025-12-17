import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../Context/AppContext';

const NotificationIcon = ({ type }) => {
  const iconProps = { size: 20, className: "flex-shrink-0" };
  
  switch (type) {
    case 'success':
      return <CheckCircle {...iconProps} className="text-neon-green" />;
    case 'error':
      return <AlertCircle {...iconProps} className="text-red-400" />;
    case 'warning':
      return <AlertTriangle {...iconProps} className="text-yellow-400" />;
    default:
      return <Info {...iconProps} className="text-neon-cyan" />;
  }
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  useEffect(() => {
    if (notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'from-neon-green/10 to-neon-green/5 border-neon-green/30';
      case 'error':
        return 'from-red-500/10 to-red-500/5 border-red-500/30';
      case 'warning':
        return 'from-yellow-500/10 to-yellow-500/5 border-yellow-500/30';
      default:
        return 'from-neon-cyan/10 to-neon-cyan/5 border-neon-cyan/30';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`
            relative max-w-sm w-full bg-gradient-to-r ${getBackgroundColor(notification.type)}
            backdrop-blur-xl border rounded-xl shadow-2xl overflow-hidden
            hover:shadow-neon-cyan/20 transition-all duration-300
          `}
        >
          {/* Animated border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
          <div className="relative p-4">
            <div className="flex items-start gap-3">
              <NotificationIcon type={notification.type} />
              
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <h4 className="text-sm font-semibold text-white mb-1 font-secondary">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm text-gray-300 font-mono leading-relaxed">
                  {notification.message}
                </p>
              </div>

              <motion.button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Progress bar for timed notifications */}
            {notification.duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-neon-cyan to-neon-green"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: notification.duration / 1000, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function NotificationContainer() {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationItem
              notification={notification}
              onRemove={removeNotification}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}