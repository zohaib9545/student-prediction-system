const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/authMiddleware');
const { teacherResults } = require('../controllers/performanceController');

router.get('/results', auth, requireRole('teacher'), teacherResults);

module.exports = router;
