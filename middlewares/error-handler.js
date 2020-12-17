const { serverErrorMsg } = require('../errors/errorMasseges.js');

const errorHandler = (err, _req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? serverErrorMsg : message,
  });

  next();
};

module.exports = errorHandler;
