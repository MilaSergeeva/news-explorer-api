const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError.js');
const { jwtSecret } = require('../config');

const auth = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    // верифицируем токен
    payload = jwt.verify(token, jwtSecret);
  } catch (e) {
    // отправим ошибку, если не получилось
    const err = new Error('Необходима авторизация. Токен не валидный.');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = auth;
