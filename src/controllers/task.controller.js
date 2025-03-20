const asyncWrapper = require("../middlewares/asyncWrapper.middleware.js");
const taskService = require("../services/task.service.js");
const { response } = require("../utils/index.js");
const { TASK_MESSAGES } = require("../constants/message.js");

class TaskController {
  constructor() {
    this.PAGE = 1;
    this.LIMIT = 30;
  }

  handleCreateTask = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { title, description, dueDate, priority, status, projectId } =
      req.body;
    const task = await taskService.createTask({
      userId,
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
    });
    const message = TASK_MESSAGES.CREATED;
    response(res, { statusCode: 201, message, task });
  });

  handleGetTask = asyncWrapper(async (req, res) => {
    const { taskId } = req.params;
    const task = await taskService.getTask(taskId);
    response(res, { statusCode: 200, task });
  });

  handleGetAllTasks = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { query, page = this.PAGE, limit = this.LIMIT } = req.query;
    const tasks = await taskService.getAllTasks(userId, { query, page, limit });
    response(res, { statusCode: 200, tasks });
  });

  handleUpdateTask = asyncWrapper(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, dueDate, priority, status, projectId } =
      req.body;
    const task = await taskService.updateTask(taskId, {
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
    });
    const message = TASK_MESSAGES.UPDATED;
    response(res, { statusCode: 200, message, task });
  });

  handleDeleteTask = asyncWrapper(async (req, res) => {
    const { taskId } = req.params;
    await taskService.deleteTask(taskId);
    const message = TASK_MESSAGES.DELETED;
    response(res, { statusCode: 204, message });
  });
}

module.exports = new TaskController();
