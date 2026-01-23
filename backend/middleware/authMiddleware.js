const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed', error: err.message });
  }
};

const requireRole = role => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden: insufficient privileges' });
  return next();
};

module.exports = auth;
module.exports.requireRole = requireRole;
