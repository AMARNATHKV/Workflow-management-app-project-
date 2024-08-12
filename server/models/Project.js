
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  invitestaff: [{ username: String, createdAt: Date }], 
  manager: { type:String },
 
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
