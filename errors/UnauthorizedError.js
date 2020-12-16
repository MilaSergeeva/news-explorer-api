const ApplicationError = require('./ApplicationError');

class UnauthorizedError extends ApplicationError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
