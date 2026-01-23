require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/student_prediction';
const ensureAdmin = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcrypt');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(adminPassword, salt);
      admin = await User.create({ name: 'Administrator', email: adminEmail.toLowerCase(), rollNumber: 'ADMIN', password: hashed, role: 'teacher', subjects: [] });
      console.log('Created default admin teacher:', adminEmail);
    }
  } catch (err) {
    console.error('Failed to ensure admin user', err.message);
  }
}

connectDB(MONGO_URI).then(async () => {
  await ensureAdmin();
  const server = http.createServer(app);
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
