const errorHandler = (err, _req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    // : `${Object.values(err.errors)
    //     .map((error) => error.message)
    //     .join(', ')}`,
  });

  next();
};

module.exports = errorHandler;
