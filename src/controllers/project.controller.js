const asyncWrapper = require("../middlewares/asyncWrapper.middleware.js");
const projectService = require("../services/project.service.js");
const { response } = require("../utils/index.js");
const HTTP_STATUS_CODE = require("../constants/httpStatusCode.js");
const { PROJECT_MESSAGES } = require("../constants/message.js");

class ProjectController {
  constructor() {
    this.PAGE = 1;
    this.LIMIT = 30;
  }

  handleCreateProject = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { name, description } = req.body;
    const project = await projectService.createProject(userId, {
      name,
      description,
    });
    const message = PROJECT_MESSAGES.CREATED;
    response(res, { statusCode: HTTP_STATUS_CODE.CREATED, message, project });
  });

  handleGetProject = asyncWrapper(async (req, res) => {
    const { projectId } = req.params;
    const project = await projectService.getProject(projectId);
    response(res, { statusCode: HTTP_STATUS_CODE.OK, project });
  });

  handleGetAllProjects = asyncWrapper(async (req, res) => {
    const { userId } = req.auth;
    const { query = "", page = this.PAGE, limit = this.LIMIT } = req.query;
    const projects = await projectService.getAllProjects(userId, {
      query,
      page,
      limit,
    });
    response(res, { statusCode: HTTP_STATUS_CODE.OK, projects });
  });

  handleUpdateProject = asyncWrapper(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;
    const project = await projectService.updateProject(projectId, {
      name,
      description,
    });
    const message = PROJECT_MESSAGES.UPDATED;
    response(res, { statusCode: HTTP_STATUS_CODE.OK, message, project });
  });

  handleDeleteProject = asyncWrapper(async (req, res) => {
    const { projectId } = req.params;
    await projectService.deleteProject(projectId);
    const message = PROJECT_MESSAGES.DELETED;
    response(res, { statusCode: HTTP_STATUS_CODE.NO_CONTENT, message });
  });
}

module.exports = new ProjectController();
