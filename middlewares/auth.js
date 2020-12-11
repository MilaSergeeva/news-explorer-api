const jwt = require('jsonwebtoken');
// const UnauthorizedError = require('../errors/UnauthorizedError.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  const { JWT_SECRET = 'dev-key' } = process.env;

  try {
    // верифицируем токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    // отправим ошибку, если не получилось
    const err = new Error('Необходима авторизация. Токен не валидный.');
    err.statusCode = 401;

    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
