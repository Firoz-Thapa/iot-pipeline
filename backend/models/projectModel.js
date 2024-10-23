const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/codeIDE');
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
