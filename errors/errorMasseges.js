const badRequestErrorMsg = 'Переданы некорректные данные';

const notFoundErrorMsg = 'Нет статьи по заданному id';

const forbiddenErrorMsg = 'Недостаточно прав для удаления карточки';

const conflictErrorMsg =
  'Переданы некорректные данные. Такой Email уже использован';

const unauthorizedErrorMsg = 'Ошибка аутентификации';

const JWTErrorMsg = 'Необходима авторизация. Токен не валидный.';

const serverErrorMsg = 'На сервере произошла ошибка';

module.exports = {
  badRequestErrorMsg,
  notFoundErrorMsg,
  forbiddenErrorMsg,
  conflictErrorMsg,
  unauthorizedErrorMsg,
  JWTErrorMsg,
  serverErrorMsg,
};
