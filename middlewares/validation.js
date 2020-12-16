const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const validator = require('validator');

const validateObjectId = celebrate({
  params: Joi.object()
    .keys({
      articleId: Joi.string()
        .required()
        .custom((value, helpers) => {
          if (ObjectId.isValid(value)) {
            return value;
          }
          return helpers.message('id not valid');
        }),
    })
    .unknown(true),
});

const validateArticleBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string()
      .required()
      .messages({ 'string.required': '"title" must be filled out' }),
    keyword: Joi.string()
      .required()
      .messages({ 'string.required': '"keyword" must be filled out' }),
    text: Joi.string()
      .required()
      .messages({ 'string.required': '"text" must be filled out' }),
    link: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('the URL of the link is not valid');
      }),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('the URL of the link is not valid');
      }),
    date: Joi.string().required(),
    source: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('the URL of the "source" is not valid');
      }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'any.required': '"name" must be filled out',
      'string.min': 'min length of "name" - 2',
      'string.max': 'max length of "name" - 30',
    }),
    email: Joi.string()
      .required()
      .email()
      .message('"email" should be valid email-adress')
      .messages({ 'any.required': '"email" must be filled out' }),
    password: Joi.string()
      .required()
      .trim()
      .messages({ 'any.required': '"password" must be filled out' }),
  }),
});

const validateАuthentification = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('"email" should be valid email-adress')
      .messages({ 'any.required': '"email" must be filled out' }),
    password: Joi.string()
      .required()
      .trim()
      .messages({ 'any.required': '"password" must be filled out' }),
  }),
});

module.exports = {
  validateObjectId,
  validateArticleBody,
  validateUserBody,
  validateАuthentification,
};
