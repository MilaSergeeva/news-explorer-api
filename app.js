require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler.js');
const { rateLimiter } = require('./middlewares/rate-limiter');
const {
  mongodbURL,
  rateLimiter: rateLimiterConfig,
} = require('./config/index.js');

const app = express();

mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const PORT = process.env.PORT || 3000;

const routes = require('./routes/index');

app.use(cors());
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.set('trust proxy', rateLimiterConfig.trustProxy);
app.use(rateLimiter);

app.use(bodyParser.json()); // support parsing of application/json type post data

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler); // обрабатка ошибки централизованно

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
