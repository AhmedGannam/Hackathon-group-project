import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }],
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }
});

export default mongoose.model('Quiz', quizSchema); 