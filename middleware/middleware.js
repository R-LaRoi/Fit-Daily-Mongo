function middleErrors(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Unavailable");
}

module.exports = { middleErrors };
