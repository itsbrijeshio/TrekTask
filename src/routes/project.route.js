const { Router } = require("express");
const projectController = require("../controllers/project.controller.js");
const { validate, schema } = require("../validation/index.js");

const router = Router();
const { createProject, updateProject } = schema.projectSchema;
const idSchema = schema.idSchema;

router.post(
  "/",
  validate(createProject, "body"),
  projectController.handleCreateProject
);
router.get("/", projectController.handleGetAllProjects);
router.get(
  "/:projectId",
  validate(idSchema("projectId"), "params"),
  projectController.handleGetProject
);
router.patch(
  "/:projectId",
  validate(idSchema("projectId"), "params"),
  validate(updateProject, "body"),
  projectController.handleUpdateProject
);
router.delete(
  "/:projectId",
  validate(idSchema("projectId"), "params"),
  projectController.handleDeleteProject
);

module.exports = router;
