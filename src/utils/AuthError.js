class AuthError extends Error {
  constructor(message) {
    super(message || "");
    this.errorCode = "Unauthorized";
    this.statusCode = 401;
  }
}

module.exports = AuthError;
