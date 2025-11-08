// server/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  // Check if we already set a status code, otherwise default to 500 (Internal Server Error)
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Send a JSON response with the error message
  res.json({
    message: err.message,
    // We only want the stack trace in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};