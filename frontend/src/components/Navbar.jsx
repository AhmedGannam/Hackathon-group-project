import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaRocket, FaRobot, FaGraduationCap, FaFileAlt, FaHome, FaBook } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import DarkModeToggle from "./DarkModeToggle";

// Navbar Component
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/features", label: "Features", icon: <FaRocket /> },
    { path: "/chat", label: "AI Chat", icon: <FaRobot /> },
    { path: "/lesson-analysis", label: "Lesson Analysis", icon: <FaBook /> },
    { path: "/quiz", label: "Quantum Quiz", icon: <FaGraduationCap /> },
    { path: "/file-analyzer", label: "File Analyzer", icon: <FaFileAlt /> },
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Fixed Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              EduVerse
            </motion.h1>
          </Link>
          
          {/* Menu Button */}
          <motion.button
            className="p-2 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 shadow-lg hover:shadow-purple-500/50 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <FaTimes className="text-xl text-white" />
            ) : (
              <FaBars className="text-xl text-white" />
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* Animated Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.nav
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed top-0 left-0 h-screen w-64 md:w-80 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl shadow-2xl z-50 border-r border-gray-800/50"
            >
              <div className="p-6 md:p-8 h-full flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8 md:mb-12">
                  Navigation
                </h2>

                <ul className="space-y-3 md:space-y-4 flex-1">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        onClick={closeMenu}
                        className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-gray-800/50 hover:bg-gray-700/30 transition-all group"
                      >
                        <span className="text-purple-400 group-hover:text-blue-400 transition-colors">
                          {item.icon}
                        </span>
                        <span className="text-base md:text-lg font-medium text-gray-100 group-hover:text-white">
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-auto pt-4 border-t border-gray-800/50">
                  <p className="text-sm text-gray-400">
                    Revolutionizing Education with AI
                  </p>
                </div>
              </div>
            </motion.nav>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}