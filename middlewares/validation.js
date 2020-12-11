const { celebrate, Joi } = require('celebrate');
const { ObjectId } = reguire('mongoose').Types;
const validator = require('validator');

const ValidateObjectI = celebrate({
  parsms: Joy.object().keys({
    id: Joy.string()
      .required()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('id not valid');
      }),
  }),
});
