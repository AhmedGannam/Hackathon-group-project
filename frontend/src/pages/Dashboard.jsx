import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import {
  FaGraduationCap,
  FaBrain,
  FaChartLine,
  FaRegClock,
  FaRegCalendarAlt,
  FaTrophy,
  FaRobot,
  FaBook,
  FaRegLightbulb,
  FaArrowRight,
  FaRegCheckCircle,
  FaRegStar,
  FaFire,
  FaMedal,
  FaCrown,
  FaChartBar,
  FaRocket,
  FaAward
} from 'react-icons/fa';

// Mock data (replace with real data from backend)
const mockData = {
  user: {
    name: "Alex Thompson",
    level: "Advanced Learner",
    streak: 15,
    totalPoints: 2750,
    rank: 124,
    progress: 78
  },
  recentActivities: [
    { id: 1, type: 'quiz', title: 'Quantum Physics Quiz', score: 95, date: '2h ago' },
    { id: 2, type: 'analysis', title: 'Machine Learning Concepts', date: '4h ago' },
    { id: 3, type: 'chat', title: 'AI Ethics Discussion', date: '6h ago' },
    { id: 4, type: 'quiz', title: 'Data Structures', score: 88, date: '1d ago' }
  ],
  learningPath: [
    { id: 1, title: 'Introduction to AI', completed: true },
    { id: 2, title: 'Machine Learning Basics', completed: true },
    { id: 3, title: 'Neural Networks', completed: false },
    { id: 4, title: 'Deep Learning', completed: false }
  ],
  recommendations: [
    {
      id: 1,
      title: 'Advanced Algorithms',
      type: 'quiz',
      difficulty: 'Advanced',
      estimatedTime: '30 mins',
      match: 98
    },
    {
      id: 2,
      title: 'Quantum Computing',
      type: 'lesson',
      difficulty: 'Intermediate',
      estimatedTime: '45 mins',
      match: 95
    },
    {
      id: 3,
      title: 'Blockchain Technology',
      type: 'analysis',
      difficulty: 'Advanced',
      estimatedTime: '25 mins',
      match: 92
    }
  ],
  stats: {
    quizzesTaken: 45,
    averageScore: 92,
    lessonsAnalyzed: 38,
    hoursLearned: 128
  }
};

// 3D Background Component
function CosmicBackground() {
  return (
    <Canvas className="absolute inset-0 -z-10">
      <ambientLight intensity={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
    </Canvas>
  );
}

// New Weekly Challenge Component
const WeeklyChallenge = {
  title: "Master Neural Networks",
  progress: 65,
  tasks: [
    { id: 1, task: "Complete Quiz", done: true },
    { id: 2, task: "Analyze 3 Lessons", done: true },
    { id: 3, task: "Practice Implementation", done: false }
  ],
  reward: "Neural Network Expert Badge"
};

// New Skill Tree Data
const skillTree = {
  currentLevel: 4,
  nextMilestone: "AI Architecture Expert",
  skills: [
    { name: "Python", level: 5, progress: 90 },
    { name: "Machine Learning", level: 4, progress: 75 },
    { name: "Deep Learning", level: 3, progress: 60 },
    { name: "Neural Networks", level: 2, progress: 40 }
  ]
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIInsight, setShowAIInsight] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    // Show AI insight after a delay
    const timer = setTimeout(() => setShowAIInsight(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz': return <FaGraduationCap className="text-purple-400" />;
      case 'analysis': return <FaBrain className="text-blue-400" />;
      case 'chat': return <FaRobot className="text-emerald-400" />;
      default: return <FaBook className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 pt-24 relative overflow-hidden">
      <CosmicBackground />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Welcome Message with AI Insight */}
        <AnimatePresence>
          {showAIInsight && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-blue-500/10 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaRobot className="text-2xl text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-2">AI Learning Assistant</h2>
                  <p className="text-gray-300">
                    Based on your learning patterns, I recommend focusing on Neural Networks today. 
                    Your progress in Machine Learning fundamentals is impressive!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* User Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
                {mockData.user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{mockData.user.name}</h2>
                <p className="text-gray-400">{mockData.user.level}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Daily Streak</span>
                <span className="text-purple-400 font-bold">{mockData.user.streak} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Points</span>
                <span className="text-blue-400 font-bold">{mockData.user.totalPoints} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Global Rank</span>
                <span className="text-emerald-400 font-bold">#{mockData.user.rank}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Level Progress</span>
                <span className="text-purple-400">{mockData.user.progress}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mockData.user.progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                />
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <FaGraduationCap className="text-2xl text-purple-400 mb-2" />
              <div className="text-2xl font-bold mb-1">{mockData.stats.quizzesTaken}</div>
              <div className="text-sm text-gray-400">Quizzes Completed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <FaChartLine className="text-2xl text-blue-400 mb-2" />
              <div className="text-2xl font-bold mb-1">{mockData.stats.averageScore}%</div>
              <div className="text-sm text-gray-400">Average Score</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <FaBrain className="text-2xl text-emerald-400 mb-2" />
              <div className="text-2xl font-bold mb-1">{mockData.stats.lessonsAnalyzed}</div>
              <div className="text-sm text-gray-400">Lessons Analyzed</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50">
              <FaRegClock className="text-2xl text-amber-400 mb-2" />
              <div className="text-2xl font-bold mb-1">{mockData.stats.hoursLearned}h</div>
              <div className="text-sm text-gray-400">Learning Time</div>
            </div>
          </motion.div>
        </div>

        {/* New Weekly Challenge Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 bg-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <FaFire className="text-2xl text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Weekly Challenge</h3>
                <p className="text-purple-400">{WeeklyChallenge.title}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{WeeklyChallenge.progress}%</div>
              <p className="text-sm text-gray-400">Progress</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {WeeklyChallenge.tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-purple-500/5 rounded-xl"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  task.done ? 'bg-green-500' : 'bg-gray-700'
                }`}>
                  {task.done ? <FaRegCheckCircle className="text-white" /> : null}
                </div>
                <span className={task.done ? 'text-gray-300' : 'text-gray-400'}>
                  {task.task}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-purple-400">
            <FaAward />
            <span>Reward: {WeeklyChallenge.reward}</span>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {mockData.recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{activity.title}</h4>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                    {activity.score && (
                      <div className="text-lg font-bold text-purple-400">
                        {activity.score}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Learning Path with Skill Tree */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Skill Tree</h3>
                <div className="flex items-center gap-2">
                  <FaCrown className="text-yellow-400" />
                  <span className="text-gray-400">Level {skillTree.currentLevel}</span>
                </div>
              </div>

              <div className="space-y-6">
                {skillTree.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <FaChartBar className="text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{skill.name}</h4>
                          <span className="text-sm text-blue-400">Level {skill.level}</span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.progress}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Next Milestone</p>
                    <p className="font-semibold text-blue-400">{skillTree.nextMilestone}</p>
                  </div>
                  <FaRocket className="text-2xl text-blue-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Existing Recommendations Section */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold mb-6">Recommended for You</h3>
              <div className="space-y-4">
                {mockData.recommendations.map(item => (
                  <div
                    key={item.id}
                    className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{item.title}</h4>
                      <span className="text-sm text-purple-400">{item.match}% match</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span>{item.difficulty}</span>
                      <span>•</span>
                      <span>{item.estimatedTime}</span>
                    </div>
                    <Link to={`/${item.type}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold"
                      >
                        Start Learning
                      </motion.button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Achievement Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50"
            >
              <h3 className="text-xl font-bold mb-6">Achievement Showcase</h3>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-2 backdrop-blur-xl">
                    <FaTrophy className="text-2xl text-yellow-400" />
                  </div>
                  <div className="text-sm font-semibold text-purple-400">Quiz Master</div>
                  <div className="text-xs text-gray-400">Top 1%</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-2 backdrop-blur-xl">
                    <FaMedal className="text-2xl text-blue-400" />
                  </div>
                  <div className="text-sm font-semibold text-blue-400">Fast Learner</div>
                  <div className="text-xs text-gray-400">15 Day Streak</div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center mb-2 backdrop-blur-xl">
                    <FaBrain className="text-2xl text-emerald-400" />
                  </div>
                  <div className="text-sm font-semibold text-emerald-400">AI Expert</div>
                  <div className="text-xs text-gray-400">Level 5</div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl font-semibold text-gray-300 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                View All Achievements
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
