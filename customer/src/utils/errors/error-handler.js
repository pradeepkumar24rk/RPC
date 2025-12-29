module.exports = (app) => {
  app.use((err, req, res, next) => {
    console.log("middleware error handler");
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      message,
    });
  });
};
