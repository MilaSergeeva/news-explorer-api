class ApplicationError extends Error {
  get name() {
    return this.constructor.name;
  }
}

module.exports = ApplicationError;
