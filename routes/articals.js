const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createArticleCard,
  getArticleCards,
  deleteArticleCard,
} = require('../controllers/article');

router.get('/articles', getArticleCards);

router.post(
  '/articles',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(8).max(30),
      link: Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^(http|https)://[^ "]+$')),
    }),
  }),
  createArticleCard,
);

router.delete(
  '/articles/:articleId',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().alphanum().length(24),
      })
      .unknown(true),
    query: Joi.object()
      .keys({
        id: Joi.string(),
      })
      .unknown(true),
  }),
  deleteArticleCard,
);

module.exports = router;
