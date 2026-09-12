// middleware/errorHandler.js
// Centralized Express Error Handling Middleware

function errorHandler(err, req, res, next) {
  console.error('\n[API SERVER ERROR]:', err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
}

module.exports = errorHandler;
