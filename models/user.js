const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '"name" must be filled out'],
      minlength: [2, 'Minimal length of "name" - 2'],
      maxlength: [30, 'Maximal length of "name" - 30'],
      default: 'Имя',
    },
    avatar: {
      type: String,
      required: true,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
      required: true,
      select: false,
      validate: {
        validator: (password) => validator.notEmpty(password),
        message: '"password" must be filled out',
      },
    },
  },
  { versionKey: false },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
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
