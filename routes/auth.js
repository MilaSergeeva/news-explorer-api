const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser, login } = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }),
  }),
  createUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }),
  }),
  login,
);

module.exports = router;
