require("dotenv").config({ path: "./.test.env" });
const http = require("http");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("../src/config/db")();

let server;
beforeAll(() => {
  server = http.createServer(app);
  server.listen(3000);
});

afterAll(async () => {
  await mongoose.connection.close();
  server?.close();
});

describe("User Endpoints - /api/users", () => {
  let dummyUserInfo = {};
  describe("POST - Registration - /api/users/register", () => {
    test("Register a new user with missing few required credentials and return status code 400", async () => {
      const user = {
        name: "Jane",
        email: "jane@gmail.com",
      };
      const response = await request(app)
        .post("/api/users/register")
        .send(user);
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Register a new user with proper fill the credentials and return status code 201", async () => {
      const user = {
        name: "Jane",
        email: "jane@gmail.com",
        password: "12345678",
      };
      const response = await request(app)
        .post("/api/users/register")
        .send(user);
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("user");
    });

    test("Re-Register with same credentials and return status code 409", async () => {
      const user = {
        name: "Jane",
        email: "jane@gmail.com",
        password: "12345678",
      };
      const response = await request(app)
        .post("/api/users/register")
        .send(user);
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("errorCode");
    });
  });

  describe("POST - Login - /api/users/login", () => {
    test("Login with invalid credentials and return status code 404", async () => {
      const user = {
        email: "jane@gmail.com",
        password: "password",
      };
      const response = await request(app).post("/api/users/login").send(user);
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Login with valid credentials and return status code 200", async () => {
      const user = {
        email: "jane@gmail.com",
        password: "12345678",
      };
      const response = await request(app).post("/api/users/login").send(user);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("token");
      dummyUserInfo.token = response.body.token;
    });
  });

  describe("GET - Profile - /api/users/me", () => {
    test("Access profile without login or invalid token and return status code 401", async () => {
      const response = await request(app).get("/api/users/me");
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Access Profile with JWT token and return status code 200", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Authentication", `Bearer ${dummyUserInfo.token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      dummyUserInfo.userId = response.body.user.id;
    });
  });

  describe("PATCH - Update Profile- /api/users/me", () => {
    test("Update name 'Jane' to 'Saim' with Invalid JWT and return status code 401", async () => {
      const response = await request(app)
        .patch("/api/users/me")
        .send({ name: "Saim" })
        .set("Authentication", `Bearer 123124124`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update name 'Jane' to 'Saim' with JWT and return status code 200", async () => {
      const response = await request(app)
        .patch("/api/users/me")
        .send({ name: "Saim" })
        .set("Authentication", `Bearer ${dummyUserInfo.token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
    });
  });

  describe("DELETE - Delete User - /api/users/me", () => {
    test("Delete user without token or invalid token and return status code 401", async () => {
      const response = await request(app)
        .delete("/api/users/me")
        .set("Authentication", `Bearer 123124124`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete user with Valid JWT token and return status code 204", async () => {
      const response = await request(app)
        .delete("/api/users/me")
        .set("Authentication", `Bearer ${dummyUserInfo.token}`);
      expect(response.status).toBe(204);
    });
  });
});
