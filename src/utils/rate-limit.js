const { rateLimit } = require("express-rate-limit");

const rateLimiter = (minutes = 5, limit = 5) =>
  rateLimit({
    windowMs: minutes * 60 * 1000,
    limit,
    message: { error: "Too many requests, please try again later." },
  });

module.exports = rateLimiter;
