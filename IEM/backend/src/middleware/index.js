const { verifyToken, requireAdmin, JWT_SECRET } = require('./authMiddleware');
const upload = require('./uploadMiddleware');
const { errorHandler } = require('./errorMiddleware');

module.exports = {
  verifyToken,
  requireAdmin,
  JWT_SECRET,
  upload,
  errorHandler
};

