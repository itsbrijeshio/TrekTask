const jwt = require("jsonwebtoken");
const asyncWrapper = require("./asyncWrapper.middleware.js");
const { AuthError } = require("../utils/index.js");

const protect = asyncWrapper(async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers?.authentication?.split(" ")[1];
  if (!token) {
    throw new AuthError("Unauthorized Access");
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  req.auth = decoded;
  if (!req.auth) {
    throw new AuthError("Unauthorized Access");
  }
  next();
});

module.exports = protect;
