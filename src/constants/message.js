const httpStatusCode = require("./httpStatusCode.js");

const ERRORS = {
  SERVER_ERROR: "Server error",
  NOT_FOUND: "Not found",
  CONFLICT: "Conflict",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
};

const USER_MESSAGES = {
  CREATION_FAILED: {
    message: "User creation failed",
    errorCode: ERRORS.SERVER_ERROR,
    statusCode: httpStatusCode.SERVER_ERROR,
  },
  NOT_FOUND: (key, value) => ({
    message: `User with ${key} '${value}' not found`,
    errorCode: ERRORS.NOT_FOUND,
    statusCode: httpStatusCode.NOT_FOUND,
  }),
  CONFLICT_USER: (prop) => ({
    message: `User with '${prop}' already exists`,
    errorCode: ERRORS.CONFLICT,
    statusCode: httpStatusCode.CONFLICT,
  }),
  INVALID_TOKEN: {
    message: "Invalid or expired token",
    errorCode: ERRORS.BAD_REQUEST,
    statusCode: httpStatusCode.BAD_REQUEST,
  },
  INVALID_CREDENTIALS: {
    message: "Invalid credentials",
    errorCode: ERRORS.NOT_FOUND,
    statusCode: httpStatusCode.NOT_FOUND,
  },
  UNAUTHORIZED: {
    message: "Unauthorized request",
    errorCode: ERRORS.UNAUTHORIZED,
    statusCode: httpStatusCode.UNAUTHORIZED,
  },
  CREATED: "User created successfully",
  VERIFIED: "User verified successfully",
  LOGGED_IN: "User logged in successfully",
  LOGGED_OUT: "User logged out successfully",
  UPDATED: "User updated successfully",
  DELETED: "User deleted successfully",
  FORGOT_PASSWORD: "Password reset link sent successfully",
  RESET_PASSWORD: "Password reset successfully",
  CHANGE_PASSWORD: "Password changed successfully",
  EMAIL_SENT: "Email sent successfully",
};

const TASK_MESSAGES = {
  NOT_FOUND: (key, value) => ({
    message: `Task with ${key} '${value}' not found`,
    errorCode: ERRORS.NOT_FOUND,
    statusCode: httpStatusCode.NOT_FOUND,
  }),
  CREATED: "Task created successfully",
  UPDATED: "Task updated successfully",
  DELETED: "Task Deleted successfully",
};

const COMMENT_MESSAGES = {
  NOT_FOUND: (key, value) => ({
    message: `Comment with ${key} '${value}' not found`,
    errorCode: ERRORS.NOT_FOUND,
    statusCode: httpStatusCode.NOT_FOUND,
  }),
  CREATED: "Comment created successfully",
  UPDATED: "Comment updated successfully",
  DELETED: "Comment Deleted successfully",
};

const PROJECT_MESSAGES = {
  CONFLICT_PROJECT: (prop) => ({
    message: `Project with '${prop}' already exists`,
    errorCode: ERRORS.CONFLICT,
    statusCode: httpStatusCode.CONFLICT,
  }),
  NOT_FOUND: (key, value) => ({
    message: `Project with ${key} '${value}' not found`,
    errorCode: ERRORS.NOT_FOUND,
    statusCode: httpStatusCode.NOT_FOUND,
  }),
  CREATED: "Project created successfully",
  UPDATED: "Project updated successfully",
  DELETED: "Project Deleted successfully",
};

module.exports = {
  ERRORS,
  USER_MESSAGES,
  TASK_MESSAGES,
  COMMENT_MESSAGES,
  PROJECT_MESSAGES,
};
