const jwt = require('jsonwebtoken');
const config = require('../config/env');

const JWT_SECRET = config.JWT_SECRET;

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access Denied: Authorization token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired authentication session.' });
  }
}

// Middleware to verify Administrator role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden: Administrator privileges required.' });
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  JWT_SECRET
};

