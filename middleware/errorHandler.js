// middleware/errorHandler.js
// Error handling middleware

const errorHandler = (err, req, res, next) => {
  // Log error to console
  console.error('Error:', err);

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  // Send error response
  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
