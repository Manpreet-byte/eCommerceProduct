// server.js
// Main server file - Entry point for the application

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import database connection
const connectDB = require('./config/db');

// Import middleware
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Initialize express app
const app = express();
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

// Connect to MongoDB
if (!mongoUri || !process.env.JWT_SECRET) {
  console.error('Missing required environment variables: MONGODB_URI or MONGO_URI and JWT_SECRET');
  process.exit(1);
}

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(logger); // Log all requests

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/products', productRoutes); // Product routes

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

// Debug route (safe to keep; does not expose secrets)
app.get('/api/debug/db', (req, res) => {
  const mongoose = require('mongoose');
  res.status(200).json({
    success: true,
    host: mongoose.connection?.host,
    db: mongoose.connection?.name,
    readyState: mongoose.connection?.readyState,
  });
});

// 404 Not Found handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
