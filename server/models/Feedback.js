
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
 
});

module.exports = mongoose.model('Feedback', feedbackSchema);
