require("dotenv").config({ path: "./.test.env" });
const http = require("http");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("../src/config/db")();

let server;
beforeAll(() => {
  server = http.createServer(app);
  server?.listen(3001);
});

afterAll(async () => {
  await mongoose.connection.close();
  server?.close();
});

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2OTVmM2QyMGU0MTBkMmUzNDM1MzAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjExNjM0NCwiZXhwIjoxNzQyOTgwMzQ0fQ.K7WktKUBUGv9hNw4BoY7eNBW_PBJ16jLXya4c-C6U6g`;
let taskId;

describe("Task Endpoints - /api/tasks", () => {
  describe("POST - Create Task - /api/tasks", () => {
    test("Create a new Task without logged in or invalid token and return status code 401", async () => {
      const task = {
        title: "Deploy a Web app",
        priority: "Medium",
      };
      const response = await request(app).post("/api/tasks").send(task);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Create a new Task with logged in and JWT but missing title and return status code 400 ", async () => {
      const task = {
        priority: "Medium",
      };
      const response = await request(app)
        .post("/api/tasks")
        .send(task)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Create a new Task with logged in and JWT, and return status code 201 ", async () => {
      const task = {
        title: "Frontend Web App",
        priority: "Medium",
      };
      const response = await request(app)
        .post("/api/tasks")
        .send(task)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("task");
      taskId = response.body.task.id;
    });
  });

  describe("GET - Tasks - /api/tasks", () => {
    test("Get Tasks without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get("/api/tasks");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get Tasks when logged in with correct JWT and return status code 200", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("tasks");
    });

    test("Get Tasks with query like title, description and return status code 200", async () => {
      const response = await request(app)
        .get("/api/tasks?title=Frontend")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("tasks");
    });
  });

  describe("GET - Task - /api/tasks/:taskId", () => {
    test("Get Task without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get(`/api/tasks/${taskId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Task with invalid task ID and return status code 404", async () => {
      const response = await request(app)
        .get(`/api/tasks/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Task with valid Task ID and return status code 200", async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("task");
    });
  });

  describe("PATCH - Task - /api/tasks/:taskId", () => {
    const updateTaskData = {
      description: "This frontend app to build using ReactJS",
    };
    test("Update Task without logged in or invalid token and return status code 401", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send(updateTaskData);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Task with invalid task ID and return status code 404", async () => {
      const response = await request(app)
        .patch(`/api/tasks/67d6977558f097c204d90467`)
        .send(updateTaskData)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Task with valid Task ID and return status code 200", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send(updateTaskData)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("task");
    });
  });

  describe("POST - Comment - /api/tasks/:taskId/comments", () => {
    const comment = { content: "This is very useful." };
    test("Do comment on task without logged in or JWT and return status code 401", async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/comments`)
        .send(comment);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Do comment on task, missing content and return status code 400", async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/comments`)
        .send({})
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Do comment on task and return status code 201", async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/comments`)
        .send(comment)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("comment");
    });
  });

  describe("GET - Comments - /api/tasks/:taskId/comments", () => {
    test("Get comments by task ID without logged in or JWT and return status code 401", async () => {
      const response = await request(app).get(`/api/tasks/${taskId}/comments`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get comments by Task ID and return status code 200", async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskId}/comments`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comments");
    });
  });

  describe("DELETE - Task - /api/tasks/:taskId", () => {
    test("Delete Task without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).delete(`/api/tasks/${taskId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Task with invalid task ID and return status code 404", async () => {
      const response = await request(app)
        .delete(`/api/tasks/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Task with valid Task ID and return status code 204", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
  });
});
