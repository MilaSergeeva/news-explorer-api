const router = require('express').Router();
const auth = require('../middlewares/auth.js');
const userRoutes = require('./users.js');
const authRoutes = require('./auth.js');
const articleRoutes = require('./articals.js');
const NotFoundError = require('../errors/NotFoundError.js');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use('/', authRoutes);

router.use(auth);

router.use('/', userRoutes);
router.use('/', articleRoutes);

module.exports = router;
