const logRequestDetails = (req, res, next) => {
  const start = Date.now(); // Capture the start time
  const requestTime = new Date().toISOString(); // Log request time in ISO format

  // Log the incoming request details
  console.log(`[${requestTime}] ${req.method} ${req.originalUrl}`);

  // Wait until the response is finished
  res.on("finish", () => {
    const responseTime = Date.now() - start; // Calculate response time
    console.log(
      `[${requestTime}] ${req.method} ${req.originalUrl} - ${res.statusCode} [${responseTime}ms]`
    );
  });

  next(); // Pass control to the next middleware/route handler
};

module.exports = logRequestDetails;
