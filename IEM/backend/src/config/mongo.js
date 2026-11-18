const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log(`✅ MongoDB Connected to: ${config.MONGO_URI}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ Local MongoDB is not running or unreachable (${err.message}). Starting server in standalone mode...`);
    return false;
  }
};

module.exports = { connectDB };

