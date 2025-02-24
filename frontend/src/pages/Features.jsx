import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaRobot, FaBook, FaBrain, FaFileAlt, FaChartLine, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

export default function Features() {
  const features = [
    {
      id: 'ai-chat',
      title: 'AI Tutor Chat',
      description: 'Engage in real-time conversations with our advanced AI tutor. Get instant answers, explanations, and guidance on any topic.',
      icon: <FaRobot className="text-4xl" />,
      color: 'from-purple-500 to-blue-500',
      link: '/chat',
      stats: ['24/7 Availability', 'Personalized Learning', 'Multi-subject Support']
    },
    {
      id: 'lesson-analysis',
      title: 'Smart Lesson Analysis',
      description: 'Transform your study materials into comprehensive insights. Our AI breaks down complex topics into easy-to-understand summaries.',
      icon: <FaBrain className="text-4xl" />,
      color: 'from-blue-500 to-cyan-500',
      link: '/lesson-analysis',
      stats: ['Instant Summaries', 'Key Points Extraction', 'Voice Synthesis']
    },
    {
      id: 'quantum-quiz',
      title: 'Quantum Quiz',
      description: 'Test your knowledge with AI-generated quizzes. Adaptive questions that match your learning level and provide instant feedback.',
      icon: <FaGraduationCap className="text-4xl" />,
      color: 'from-emerald-500 to-teal-500',
      link: '/quiz',
      stats: ['Dynamic Questions', 'Instant Feedback', 'Progress Tracking']
    },
    {
      id: 'file-analyzer',
      title: 'File Analyzer',
      description: 'Upload your documents and let our AI create smart summaries. Support for PDF, DOC, DOCX, and TXT files with instant analysis.',
      icon: <FaFileAlt className="text-4xl" />,
      color: 'from-amber-500 to-orange-500',
      link: '/file-analyzer',
      stats: ['Multiple File Types', 'Smart Summaries', 'Key Points Extraction']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">
            Revolutionize Your Learning
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of education with our AI-powered learning tools. Personalized, interactive, and effective.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link to={feature.link}>
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 h-full">
                  {/* Feature Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      {feature.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{feature.title}</h2>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6">
                    {feature.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {feature.stats.map((stat, i) => (
                      <div key={i} className="text-center p-2 rounded-lg bg-gray-700/30">
                        <p className="text-sm text-gray-300">{stat}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-8 backdrop-blur-xl border border-purple-500/20"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Learning Journey?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of students who are already experiencing the future of education.
          </p>
          <Link to="/chat">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold text-lg shadow-lg hover:shadow-purple-500/25"
            >
              Start Learning Now
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}