const PerformanceRecord = require('../models/PerformanceRecord');
const { calculatePerformance, generateSuggestions } = require('../utils/calc');

function validateMarks({ assignmentMarks, quizMarks, midtermMarks }) {
  if (!Array.isArray(assignmentMarks) || assignmentMarks.some(m => typeof m !== 'number' || m < 0 || m > 100)) return false;
  if (!Array.isArray(quizMarks) || quizMarks.some(m => typeof m !== 'number' || m < 0 || m > 100)) return false;
  if (typeof midtermMarks !== 'number' || midtermMarks < 0 || midtermMarks > 100) return false;
  return true;
}

const submitPerformance = async (req, res) => {
  try {
    const { assignmentMarks, quizMarks, midtermMarks, subject, actualMarks } = req.body;
    if (!subject) return res.status(400).json({ message: 'Subject is required' });
    if (!validateMarks({ assignmentMarks, quizMarks, midtermMarks })) {
      return res.status(400).json({ message: 'Invalid academic data. Marks must be numbers 0-100.' });
    }

    const calc = calculatePerformance({ assignmentMarks, quizMarks, midtermMarks });
    const suggestions = generateSuggestions({ assignmentAvg: calc.assignmentAvg, quizAvg: calc.quizAvg, midtermMarks, subject });

    const record = await PerformanceRecord.create({
      studentId: req.user._id,
      class: req.user.class,
      subject,
      assignmentAvg: calc.assignmentAvg,
      quizAvg: calc.quizAvg,
      midtermMarks: midtermMarks,
      actualMarks: typeof actualMarks === 'number' ? actualMarks : undefined,
      performanceScore: calc.performanceScore,
      predictedMarks: calc.predictedFinal,
      level: calc.level,
      suggestions,
      teacher: req.user.role === 'teacher' ? req.user._id : undefined,
    });

    return res.status(201).json({ message: 'Prediction created', record });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const records = await PerformanceRecord.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ records });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const analyticsData = async (req, res) => {
  try {
    // Return simple series data for charts: assignmentAvg and quizAvg over time
    const records = await PerformanceRecord.find({ studentId: req.user._id }).sort({ createdAt: 1 });
    const series = records.map(r => ({
      date: r.createdAt.toISOString(),
      assignmentAvg: r.assignmentAvg,
      quizAvg: r.quizAvg,
      midtermMarks: r.midtermMarks || 0,
      performanceScore: r.performanceScore,
      predictedMarks: r.predictedMarks,
    }));
    return res.json({ series });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher-facing: get results for a given class and subject
const teacherResults = async (req, res) => {
  try {
    const { class: className, subject } = req.query;
    if (!subject) return res.status(400).json({ message: 'subject query param required' });

    // Build query: subject required, class optional
    const query = { subject };
    if (className) query.class = className;

    // Find latest records per student for the given filters
    const records = await PerformanceRecord.find(query).populate('studentId', 'name rollNumber class').sort({ createdAt: -1 });

    // Map latest by student
    const latest = {};
    for (const r of records) {
      const sid = String(r.studentId._id);
      if (!latest[sid]) latest[sid] = r;
    }

    const results = Object.values(latest).map(r => ({
      studentName: r.studentId.name,
      rollNumber: r.studentId.rollNumber,
      subject: r.subject,
      class: r.class,
      actualMarks: r.actualMarks,
      predictedMarks: r.predictedMarks,
      difference: typeof r.actualMarks === 'number' && typeof r.predictedMarks === 'number' ? Number((r.actualMarks - r.predictedMarks).toFixed(2)) : null,
      suggestions: r.suggestions || [],
    }));

    return res.json({ results });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitPerformance, getHistory, analyticsData, teacherResults };
