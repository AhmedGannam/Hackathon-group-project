import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaUser, FaPaperPlane, FaEraser, FaLightbulb, FaTimes } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// API configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSend = async (retryCount = 0) => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    if (retryCount === 0) {
      setInput('');
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      
      // Retry logic for connection errors
      if (retryCount < MAX_RETRIES && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('ERR_CONNECTION_REFUSED'))) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await sleep(RETRY_DELAY);
        return handleSend(retryCount + 1);
      }

      let errorMessage = 'Failed to send message. Please try again.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'Unable to connect to the server. Please ensure the server is running and try again.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication error. Please try refreshing the page.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      }

      setMessages(prev => [...prev, { 
        type: 'error', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setError(null);
    inputRef.current?.focus();
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
            AI Chat Tutor
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your personal AI tutor ready to help you learn and understand complex topics
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Chat Section */}
          <div className="md:col-span-3 space-y-6">
            <GlassCard className="h-[600px] flex flex-col overflow-hidden" glow>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                <div className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-500/20 text-red-400 p-4 rounded-xl mb-4 flex items-center gap-2"
                    >
                      <FaTimes className="shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                  
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex items-start gap-4 ${
                          message.type === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-purple-500'
                            : message.type === 'error'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`}>
                          {message.type === 'user' 
                            ? <FaUser className="text-lg" />
                            : <FaRobot className="text-lg" />
                          }
                        </div>
                        <div 
                          className={`flex-1 p-4 rounded-xl whitespace-pre-wrap break-words overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent ${
                            message.type === 'user'
                              ? 'bg-purple-500/20'
                              : message.type === 'error'
                              ? 'bg-red-500/20'
                              : 'bg-blue-500/20'
                          }`}
                          style={{ maxWidth: 'calc(100% - 4rem)' }}
                        >
                          {message.content}
                        </div>
                      </motion.div>
                    ))}
                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500 flex items-center justify-center">
                          <FaRobot className="text-lg" />
                        </div>
                        <div className="flex-1 p-4 rounded-xl bg-blue-500/20">
                          <LoadingSpinner size="sm" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div ref={messagesEndRef} style={{ height: '1px' }} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <div className="flex items-end gap-4">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-gray-800/50 rounded-xl p-4 min-h-[60px] max-h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    style={{
                      overflowY: 'auto'
                    }}
                  />
                  <GlowButton
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    icon={loading ? <LoadingSpinner size="sm" /> : <FaPaperPlane />}
                    size="sm"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaLightbulb className="text-yellow-400" />
                Quick Tips
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  Ask specific questions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Provide context when needed
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  Be clear and concise
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <GlowButton
                className="w-full"
                variant="secondary"
                onClick={clearChat}
                icon={<FaEraser />}
              >
                Clear Chat
              </GlowButton>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}