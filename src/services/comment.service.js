const Comment =require("../models/comment.model.js");
const { DBError } =require("../utils/index.js");
const { COMMENT_MESSAGES } =require("../constants/message.js");

class CommentService {
  sanitize = (comment) => {
    return {
      id: comment?._id,
      content: comment?.content,
      taskId: comment?.taskId,
      userId: comment?.userId,
    };
  };

  createComment = async (userId, { content, taskId }) => {
    const comment = await Comment.create({ userId, content, taskId });
    return this.sanitize(comment);
  };

  getComment = async (commentId) => {
    const comment = await Comment.findById(commentId).populate(
      "userId",
      "name"
    );
    if (!comment) {
      throw new DBError(COMMENT_MESSAGES.NOT_FOUND("ID", commentId));
    }
    return this.sanitize(comment);
  };

  getCommentsByTask = async (taskId, { query, page, limit }) => {
    const regex = new RegExp(query, "i");
    const where = { taskId, $or: [] };
    if (query) {
      where.$or.push({ content: regex });
    }
    const skip = (page - 1) * limit;
    const comments = await Comment.find(where)
      .populate("userId", "name")
      .skip(skip)
      .limit(limit);
    return comments.map((comment) => this.sanitize(comment));
  };

  getCommentsByUser = async (userId, { query, page, limit }) => {
    const regex = new RegExp(query, "i");
    const where = { userId, $or: [] };
    if (query) {
      where.$or.push({ content: regex });
    }
    const skip = (page - 1) * limit;
    const comments = await Comment.find(where).skip(skip).limit(limit);

    return comments.map((comment) => this.sanitize(comment));
  };

  updateComment = async (commentId, { content }) => {
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    if (!comment) {
      throw new DBError(COMMENT_MESSAGES.NOT_FOUND("ID", commentId));
    }

    return this.sanitize(comment);
  };

  deleteComment = async (commentId) => {
    const isDeleted = await Comment.findByIdAndDelete(commentId);
    if (!isDeleted) {
      throw new DBError(COMMENT_MESSAGES.NOT_FOUND("ID", commentId));
    }

    return this.sanitize(isDeleted);
  };
}

module.exports =new CommentService();
