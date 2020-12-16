const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: [true, '"keyword" must be filled out'],
    },
    title: {
      type: String,
      required: [true, '"title" must be filled out'],
    },
    text: {
      type: String,
      required: [true, '"text" must be filled out'],
    },
    date: {
      type: String,
      required: [true, '"date" must be filled out'],
    },
    source: {
      type: String,
      required: [true, '"source" must be filled out'],
    },
    link: {
      type: String,
      required: [true, '"link" must be filled out'],
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'the URL of the link is not valid',
      },
    },
    image: {
      type: String,
      required: [true, '"image" must be filled out'],
      validate: {
        validator: (url) => validator.isURL(url),
        message: 'the URL of the remote image is not valid',
      },
    },
    owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true },
  { versionKey: false },
);

// удаляем owner из ответа
articleSchema.methods.toJSON = function deleteOwner() {
  const obj = this.toObject();

  delete obj.owner;

  return obj;
};

module.exports = mongoose.model('article', articleSchema);
