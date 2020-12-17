const {
  serverErrorMsg,
  notFoundPageErrorMsg,
} = require('../errors/errorMasseges.js');
const NotFoundError = require('../errors/NotFoundError');

const invalidPath = (_req, _res, next) => {
  const err = new NotFoundError(notFoundPageErrorMsg);

  next(err);
};

const errorHandler = (err, _req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? serverErrorMsg : message,
  });

  next();
};

module.exports = { errorHandler, invalidPath };
