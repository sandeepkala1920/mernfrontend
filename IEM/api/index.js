const app = require('../backend/src/app');
const { connectDB } = require('../backend/src/config/mongo');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.warn('MongoDB connection notice in serverless function:', err.message);
    }
  }
  return app(req, res);
};
