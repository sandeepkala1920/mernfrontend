const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/env');
const apiRoutes = require('./routes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static(config.UPLOAD_DIR));

// Serve Frontend static assets
app.use(express.static(config.FRONTEND_DIR));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    status: 'online',
    service: 'IEM Kolkata Admission Management Backend (MERN)',
    timestamp: new Date(),
    mongoState: mongoose.connection.readyState === 1 ? 'connected' : 'connecting/disconnected'
  });
});

// Mount Central API Routes
app.use('/api', apiRoutes);

// Fallback route for Frontend Single Page App
app.get('*', (req, res) => {
  res.sendFile(path.join(config.FRONTEND_DIR, 'index.html'));
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;

