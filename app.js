require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler.js');

const app = express();

mongoose.connect(
  process.env.MONGODB_URL || 'mongodb://localhost:27017/newsdb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
);

const PORT = process.env.PORT || 3000;

const routes = require('./routes/index');

app.use(cors());
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());

// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// обрабатка ошибки централизованно

app.use(errorHandler);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
