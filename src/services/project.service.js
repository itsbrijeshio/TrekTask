const Project = require("../models/project.model.js");
const { DBError } = require("../utils/index.js");
const { PROJECT_MESSAGES } = require("../constants/message.js");

class ProjectService {
  sanitize = (project) => {
    return {
      id: project._id,
      name: project.name,
      description: project.description,
      userId: project.userId,
    };
  };

  createProject = async (userId, { name, description }) => {
    const existingProject = await Project.findOne({ userId, name });
    if (existingProject) {
      throw new DBError(PROJECT_MESSAGES.CONFLICT_PROJECT(name));
    }

    const project = await Project.create({ name, description, userId });
    return this.sanitize(project);
  };

  getProject = async (projectId) => {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new DBError(PROJECT_MESSAGES.NOT_FOUND("ID", projectId));
    }
    return this.sanitize(project);
  };

  getAllProjects = async (userId, { query, page, limit }) => {
    const regex = new RegExp(query, "i");
    const where = { userId, $or: [] };
    if (query) {
      where.$or = [{ name: regex }, { description: regex }];
    }
    const offset = (page - 1) * limit;
    const projects = await Project.find(where).skip(offset).limit(limit);
    return projects.map((project) => this.sanitize(project));
  };

  updateProject = async (projectId, { name, description }) => {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { name, description },
      { new: true }
    );
    if (!project) {
      throw new DBError(PROJECT_MESSAGES.NOT_FOUND("ID", projectId));
    }
    return this.sanitize(project);
  };

  deleteProject = async (projectId) => {
    const isDeleted = await Project.findByIdAndDelete(projectId);
    if (!isDeleted) {
      throw new DBError(PROJECT_MESSAGES.NOT_FOUND("ID", projectId));
    }
    return !!isDeleted;
  };
}

module.exports =new ProjectService();
