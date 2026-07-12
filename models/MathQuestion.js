const mongoose = require('mongoose');

const mathQuestionSchema = new mongoose.Schema({
  prompt: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  classLevel: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MathQuestion', mathQuestionSchema);
