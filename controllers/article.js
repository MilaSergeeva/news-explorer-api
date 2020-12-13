const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const ForbiddenError = require('../errors/ForbiddenError.js');

// сохраняем карточку
const createUserArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({ owner, keyword, title, text, date, source, link, image })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      console.log(err.name, err.message);
      if (err.name === 'ValidationError') {
        console.log('krab');
        next(
          new BadRequestError(
            `Переданы некорректные данные. Ошибка: ${err.message}`,
          ),
        );
      }
      next(err);
    });
};

const getUserArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => next(err));
};

// удаляем карточку
const deleteUserArticle = (req, res, next) => {
  Article.findOneAndDelete({ _id: req.params.articleId, owner: req.user._id })
    .then((article) => {
      if (!article) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }

      res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  createUserArticle,
  getUserArticles,
  deleteUserArticle,
};
