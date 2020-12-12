const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  validateArticleBody,
  validateObjectId,
} = require('../middlewares/validation.js');

const {
  saveArticleCard,
  getArticleCards,
  deleteArticleCard,
} = require('../controllers/article');

router.get('/articles', getArticleCards);

router.post('/articles', validateArticleBody, saveArticleCard);

router.delete('/articles/:articleId', validateObjectId, deleteArticleCard);

module.exports = router;
