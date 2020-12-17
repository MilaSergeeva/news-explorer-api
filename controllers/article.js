const Article = require('../models/article');
const BadRequestError = require('../errors/BadRequestError.js');
const ForbiddenError = require('../errors/ForbiddenError.js');
const NotFoundError = require('../errors/NotFoundError');
const {
  badRequestErrorMsg,
  notFoundErrorMsg,
  forbiddenErrorMsg,
} = require('../errors/errorMasseges.js');

// сохраняем карточку
const createUserArticle = (req, res, next) => {
  const owner = req.user._id;
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    owner,
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(badRequestErrorMsg + `. Ошибка: ${err.message}`),
        );
      } else {
        next(err);
      }
    });
};

const getUserArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => next(err));
};

const deleteUserArticle = (req, res, next) => {
  Article.findById({ _id: req.params.articleId })
    .orFail(() => {
      const error = new NotFoundError(notFoundErrorMsg);

      throw error;
    })
    .then(() => {
      const query = {
        _id: req.params.articleId,
        owner: req.user._id,
      };

      return Article.deleteOne(query);
    })
    .then((deleteResult) => {
      if (deleteResult.deletedCount === 0) {
        throw new ForbiddenError(forbiddenErrorMsg);
      }

      res.status(200).send('Статья удалена');
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
