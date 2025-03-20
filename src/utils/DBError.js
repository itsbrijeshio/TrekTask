class DBError extends Error {
  constructor({ message, errorCode, statusCode }) {
    super(message || "");
    this.errorCode = errorCode || "";
    this.statusCode = statusCode || "";
  }
}

module.exports =DBError;
