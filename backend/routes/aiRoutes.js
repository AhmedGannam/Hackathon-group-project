import express from 'express';
import multer from 'multer';
import { askAI, analyzeLessonContent, generateQuiz, analyzeFile } from '../controllers/aiController.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF, TXT, DOC, and DOCX files are allowed.`));
    }
  }
});

// Handle file upload errors
const handleFileUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: 'File upload error',
        details: err.message
      });
    } else if (err) {
      return res.status(400).json({
        error: 'Invalid file',
        details: err.message
      });
    }
    next();
  });
};

router.post('/ask', askAI);
router.post('/analyze-lesson', analyzeLessonContent);
router.post('/generate-quiz', generateQuiz);
router.post('/analyze-file', handleFileUpload, analyzeFile);

export default router; 