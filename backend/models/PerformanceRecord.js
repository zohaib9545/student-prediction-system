const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: String }, // class of the student at time of record (optional)
    subject: { type: String, required: true },
    assignmentAvg: { type: Number, required: true },
    quizAvg: { type: Number, required: true },
    projectPresentationAvg: { type: Number, default: 0 },
    participationAvg: { type: Number, default: 0 },
    midtermMarks: { type: Number },
    actualMarks: { type: Number }, // actual final/subject mark when available
    predictedMarks: { type: Number, required: true },
    predictedGrade: { type: String },
    predictedGradePoint: { type: Number },
    performanceScore: { type: Number, required: true },
    level: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
    suggestions: { type: [String], default: [] },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PerformanceRecord', performanceSchema);
