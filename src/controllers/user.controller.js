const asyncWrapper = require("../middlewares/asyncWrapper.middleware.js");
const userService = require("../services/user.service.js");
const { response, setCookie } = require("../utils/index.js");
const { USER_MESSAGES } = require("../constants/message.js");

class UserController {
  constructor() {
    this.ROLE = "user";
  }

  handleCreateUser = asyncWrapper(async (req, res) => {
    const { name, email, password, role = this.ROLE } = req.body;
    const user = await userService.createUser({
      name,
      email,
      password,
      role,
    });
    const message = USER_MESSAGES.CREATED;
    response(res, { statusCode: 201, message, user });
  });

  handleLoginUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.loginUser({ email, password });
    const token = await setCookie(res, user);
    const message = USER_MESSAGES.LOGGED_IN;
    response(res, { statusCode: 200, message, token });
  });

  handleGetUser = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const user = await userService.getUser(userId);
    response(res, { statusCode: 200, user });
  });

  handleUpdateUser = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { name } = req.body;
    const user = await userService.updateUser(userId, { name });
    const message = USER_MESSAGES.UPDATED;
    response(res, { statusCode: 200, message, user });
  });

  handleDeleteUser = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    await userService.deleteUser(userId);
    const message = USER_MESSAGES.DELETED;
    response(res, { statusCode: 204, message });
  });

  handleLogoutUser = asyncWrapper(async (req, res) => {
    res.removeCookie("token");
    const message = USER_MESSAGES.LOGGED_OUT;
    response(res, { statusCode: 200, message });
  });
}

module.exports = new UserController();
