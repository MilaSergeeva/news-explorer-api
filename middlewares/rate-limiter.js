const rateLimit = require('express-rate-limit');
const { rateLimiter: rateLimiterConfig } = require('../config');

const rateLimiter = rateLimit({
  windowMs: rateLimiterConfig.windowMs,
  max: rateLimiterConfig.max,
});

module.exports = { rateLimiter };
