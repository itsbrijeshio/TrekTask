const asyncWrapper = require("../middlewares/asyncWrapper.middleware.js");
const commentService = require("../services/comment.service.js");
const { response } = require("../utils/index.js");
const { COMMENT_MESSAGES } = require("../constants/message.js");

class CommentController {
  constructor() {
    this.PAGE = 1;
    this.LIMIT = 30;
  }

  handleCreateComment = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { taskId } = req.params;
    const { content } = req.body;
    const comment = await commentService.createComment(userId, {
      taskId,
      content,
    });
    const message = COMMENT_MESSAGES.CREATED;
    response(res, { statusCode: 201, message, comment });
  });

  handleGetComment = asyncWrapper(async (req, res) => {
    const { commentId } = req.params;
    const comment = await commentService.getComment(commentId);
    response(res, { statusCode: 200, comment });
  });

  handleGetCommentByTask = asyncWrapper(async (req, res) => {
    const { taskId } = req.params;
    const { query = "", page = this.PAGE, limit = this.LIMIT } = req.query;
    const comments = await commentService.getCommentsByTask(taskId, {
      query,
      page,
      limit,
    });
    response(res, { statusCode: 200, comments });
  });

  handleGetCommentByUser = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { query = "", page = this.PAGE, limit = this.LIMIT } = req.query;
    const comments = await commentService.getCommentsByUser(userId, {
      query,
      page,
      limit,
    });
    response(res, { statusCode: 200, comments });
  });

  handleUpdateComment = asyncWrapper(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await commentService.updateComment(commentId, { content });
    const message = COMMENT_MESSAGES.UPDATED;
    response(res, { statusCode: 200, message, comment });
  });

  handleDeleteComment = asyncWrapper(async (req, res) => {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    const message = COMMENT_MESSAGES.DELETED;
    response(res, { statusCode: 204, message });
  });
}

module.exports = new CommentController();
