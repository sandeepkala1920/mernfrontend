const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://rohan:ceu1868EYC7JzyWp@backend.zxhq52k.mongodb.net/IEM',
  JWT_SECRET: process.env.JWT_SECRET || 'iem_kolkata_admissions_jwt_secret_key_2026',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@gmail.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  UPLOAD_DIR: process.env.VERCEL ? '/tmp' : path.resolve(__dirname, '../../uploads'),
  FRONTEND_DIR: path.resolve(__dirname, '../../../frontend')
};

module.exports = config;

