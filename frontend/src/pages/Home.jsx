import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaGraduationCap, FaArrowRight, FaChalkboardTeacher } from "react-icons/fa";
import { Canvas } from "@react-three/fiber";
import { Text, Float, OrbitControls, Stars } from "@react-three/drei";

// Quick access features
const quickFeatures = [
  {
    id: 'chat',
    title: 'AI Chat Tutor',
    description: 'Get instant help with any subject',
    icon: <FaRobot className="text-3xl" />,
    color: 'from-purple-500 to-blue-500',
    link: '/chat'
  },
  {
    id: 'analysis',
    title: 'Lesson Analysis',
    description: 'Transform text into smart summaries',
    icon: <FaBrain className="text-3xl" />,
    color: 'from-blue-500 to-cyan-500',
    link: '/lesson-analysis'
  },
  {
    id: 'quiz',
    title: 'Quantum Quiz',
    description: 'Test your knowledge dynamically',
    icon: <FaGraduationCap className="text-3xl" />,
    color: 'from-emerald-500 to-teal-500',
    link: '/quiz'
  }
];

// Cosmic Background Component
function CosmicBackground() {
  return (
    <Canvas className="absolute inset-0 z-0">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
        <Text
          fontSize={2}
          color="#7c3aed"
          position={[0, 0, -10]}
          font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf"
        >
          EduVerse
          <meshBasicMaterial color="#7c3aed" />
        </Text>
      </Float>
      <OrbitControls enableZoom={false} autoRotate />
    </Canvas>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <CosmicBackground />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">
              Welcome to EduVerse
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
              Experience the future of education with AI-powered learning tools
            </p>
            <Link to="/features">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25"
              >
                Explore Features
              </motion.button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {quickFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link}>
                  <div className="group h-full bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 mb-4">{feature.description}</p>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 text-purple-400 group-hover:text-purple-300"
                    >
                      Try Now <FaArrowRight />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 backdrop-blur-xl border border-purple-500/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
                <div className="text-gray-300">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
                <div className="text-gray-300">Quizzes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400 mb-2">0</div>
                <div className="text-gray-300">AI Interactions</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/chat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-purple-500 rounded-xl font-semibold"
                >
                  Chat with AI Tutor
                </motion.button>
              </Link>
              <Link to="/lesson-analysis">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-500 rounded-xl font-semibold"
                >
                  Analyze Lessons
                </motion.button>
              </Link>
              <Link to="/quiz">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-emerald-500 rounded-xl font-semibold"
                >
                  Take a Quiz
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}