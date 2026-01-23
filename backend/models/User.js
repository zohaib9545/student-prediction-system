const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    class: { type: String }, // e.g. '9th', '10th'
    subjects: { type: [String], default: [] }, // enrolled subjects for students or taught subjects for teachers
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
