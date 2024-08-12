const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  assignedTo: { type: String, ref: 'User', required: true },
  projectId: { type: String, ref: 'Project', required: true },
});


module.exports = mongoose.model('Task', taskSchema);
