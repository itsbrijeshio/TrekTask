const { Router } = require("express");
const userController = require("../controllers/user.controller.js");
const protect = require("../middlewares/protect.middleware.js");
const { validate, schema } = require("../validation/index.js");

const router = Router();
const { registerSchema, loginSchema, updateSchema } = schema.userSchema;

router.post(
  "/register",
  validate(registerSchema, "body"),
  userController.handleCreateUser
);
router.post(
  "/login",
  validate(loginSchema, "body"),
  userController.handleLoginUser
);
router.get("/me", protect, userController.handleGetUser);
router.patch(
  "/me",
  protect,
  validate(updateSchema, "body"),
  userController.handleUpdateUser
);
router.delete("/me", protect, userController.handleDeleteUser);
router.get("/logout", protect, userController.handleLogoutUser);

module.exports = router;
