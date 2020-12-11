const Article = require('../models/article');
const NotFoundError = require('../errors/NotFoundError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const ForbiddenError = require('../errors/ForbiddenError.js');

// создаем карточку
const createArticleCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Article.create({ owner, name, link })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        new BadRequestError(
          `Переданы некорректные данные. Ошибка: ${err.message}`,
        );
      }
      next(err);
    });
};

const getArticleCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.status(200).send(data))
    .catch((err) => next(err));
};

// удаляем карточку
const deleteArticleCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }

      res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

// ставим лайк карточке
// const addLikeToArticleCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     {
//       new: true,
//     },
//   )
//     .orFail(new NotFoundError('Запрашиваемый ресурс не найден'))
//     .then((card) => res.status(200).send(card))
//     .catch((err) => {
//       if (err.name === 'DocumentNotFoundError') {
//         new NotFoundError('Запрашиваемый ресурс не найден');
//       }

//       next(err);
//     });
// };

// убраем лайк с карточки
// const deleteLikeToArticleCard = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     {
//       new: true,
//     },
//   )
//     .orFail()
//     .then((card) => res.status(200).send(card))
//     .catch((err) => {
//       if (err.name === 'DocumentNotFoundError') {
//         new NotFoundError('Запрашиваемый ресурс не найден');
//       }

//       next(err);
//     });
// };

module.exports = {
  createArticleCard,
  getArticleCards,
  deleteArticleCard,
  addLikeToArticleCard,
  deleteLikeToArticleCard,
};
