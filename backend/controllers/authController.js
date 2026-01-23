const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, rollNumber, password, class: className, subjects = [] } = req.body;
    // Force registration to create only student accounts through public register endpoint
    const role = 'student'
    if (!name || !email || !rollNumber || !password) {
      return res.status(400).json({ message: 'Name, email, roll number and password are required' });
    }
    if (!className) {
      return res.status(400).json({ message: 'Class is required for student registration' });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      rollNumber,
      password: hashed,
      role,
      class: className,
      subjects,
    });
    return res.status(201).json({ message: 'Registration successful', user: { id: user._id, name: user.name, email: user.email, role: user.role, class: user.class, subjects: user.subjects } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role, class: user.class, subjects: user.subjects } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login };
