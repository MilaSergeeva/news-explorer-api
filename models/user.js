const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '"name" must be filled out'],
      minlength: [2, 'Minimal length of "name" - 2'],
      maxlength: [30, 'Maximal length of "name" - 30'],
    },
    email: {
      type: String,
      required: [true, '"email" must be filled out'],
      unique: true,
      validate: {
        validator: (email) => validator.isEmail(email),
        message: 'the email is not valid',
      },
    },
    password: {
      type: String,
      required: [true, '"password" must be filled out'],
      select: false,
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new Error('Пользователь с таким email не найден'),
        );
      }

      // сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError('Неправильные почта или пароль'),
          );
        }

        return user;
      });
    });
};

// удаляем пароль из ответа
userSchema.methods.toJSON = function deletePassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
