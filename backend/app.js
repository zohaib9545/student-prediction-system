const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/teacher', teacherRoutes);

// Health-check
app.get('/api/ping', (req, res) => res.json({ message: 'pong' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;
