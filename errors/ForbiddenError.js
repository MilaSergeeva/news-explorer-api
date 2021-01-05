const ApplicationError = require('./ApplicationError');

class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
