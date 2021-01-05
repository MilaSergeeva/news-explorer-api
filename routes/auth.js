const router = require('express').Router();
const {
  validateUserBody,
  validateАuthentification,
} = require('../middlewares/validation.js');

const { createUser, login } = require('../controllers/users');

router.post('/signup', validateUserBody, createUser);

router.post('/signin', validateАuthentification, login);

module.exports = router;
