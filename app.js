require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError.js');

const app = express();

mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost:27017/mestodb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
);

const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js');
const cardRoutes = require('./routes/articals.js');

app.use(cors());
app.use(requestLogger); // подключаем логгер запросов

// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', authRoutes);

// авторизация
app.use(auth);

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use((_req, _res, next) => {
  const err = new NotFoundError('Страница не найдена');

  next(err);
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// обрабатка ошибки централизованно
app.use((err, _req, res, _next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
