import { motion } from 'framer-motion';
import { FaRobot } from 'react-icons/fa';

export default function RobotAvatar({ speaking }) {
  return (
    <motion.div
      animate={speaking ? {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
      } : {}}
      transition={{
        duration: 1,
        repeat: speaking ? Infinity : 0,
        ease: "easeInOut"
      }}
      className="relative"
    >
      {/* Avatar Container */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
        <FaRobot className="text-2xl text-white" />
      </div>

      {/* Speaking Animation */}
      {speaking && (
        <>
          {/* Sound Waves */}
          <motion.div
            className="absolute -inset-2 rounded-xl border-2 border-purple-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute -inset-4 rounded-xl border-2 border-blue-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </>
      )}
    </motion.div>
  );
} 