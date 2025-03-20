const { Router } = require("express");
const commentController = require("../controllers/comment.controller.js");
const { validate, schema } = require("../validation/index.js");

const router = Router();
const idSchema = schema.idSchema;
const { contentSchema } = schema.commentSchema;

router.get("/", commentController.handleGetCommentByUser);
router.get(
  "/:commentId",
  validate(idSchema("commentId"), "params"),
  commentController.handleGetComment
);
router.patch(
  "/:commentId",
  validate(idSchema("commentId"), "params"),
  validate(contentSchema, "body"),
  commentController.handleUpdateComment
);
router.delete(
  "/:commentId",
  validate(idSchema("commentId"), "params"),
  commentController.handleDeleteComment
);

module.exports = router;
