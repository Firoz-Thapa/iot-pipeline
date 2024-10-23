const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/codeIDE');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
