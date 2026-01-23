const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { submitPerformance, getHistory, analyticsData, teacherResults } = require('../controllers/performanceController');
const { requireRole } = require('../middleware/authMiddleware');

router.post('/submit', auth, submitPerformance);
router.get('/history', auth, getHistory);
router.get('/analytics', auth, analyticsData);
router.get('/teacher/results', auth, requireRole('teacher'), teacherResults);

module.exports = router;
