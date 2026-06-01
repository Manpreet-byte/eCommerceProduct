// config/db.js
// Database configuration file for MongoDB connection using Mongoose

const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('Missing required environment variable: MONGODB_URI or MONGO_URI');
    }

    // Connect to MongoDB
    const connection = await mongoose.connect(mongoUri);
    console.log(
      `MongoDB connected: host=${connection.connection.host} db=${connection.connection.name}`
    );
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
