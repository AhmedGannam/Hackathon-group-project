import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AIAvatar from '../components/AIAvatar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function LessonAnalysis() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [speaking, setSpeaking] = useState(false);

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else if (analysis) {
      setSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(analysis.speechText);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const analyzeLessonContent = async () => {
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post(`${API_URL}/ai/analyze-lesson`, {
        lessonContent: content.trim()
      });

      if (response.data) {
        const analysisData = {
          summary: response.data.summary,
          keyPoints: response.data.keyPoints,
          concepts: response.data.keyPoints.map(point => point.split(' ')[0]), // Extract key terms
          questions: response.data.suggestedQuestions,
          speechText: `Let me analyze your lesson content. ${response.data.summary}\n\nHere are the key points I've identified:\n${response.data.keyPoints.join('\n')}\n\nTo help you understand better, consider these questions:\n${response.data.suggestedQuestions.join('\n')}`
        };
        setAnalysis(analysisData);
        // Automatically start speaking when analysis is ready
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(analysisData.speechText);
          utterance.onstart = () => setSpeaking(true);
          utterance.onend = () => setSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }, 500);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error analyzing content:', err);
      let errorMessage = 'Failed to analyze content. Please try again.';
      
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Analysis service not found. Please check if the server is running.';
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (!err.response) {
        errorMessage = 'Unable to connect to the server. Please check if the server is running.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setContent('');
    setAnalysis(null);
    setError(null);
    setSpeaking(false);
    window.speechSynthesis.cancel();
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
            Lesson Analysis
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enter your lesson content and let AI help you understand it better
          </p>
        </motion.div>

        {/* Avatar Section */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md h-[400px]">
            <AIAvatar speaking={speaking} />
          </div>
        </div>

        {/* Input Section */}
        <GlassCard className="p-6">
          <div className="space-y-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your lesson content here..."
              className="w-full h-48 bg-gray-800/50 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <div className="flex justify-center gap-4">
              <GlowButton
                onClick={analyzeLessonContent}
                disabled={!content.trim() || loading}
                icon={loading ? <LoadingSpinner size="sm" /> : <FaPlay />}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </GlowButton>

              <GlowButton
                variant="secondary"
                onClick={clearAnalysis}
                disabled={loading || (!content && !analysis)}
              >
                Clear
              </GlowButton>
            </div>
          </div>
        </GlassCard>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-6" glow>
              {/* Header with Speech Control */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Analysis Results</h2>
                <GlowButton
                  variant="secondary"
                  onClick={toggleSpeech}
                  icon={speaking ? <FaPause /> : <FaPlay />}
                >
                  {speaking ? 'Pause' : 'Listen'}
                </GlowButton>
              </div>

              {/* Results Content */}
              <div className="space-y-8">
                {/* Summary */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-400">Summary</h3>
                  <p className="text-gray-300">{analysis.summary}</p>
                </div>

                {/* Key Points */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-blue-400">Key Points</h3>
                  <ul className="space-y-2">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 mt-2 rounded-full bg-blue-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Concepts */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">Important Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.concepts.map((concept, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Review Questions */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-emerald-400">Review Questions</h3>
                  <ul className="space-y-2">
                    {analysis.questions.map((question, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 mt-2 rounded-full bg-emerald-400" />
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}