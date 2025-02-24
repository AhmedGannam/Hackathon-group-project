import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import { SpeechClient } from '@google-cloud/speech';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import textToSpeech from '@google-cloud/text-to-speech';
import { parsePDF } from '../utils/pdfParser.js';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const speechClient = new SpeechClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create Text-to-Speech client
const ttsClient = new textToSpeech.TextToSpeechClient();

export const askAI = async (req, res) => {
  try {
    const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        console.log('Sending message to AI:', message);

        const result = await model.generateContent(`You are an expert AI tutor for the Eduverse platform. 
        Help students learn and understand various subjects in a friendly and engaging way.
        
        Student question: ${message}
        
        Please provide a helpful and educational response.`);
        
        const response = await result.response;
        const text = response.text();
        
        console.log('AI Response:', text);
        
        res.json({ response: text });
    } catch (error) {
        console.error('Error in askAI:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to get AI response. Please try again.',
            details: error.message
        });
    }
};

export const generateQuiz = async (req, res) => {
    try {
        const { topic } = req.body;
        
        if (!topic) {
            return res.status(400).json({ error: 'Topic is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Generate a quiz with exactly 4 multiple choice questions about ${topic}.
        Format your response as a JSON array like this example:
        [
          {
            "question": "What is the capital of France?",
            "answers": ["London", "Paris", "Berlin", "Madrid"],
            "correctAnswer": 1
          }
        ]
        Important:
        1. Return exactly 4 questions
        2. Each question must have exactly 4 answer options
        3. correctAnswer must be 0, 1, 2, or 3 (index of correct answer)
        4. Questions should be challenging but fair
        5. Return ONLY the JSON array
        6. Ensure valid JSON format`;

        console.log('Sending prompt to AI:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw AI response:', text);

        // Clean the response text
        const cleanedText = text.trim().replace(/```json|```/g, '').trim();
        console.log('Cleaned response:', cleanedText);
        
        let questions;
        try {
            questions = JSON.parse(cleanedText);
            
            if (!Array.isArray(questions)) {
                console.error('Response is not an array:', cleanedText);
                throw new Error('AI response is not in the correct format (not an array)');
            }
            
            if (questions.length !== 4) {
                console.error(`Wrong number of questions: ${questions.length}`);
                throw new Error(`AI generated ${questions.length} questions instead of 4`);
            }
            
            const validatedQuestions = questions.map((q, i) => {
                if (!q.question || typeof q.question !== 'string') {
                    throw new Error(`Question ${i + 1} is missing or invalid`);
                }
                
                if (!Array.isArray(q.answers) || q.answers.length !== 4) {
                    throw new Error(`Question ${i + 1} does not have exactly 4 answers`);
                }
                
                if (!q.answers.every(a => typeof a === 'string')) {
                    throw new Error(`Question ${i + 1} has invalid answer format`);
                }
                
                const correctAnswer = parseInt(q.correctAnswer);
                if (isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
                    throw new Error(`Question ${i + 1} has invalid correctAnswer: ${q.correctAnswer}`);
                }
                
                return {
                    question: q.question.trim(),
                    answers: q.answers.map(a => a.trim()),
                    correctAnswer: correctAnswer
                };
            });
            
            console.log('Successfully validated questions:', validatedQuestions);
            res.json({ questions: validatedQuestions });
        } catch (error) {
            console.error('Failed to parse or validate AI response:', error);
            console.error('Raw response:', text);
            console.error('Cleaned response:', cleanedText);
            return res.status(500).json({ 
                error: 'Failed to generate valid quiz questions. Please try again.',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Error in generateQuiz:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to generate quiz. Please try again.',
            details: error.message
        });
    }
};

export const analyzeLessonSummary = async (req, res) => {
    try {
        const { summary } = req.body;
        
        if (!summary) {
            return res.status(400).json({ error: 'Summary is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ error: 'AI service configuration error' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Analyze this lesson summary and provide:
        1. A list of key concepts
        2. A brief explanation suitable for text-to-speech
        3. Three review questions
        4. Learning objectives achieved

        Format the response as a JSON object with these properties:
        {
          "concepts": ["concept1", "concept2", ...],
          "explanation": "Brief, conversational explanation",
          "questions": ["question1", "question2", "question3"],
          "objectives": ["objective1", "objective2", ...]
        }

        Summary to analyze: ${summary}`;

        console.log('Sending prompt to AI:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Raw AI response:', text);

        // Clean and parse the response
        const cleanedText = text.trim().replace(/```json|```/g, '').trim();
        
        try {
            const analysis = JSON.parse(cleanedText);
            
            // Validate the structure
            if (!analysis.concepts || !Array.isArray(analysis.concepts)) {
                throw new Error('Invalid concepts array');
            }
            if (!analysis.explanation || typeof analysis.explanation !== 'string') {
                throw new Error('Invalid explanation');
            }
            if (!analysis.questions || !Array.isArray(analysis.questions)) {
                throw new Error('Invalid questions array');
            }
            if (!analysis.objectives || !Array.isArray(analysis.objectives)) {
                throw new Error('Invalid objectives array');
            }
            
            res.json({ analysis });
        } catch (error) {
            console.error('Failed to parse AI response:', error);
            console.error('Raw response:', text);
            return res.status(500).json({ 
                error: 'Failed to analyze lesson summary. Please try again.',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Error in analyzeLessonSummary:', error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('AI service response:', error.response.data);
        }
        res.status(500).json({ 
            error: 'Failed to analyze lesson. Please try again.',
            details: error.message
        });
    }
};

export const transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        // Configure the request
        const audio = {
            content: req.file.buffer.toString('base64'),
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await speechClient.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        res.json({ text: transcription });
    } catch (error) {
        console.error('Error in transcribeAudio:', error);
        res.status(500).json({ 
            error: 'Failed to transcribe audio',
            details: error.message
        });
    }
};

export const analyzeLessonContent = async (req, res) => {
  try {
    const { lessonContent } = req.body;

    if (!lessonContent || typeof lessonContent !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: 'Lesson content is required and must be a string' 
      });
    }

    if (lessonContent.trim().length < 10) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: 'Lesson content is too short. Please provide more content to analyze.' 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({ 
        error: 'Configuration error',
        details: 'AI service is not properly configured' 
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an expert educational content analyzer. I need you to analyze the following lesson content and provide a structured response in exactly this format:

Summary:
[Write a 2-3 sentence summary here, focusing on the main concepts and their importance]

Key Points:
- [First key point here]
- [Second key point here]
- [Third key point here]
- [Fourth key point here]
- [Fifth key point here]

Review Questions:
? [First review question here]
? [Second review question here]
? [Third review question here]

Important formatting rules:
1. Keep exactly this structure with empty lines between sections
2. Start each key point with "- "
3. Start each question with "? "
4. Provide exactly 5 key points
5. Provide exactly 3 review questions
6. Make sure the summary is clear and concise

Lesson Content to analyze:
${lessonContent.trim()}

Remember to maintain the exact formatting as shown above.`;

    console.log('Sending prompt to AI:', prompt);

    const result = await model.generateContent(prompt);
      
    if (!result || !result.response) {
      throw new Error('No response from AI service');
    }

    const response = await result.response;
    const text = response.text();
      
    if (!text) {
      throw new Error('Empty response from AI service');
    }

    console.log('Raw AI response:', text);

    // Parse the response into structured data
    const lines = text.split('\n');
    let summary = '';
    let keyPoints = [];
    let questions = [];
    let currentSection = '';

    for (let line of lines) {
      line = line.trim();
      
      if (line === '') continue;
      
      if (line === 'Summary:') {
        currentSection = 'summary';
      } else if (line === 'Key Points:') {
        currentSection = 'keyPoints';
      } else if (line === 'Review Questions:') {
        currentSection = 'questions';
      } else {
        switch (currentSection) {
          case 'summary':
            if (summary === '') {
              summary = line;
            } else {
              summary += ' ' + line;
            }
            break;
          case 'keyPoints':
            if (line.startsWith('-')) {
              keyPoints.push(line.substring(1).trim());
            }
            break;
          case 'questions':
            if (line.startsWith('?')) {
              questions.push(line.substring(1).trim());
            }
            break;
        }
      }
    }

    // Ensure we have some content
    if (!summary && keyPoints.length === 0 && questions.length === 0) {
      return res.json({
        summary: "Unable to generate a detailed summary at this time.",
        keyPoints: [
          'Understanding the main concept',
          'Identifying key relationships',
          'Recognizing important details',
          'Applying the knowledge',
          'Making connections to other topics'
        ],
        suggestedQuestions: [
          'What are the main concepts discussed in this lesson?',
          'How would you explain these concepts to someone else?',
          'How can you apply this knowledge in real-world situations?'
        ],
        note: 'The analysis has been simplified due to processing limitations.'
      });
    }

    // Fill in any missing sections with defaults
    if (!summary) {
      summary = "Analysis completed. Please refer to the key points and questions below.";
    }

    if (keyPoints.length === 0) {
      keyPoints = [
        'Understanding the main concept',
        'Identifying key relationships',
        'Recognizing important details',
        'Applying the knowledge',
        'Making connections to other topics'
      ];
    }

    if (questions.length === 0) {
      questions = [
        'What are the main concepts discussed in this lesson?',
        'How would you explain these concepts to someone else?',
        'How can you apply this knowledge in real-world situations?'
      ];
    }

    // Take only what we need
    keyPoints = keyPoints.slice(0, 5);
    questions = questions.slice(0, 3);

    // Pad if we don't have enough
    while (keyPoints.length < 5) {
      keyPoints.push('Exploring additional aspects of the topic');
    }
    while (questions.length < 3) {
      questions.push('How can you apply this knowledge in different contexts?');
    }

    return res.json({
      summary,
      keyPoints,
      suggestedQuestions: questions,
      note: keyPoints.length !== 5 || questions.length !== 3 ? 
        'Some parts of the analysis have been adjusted to maintain consistency.' : undefined
    });

  } catch (error) {
    console.error('Error in lesson analysis:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    return res.status(500).json({
      error: 'Analysis failed',
      details: error.message || 'An unexpected error occurred while analyzing the lesson content',
      type: error.name || 'UnknownError'
    });
  }
};

export const analyzeFile = async (req, res) => {
  try {
    console.log('Received file analysis request');
    
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file uploaded',
        details: 'Please select a file to analyze'
      });
    }

    let textContent = '';

    try {
      switch (req.file.mimetype) {
        case 'application/pdf':
          try {
            textContent = await parsePDF(req.file.buffer);
          } catch (pdfError) {
            console.error('PDF parsing error:', pdfError);
            return res.status(400).json({
              error: 'Failed to process PDF',
              details: 'Could not extract text from the PDF file'
            });
          }
          break;

        case 'text/plain':
          textContent = req.file.buffer.toString('utf-8');
          break;

        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          textContent = result.value;
          break;

        default:
          return res.status(400).json({
            error: 'Unsupported file type',
            details: `File type ${req.file.mimetype} is not supported. Please use PDF, TXT, DOC, or DOCX files.`
          });
      }

      if (!textContent || textContent.trim().length === 0) {
        return res.status(400).json({
          error: 'Empty content',
          details: 'No readable text found in the file'
        });
      }

      // Use Gemini API to analyze the content
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Create a brief, engaging summary of the following text. Make it conversational and easy to understand:

      ${textContent.substring(0, 5000)}`;

      const result = await model.generateContent(prompt);
      const summary = result.response.text();

      res.json({
        success: true,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        summary: summary
      });

    } catch (error) {
      console.error('Processing error:', error);
      return res.status(500).json({
        error: 'Processing failed',
        details: 'Failed to process the file content'
      });
    }

  } catch (error) {
    console.error('File analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      details: 'An error occurred while analyzing the file'
    });
  }
};