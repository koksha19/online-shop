module.exports = (err, next) => {
  const error = new Error(err);
  console.log(err);
  error.httpStatusCode = 500;
  return next(error);
};
