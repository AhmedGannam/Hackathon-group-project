import { motion } from "framer-motion";
import { FaRobot, FaGraduationCap, FaBook, FaBrain, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const features = [
    { icon: <FaRobot className="text-2xl" />, text: "AI-Powered Learning" },
    { icon: <FaGraduationCap className="text-2xl" />, text: "Interactive Quizzes" },
    { icon: <FaBook className="text-2xl" />, text: "Smart Summaries" },
    { icon: <FaBrain className="text-2xl" />, text: "Personalized Tutoring" },
  ];

  return (
    <footer className="bg-gradient-to-b from-transparent to-gray-900/50 backdrop-blur-lg border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Features */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                {feature.icon}
              </div>
              <h3 className="text-gray-200 font-medium">{feature.text}</h3>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              EduVerse
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Revolutionizing Education with AI
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex gap-6">
            <Link
              to="/chat"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              AI Chat
            </Link>
            <Link
              to="/lesson-analysis"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Analysis
            </Link>
            <Link
              to="/quiz"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              Quiz
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            <a
              href="https://github.com/M-Ibrahim-03/ai-tutor-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <FaGithub className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/mazen-ahmed-96832a325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2024 EduVerse. All rights reserved.</p>
          <p className="mt-1">
            Built with 💜 for the future of education
          </p>
        </div>
      </div>
    </footer>
  );
}
  