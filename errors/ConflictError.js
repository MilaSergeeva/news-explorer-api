const ApplicationError = require('./ApplicationError');

class ConflictError extends ApplicationError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
