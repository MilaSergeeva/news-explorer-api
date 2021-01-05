const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError.js');
const UnauthorizedError = require('../errors/UnauthorizedError.js');
const ConflictError = require('../errors/ConflictError.js');
const { jwtSecret } = require('../config');
const {
  badRequestErrorMsg,
  conflictErrorMsg,
  unauthorizedErrorMsg,
} = require('../errors/errorMasseges.js');

// создаем пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(
            new BadRequestError(
              badRequestErrorMsg + `. Ошибка: ${err.message}`,
            ),
          );
        } else if (err.name === 'MongoError' && err.code === 11000) {
          next(new ConflictError(conflictErrorMsg));
        } else {
          next(err);
        }
      });
  });
};

// находим пользователя
const getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id }) // не по айдишнику, а по jwt токену
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError(unauthorizedErrorMsg));
      }
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

      // возвращаем токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(
          new BadRequestError(badRequestErrorMsg + `. Ошибка: ${err.message}`),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
};
