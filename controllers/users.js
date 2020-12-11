const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const UnauthorizedError = require('../errors/UnauthorizedError.js');
const ConflictError = require('../errors/ConflictError.js');

const { JWT_SECRET } = process.env;

// создаем пользователя
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(
            new BadRequestError(
              `Переданы некорректные данные. Ошибка: ${err.message}`,
            ),
          );
        } else if (err.message.includes('duplicate key error collection')) {
          next(
            new ConflictError(
              'Переданы некорректные данные. Такой Email уже использован',
            ),
          );
        }

        next(err);
      }),
  );
};

// находим пользователя
// const getUserByID = (req, res, next) => {
//   User.findById({ _id: req.params.id })
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Нет пользователя с таким id');
//       }

//       return res.status(200).send(user);
//     })
//     .catch((err) => next(err));
// };

// находим пользователя
const getCurrentUser = (req, res, next) => {
  User.findById({ _id: req.user._id }) // не по айдишнику, а по jwt токену
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

// обновление профиля
// const updateUserInfoByID = (req, res, next) => {
//   const { name, about } = req.body;

//   User.findByIdAndUpdate(
//     { _id: req.user._id },
//     { name, about },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .then((user) => {
//       res.status(200).send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         // eslint-disable-next-line no-new
//         next(
//           new BadRequestError(
//             `Переданы некорректные данные. Ошибка: ${err.message}`,
//           ),
//         );
//       } else {
//         next(err);
//       }
//     });
// };

// обновление аватара
// const updateUserAvatarByID = (req, res, next) => {
//   const { avatar } = req.body;

//   User.findByIdAndUpdate(
//     { _id: req.user._id },
//     { avatar },
//     {
//       new: true,
//       runValidators: true,
//     },
//   )
//     .then((user) => res.status(200).send(user))
//     .catch((err) => next(err));
// };

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Ошибка аутентификации');
      }
      const jwtSecret = JWT_SECRET;
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '7d' });

      // возвращаем токен
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `Переданы некорректные данные. Ошибка: ${err.message}`,
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserByID,
  getCurrentUser,
  updateUserInfoByID,
  updateUserAvatarByID,
  login,
};
