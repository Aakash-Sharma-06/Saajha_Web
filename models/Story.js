const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  transcript: { type: String, required: true },
  audioUrl: { type: String, required: true },
  category: { type: String, default: 'सामान्य' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', storySchema);
