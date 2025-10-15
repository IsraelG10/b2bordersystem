function errorHandler(err, req, res) {
  console.error(err);
  const status = err.status || 400;
  res.status(status).json({ error: err.message });
}

module.exports = errorHandler;
