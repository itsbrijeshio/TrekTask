require("dotenv").config({ path: "./.test.env" });
const http = require("http");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("../src/config/db")();

let server;
beforeAll(() => {
  server = http.createServer(app);
  server?.listen(3002);
});

afterAll(async () => {
  await mongoose.connection.close();
  server?.close();
});

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2OTVmM2QyMGU0MTBkMmUzNDM1MzAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjExNjM0NCwiZXhwIjoxNzQyOTgwMzQ0fQ.K7WktKUBUGv9hNw4BoY7eNBW_PBJ16jLXya4c-C6U6g`;
let projectId;

describe("Projects Endpoints - /api/projects", () => {
  describe("POST - Create Project - /api/projects", () => {
    test("Create a new Project without logged in or invalid token and return status code 401", async () => {
      const project = { name: "Personal" };
      const response = await request(app).post("/api/projects").send(project);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Create a new Project with logged in and JWT but missing name and return status code 400 ", async () => {
      const project = {};
      const response = await request(app)
        .post("/api/projects")
        .send(project)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Create a new Project with logged in and JWT, and return status code 201 ", async () => {
      const project = { name: "Personal" };
      const response = await request(app)
        .post("/api/projects")
        .send(project)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("project");
      projectId = response.body.project.id;
    });
  });

  describe("GET - Projects - /api/projects", () => {
    test("Get Projects without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get("/api/projects");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get Projects when logged in with correct JWT and return status code 200", async () => {
      const response = await request(app)
        .get("/api/projects")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("projects");
    });

    test("Get Projects with query like name, description and return status code 200", async () => {
      const response = await request(app)
        .get("/api/projects?name=Personal")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("projects");
    });
  });

  describe("GET - Project - /api/projects/:projectId", () => {
    test("Get Project without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get(`/api/projects/${projectId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Project with invalid Project ID and return status code 404", async () => {
      const response = await request(app)
        .get(`/api/projects/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Project with valid Project Id and return status code 200", async () => {
      const response = await request(app)
        .get(`/api/projects/${projectId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("project");
    });
  });

  describe("PATCH - Project - /api/projects/:projectId", () => {
    const updateProjectName = { name: "Personal Project" };
    test("Update Project without logged in or invalid token and return status code 401", async () => {
      const response = await request(app)
        .patch(`/api/projects/${projectId}`)
        .send(updateProjectName);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Project with invalid Project ID and return status code 404", async () => {
      const response = await request(app)
        .patch(`/api/projects/67d6977558f097c204d90467`)
        .send(updateProjectName)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Project with valid Project ID and return status code 200", async () => {
      const response = await request(app)
        .patch(`/api/projects/${projectId}`)
        .send(updateProjectName)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("project");
    });
  });

  describe("DELETE - Project - /api/projects/:projectId", () => {
    test("Delete Project without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).delete(`/api/projects/${projectId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Project with invalid Project ID and return status code 404", async () => {
      const response = await request(app)
        .delete(`/api/projects/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Project with valid Project ID and return status code 204", async () => {
      const response = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
  });
});
