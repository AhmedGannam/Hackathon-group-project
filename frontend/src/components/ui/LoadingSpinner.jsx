import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', className = '' }) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className={`relative ${getSizeClass()} ${className}`}>
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-blue-500"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 border-r-blue-400"
        animate={{ rotate: -360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Inner ring */}
      <motion.div
        className="absolute inset-4 rounded-full border-4 border-transparent border-t-purple-300 border-r-blue-300"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl animate-pulse" />
    </div>
  );
} 