const mongoose = require('mongoose');

// Define a schema for user responses
const SkinAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // If you have a User model
    required: true,
  },
  answers: {
    type: [String], // Array of answers
    required: true,
  },
  result: {
    type: String, // Prediction result
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const SkinAssessment = mongoose.model('SkinAssessment', SkinAssessmentSchema);

module.exports = SkinAssessment;
