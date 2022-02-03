module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  res.status(err.statusCode).json({
    status: err.status,
    // error: err,
    message: err.message,
    // stack: err.stack,
  });
};
