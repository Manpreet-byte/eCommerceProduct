// middleware/logger.js
// Logger middleware to log HTTP requests

const logger = (req, res, next) => {
  // Log the HTTP method and URL
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = logger;
