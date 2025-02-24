import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaFilePdf, FaFileWord, FaFileAlt, FaPlay, FaPause } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function FileAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name, selectedFile.type, selectedFile.size);
      setFile(selectedFile);
      setError(null);
      setAnalysis(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const speakSummary = (text) => {
    if (speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const analyzeFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending file for analysis...');
      const response = await axios.post(`${API_URL}/ai/analyze-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Analysis response:', response.data);

      if (response.data && response.data.summary) {
        setAnalysis(response.data);
        speakSummary(response.data.summary);
      }
    } catch (err) {
      console.error('Error analyzing file:', err);
      setError(err.response?.data?.details || 'Failed to analyze file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">File Analyzer</h1>

        <GlassCard className="p-6">
          {/* File Upload */}
          <div 
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.txt,.doc,.docx"
            />
            <FaUpload className="text-4xl mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500 mt-2">PDF, TXT, DOC, DOCX (Max 10MB)</p>
          </div>

          {/* Selected File Info */}
          {file && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-4">
                <FaFilePdf className="text-2xl text-purple-400" />
                <div>
                  <p className="text-gray-200">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <GlowButton
            onClick={analyzeFile}
            disabled={!file || loading}
            className="w-full mt-6"
          >
            {loading ? <LoadingSpinner /> : 'Analyze File'}
          </GlowButton>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Summary</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{analysis.summary}</p>
                
                {/* Speech Control */}
                <button
                  onClick={() => speaking ? window.speechSynthesis.cancel() : speakSummary(analysis.summary)}
                  className="mt-4 flex items-center gap-2 text-purple-400 hover:text-purple-300"
                >
                  {speaking ? <FaPause /> : <FaPlay />}
                  <span>{speaking ? 'Stop' : 'Listen'}</span>
                </button>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
} 