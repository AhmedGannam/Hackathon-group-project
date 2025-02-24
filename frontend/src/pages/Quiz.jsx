import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBrain, FaTrophy, FaLightbulb, FaClock, FaCheck, FaTimes, FaRocket } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    let timer;
    if (quizStarted && timeLeft > 0 && !showScore) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showScore) {
      handleAnswerSubmit();
    }
    return () => clearInterval(timer);
  }, [timeLeft, quizStarted, showScore]);

  const startQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/v1/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions');
      }

      const data = await response.json();
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz data received');
      }

      setQuestions(data.questions);
      setQuizStarted(true);
      setTimeLeft(30);
      setCurrentQuestion(0);
      setScore(0);
      setShowScore(false);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load quiz questions. Please try again.');
      setQuizStarted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setQuizStarted(false);
    setTopic('');
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
            Quantum Quiz
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your knowledge with our AI-generated quiz on any topic
          </p>
        </motion.div>

        {error && (
          <GlassCard className="max-w-2xl mx-auto p-6 border-red-500/20" glow>
            <div className="text-center text-red-400">
              <FaTimes className="text-3xl mx-auto mb-2" />
              <p>{error}</p>
              <GlowButton
                className="mt-4"
                onClick={() => {
                  setError(null);
                }}
                variant="secondary"
              >
                Try Again
              </GlowButton>
            </div>
          </GlassCard>
        )}

        {!error && !quizStarted ? (
          <GlassCard className="max-w-2xl mx-auto p-8" glow>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <FaBrain className="text-4xl text-white" />
              </div>
              <h2 className="text-2xl font-bold">Ready to Challenge Yourself?</h2>
              <p className="text-gray-300">
                Enter a topic and test your knowledge with our AI-generated questions.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter quiz topic (e.g., 'Quantum Physics', 'World History')"
                  className="w-full bg-gray-800/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                />
                <GlowButton
                  className="w-full md:w-auto"
                  onClick={startQuiz}
                  disabled={loading || !topic.trim()}
                  icon={loading ? <LoadingSpinner size="sm" /> : <FaRocket />}
                >
                  {loading ? 'Preparing Quiz...' : 'Start Quiz'}
                </GlowButton>
              </div>
            </div>
          </GlassCard>
        ) : showScore ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <GlassCard className="p-8" glow>
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg mb-6">
                  <FaTrophy className="text-4xl text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
                <p className="text-2xl text-gray-300 mb-4">
                  You scored {score} out of {questions.length}
                </p>
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Review Answers</h3>
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-800/50 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                        {qIndex + 1}
                      </div>
                      <p className="text-lg">{question.question}</p>
                    </div>
                    <div className="grid gap-2 pl-10">
                      {question.answers.map((answer, aIndex) => (
                        <div
                          key={aIndex}
                          className={`p-3 rounded-lg flex items-center gap-3 ${
                            aIndex === question.correctAnswer
                              ? 'bg-green-500/20 border border-green-500/50'
                              : 'bg-gray-700/30'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            aIndex === question.correctAnswer ? 'bg-green-500' : 'bg-gray-600'
                          }`}>
                            {aIndex === question.correctAnswer && <FaCheck className="text-xs" />}
                          </div>
                          <span className={aIndex === question.correctAnswer ? 'text-green-400' : 'text-gray-300'}>
                            {answer}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <GlowButton
                  variant="secondary"
                  onClick={restartQuiz}
                  icon={<FaRocket />}
                >
                  Try Another Quiz
                </GlowButton>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <GlassCard className="p-6 mb-4" glow>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <FaLightbulb className="text-2xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Question {currentQuestion + 1}/{questions.length}</h2>
                    <p className="text-sm text-gray-400">Select the best answer</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <FaClock className="text-purple-400" />
                  <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-gray-300'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>

              <div className="text-lg mb-8">
                {questions[currentQuestion]?.question}
              </div>

              <div className="space-y-4">
                {questions[currentQuestion]?.answers.map((option, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 rounded-xl transition-all duration-200 flex items-center gap-3
                      ${selectedAnswer === index 
                        ? 'bg-purple-500/20 border-2 border-purple-500'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 border-2 border-transparent'
                      }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2
                      ${selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-500'
                      }`}
                    >
                      {selectedAnswer === index && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                    </div>
                    {option}
                  </motion.button>
                ))}
              </div>

              <div className="mt-8">
                <GlowButton
                  className="w-full"
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswer === null}
                  variant="secondary"
                  icon={<FaCheck />}
                >
                  Submit Answer
                </GlowButton>
              </div>
            </GlassCard>

            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <FaTrophy className="text-yellow-400" />
                <span className="text-gray-300">Score: {score}</span>
              </div>
              <GlowButton
                variant="success"
                size="sm"
                onClick={() => setShowScore(true)}
                icon={<FaTimes />}
              >
                End Quiz
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}