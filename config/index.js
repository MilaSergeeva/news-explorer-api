module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'defaultJwt',
  mongodbURL: process.env.MONGODB_URL || 'mongodb://localhost:27017/newsdb',
  rateLimiter: {
    windowMs: Number(process.env.RATE_LIMITER_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMITER_MAX_REQUESTS || 3),
    trustProxy: Number(process.env.RATE_LIMITER_TRUST_PROXY || 1),
  },
};
