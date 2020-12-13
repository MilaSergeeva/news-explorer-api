const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  validateArticleBody,
  validateObjectId,
} = require('../middlewares/validation.js');

const {
  createUserArticle,
  getUserArticles,
  deleteUserArticle,
} = require('../controllers/article');

router.get('/articles', getUserArticles);

router.post('/articles', validateArticleBody, createUserArticle);

router.delete('/articles/:articleId', validateObjectId, deleteUserArticle);

module.exports = router;
