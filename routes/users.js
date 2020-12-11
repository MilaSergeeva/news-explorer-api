const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCurrentUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.get(
  '/users/:id',
  celebrate({
    params: Joi.object()
      .keys({
        id: Joi.string().alphanum().length(24),
      })
      .unknown(true),
    query: Joi.object()
      .keys({
        id: Joi.string(),
      })
      .unknown(true),
  }),
  getUserByID,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfoByID,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(new RegExp('^(http|https)://[^ "]+$')),
    }),
  }),
  updateUserAvatarByID,
);

module.exports = router;
