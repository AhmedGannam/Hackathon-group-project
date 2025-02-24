import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GlowButton({ 
  children, 
  onClick, 
  className = "",
  variant = "primary", // primary, secondary, success
  size = "md", // sm, md, lg
  disabled = false,
  icon = null
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600";
      case "success":
        return "from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600";
      default:
        return "from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600";
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3";
    }
  };

  return (
    <motion.button
      disabled={disabled}
      onClick={onClick}
      initial={false}
      animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative group
        ${getSizeStyles()}
        rounded-xl font-semibold
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-300
        ${className}
      `}
    >
      {/* Background with gradient */}
      <div className={`
        absolute inset-0 rounded-xl bg-gradient-to-r ${getVariantStyles()}
        transition-all duration-300
      `} />

      {/* Glow effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50
        bg-gradient-to-r ${getVariantStyles()} blur-xl
        transition-all duration-300
      `} />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <span className="text-white">{children}</span>
      </div>

      {/* Shine effect */}
      <div
        className={`
          absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20
          bg-gradient-to-r from-transparent via-white to-transparent
          translate-x-[-100%] group-hover:translate-x-[100%]
          transition-all duration-1000
        `}
      />
    </motion.button>
  );
} 