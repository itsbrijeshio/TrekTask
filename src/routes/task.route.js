const { Router } = require("express");
const taskController = require("../controllers/task.controller.js");
const commentController = require("../controllers/comment.controller.js");
const { validate, schema } = require("../validation/index.js");

const router = Router();
const { createTaskSchema, updateTaskSchema } = schema.taskSchema;
const { createSchema: createCommentSchema } = schema.commentSchema;
const idSchema = schema.idSchema;

router.post(
  "/",
  validate(createTaskSchema, "body"),
  taskController.handleCreateTask
);
router.get(
  "/:taskId",
  validate(idSchema("taskId"), "params"),
  taskController.handleGetTask
);
router.get("/", taskController.handleGetAllTasks);
router.patch(
  "/:taskId",
  validate(idSchema("taskId"), "params"),
  validate(updateTaskSchema, "body"),
  taskController.handleUpdateTask
);
router.delete(
  "/:taskId",
  validate(idSchema("taskId"), "params"),
  taskController.handleDeleteTask
);
router.post(
  "/:taskId/comments",
  validate(idSchema("taskId"), "params"),
  validate(createCommentSchema, "body"),
  commentController.handleCreateComment
);
router.get(
  "/:taskId/comments",
  validate(idSchema("taskId"), "params"),
  commentController.handleGetCommentByTask
);

module.exports =router;
