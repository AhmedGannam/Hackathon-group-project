import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar, FaChartLine, FaFilter, FaSearch } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('weekly'); // weekly, monthly, allTime
  const [category, setCategory] = useState('all'); // all, quiz, chat, analysis
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeframe, category]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/leaderboard?timeframe=${timeframe}&category=${category}`);
      const data = await response.json();
      setLeaderboardData(data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = leaderboardData.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOrdinalSuffix = (i) => {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  const getMedalColor = (position) => {
    switch (position) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-600 to-amber-800';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            Leaderboard
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compete with other learners and climb to the top of the rankings
          </p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <FaFilter className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Time Period</h2>
            </div>
            <div className="flex gap-2">
              <GlowButton
                size="sm"
                variant={timeframe === 'weekly' ? 'primary' : 'secondary'}
                onClick={() => setTimeframe('weekly')}
              >
                Weekly
              </GlowButton>
              <GlowButton
                size="sm"
                variant={timeframe === 'monthly' ? 'primary' : 'secondary'}
                onClick={() => setTimeframe('monthly')}
              >
                Monthly
              </GlowButton>
              <GlowButton
                size="sm"
                variant={timeframe === 'allTime' ? 'primary' : 'secondary'}
                onClick={() => setTimeframe('allTime')}
              >
                All Time
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <FaChartLine className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Category</h2>
            </div>
            <div className="flex gap-2">
              <GlowButton
                size="sm"
                variant={category === 'all' ? 'primary' : 'secondary'}
                onClick={() => setCategory('all')}
              >
                All
              </GlowButton>
              <GlowButton
                size="sm"
                variant={category === 'quiz' ? 'primary' : 'secondary'}
                onClick={() => setCategory('quiz')}
              >
                Quiz
              </GlowButton>
              <GlowButton
                size="sm"
                variant={category === 'chat' ? 'primary' : 'secondary'}
                onClick={() => setCategory('chat')}
              >
                Chat
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <FaSearch className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Search</h2>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-gray-800/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </GlassCard>
        </div>

        {/* Leaderboard */}
        <GlassCard className="p-6" glow>
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredData.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className={`
                        flex items-center gap-6 p-4 rounded-xl
                        ${index < 3 ? 'bg-gradient-to-r bg-opacity-20' : 'bg-gray-800/30'}
                        ${index === 0 ? 'from-yellow-500/20 to-yellow-600/20' : ''}
                        ${index === 1 ? 'from-gray-400/20 to-gray-500/20' : ''}
                        ${index === 2 ? 'from-amber-600/20 to-amber-700/20' : ''}
                      `}>
                        <div className={`
                          w-12 h-12 rounded-xl bg-gradient-to-br ${getMedalColor(index + 1)}
                          flex items-center justify-center text-xl font-bold
                        `}>
                          {index < 3 ? (
                            <FaMedal className="text-2xl" />
                          ) : (
                            `${index + 1}`
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{user.username}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <FaStar className="text-yellow-400" />
                            <span>{user.points} points</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            Rank
                          </div>
                          <div className="font-bold text-lg">
                            {index + 1}<sup>{getOrdinalSuffix(index + 1)}</sup>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredData.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-400">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}