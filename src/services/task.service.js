const Task = require("../models/task.model.js");
const { DBError } = require("../utils/index.js");
const { TASK_MESSAGES } = require("../constants/message.js");

class TaskService {
  sanitize(task) {
    return {
      id: task._id,
      title: task.title,
      description: task?.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      projectId: task?.projectId,
    };
  }

  async createTask(taskData) {
    const task = await Task.create(taskData);
    return this.sanitize(task);
  }

  async getTask(taskId) {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new DBError(TASK_MESSAGES.NOT_FOUND("ID", taskId));
    }
    return this.sanitize(task);
  }

  async getAllTasks(userId, { query, page, limit }) {
    const where = { userId, $or: [] };
    const regex = new RegExp(query, "i");
    if (query) {
      where.$or = [{ title: regex }, { description: regex }];
    }
    const skip = (page - 1) * limit;
    const tasks = await Task.find(where).skip(skip).limit(limit);
    return tasks.map((task) => this.sanitize(task));
  }

  async updateTask(taskId, taskData) {
    const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
    if (!task) {
      throw new DBError(TASK_MESSAGES.NOT_FOUND("ID", taskId));
    }

    return this.sanitize(task);
  }

  async deleteTask(taskId) {
    const isDeleted = await Task.findByIdAndDelete(taskId);
    if (!isDeleted) {
      throw new DBError(TASK_MESSAGES.NOT_FOUND("ID", taskId));
    }
    return !!isDeleted;
  }
}

module.exports =new TaskService();
