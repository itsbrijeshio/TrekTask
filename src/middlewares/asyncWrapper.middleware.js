const { ZodError } = require("zod");
const jwt = require("jsonwebtoken");
const { DBError, AuthError, logger } = require("../utils/index.js");

const zodErrors = (issues) => issues.map((issue) => issue.message);

const asyncWrapper = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    let statusCode = 500;
    const response = {
      success: false,
      errorCode: "Server Error",
      message: "Internal Server Error",
    };
    if (error instanceof ZodError) {
      statusCode = 400;
      response.errorCode = "Bad Request";
      response.message = zodErrors(error.issues);
    } else if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      statusCode = 401;
      response.errorCode = "Unauthorized";
      response.message = "Session expired. please again login.";
    } else if (error instanceof DBError || error instanceof AuthError) {
      statusCode = error.statusCode;
      response.errorCode = error.errorCode;
      response.message = error.message;
    } else if (process.env.NODE_ENV == "development") {
      response.message = error.message;
    }
    if (statusCode === 500) {
      logger.error(`${error.message} - [${req.originalUrl}]`);
    }

    return res.status(statusCode).json(response);
  }
};

module.exports = asyncWrapper;
