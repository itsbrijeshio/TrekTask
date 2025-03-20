require("dotenv").config({ path: "./.test.env" });
const http = require("http");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app");
require("../src/config/db")();

let server;
beforeAll(() => {
  server = http.createServer(app);
  server?.listen(3003);
});

afterAll(async () => {
  await mongoose.connection.close();
  server?.close();
});

const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Q2OTVmM2QyMGU0MTBkMmUzNDM1MzAiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0MjExNjM0NCwiZXhwIjoxNzQyOTgwMzQ0fQ.K7WktKUBUGv9hNw4BoY7eNBW_PBJ16jLXya4c-C6U6g`;
let commentId;

describe("Comments Endpoints - /api/comments", () => {
  describe("GET - Comments - /api/comments", () => {
    test("Get Comments without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get("/api/comments");
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get Comments when logged in with correct JWT and return status code 200", async () => {
      const response = await request(app)
        .get("/api/comments")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comments");
      commentId = response.body.comments[0].id;
    });

    test("Get Comments with query content and return status code 200", async () => {
      const response = await request(app)
        .get("/api/comments?name=Personal")
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comments");
    });
  });

  describe("GET - Comment - /api/comments/:commentId", () => {
    test("Get Comment without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).get(`/api/comments/${commentId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Comment with invalid Comment ID and return status code 404", async () => {
      const response = await request(app)
        .get(`/api/comments/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Get a Comment with valid Comment Id and return status code 200", async () => {
      const response = await request(app)
        .get(`/api/comments/${commentId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comment");
    });
  });

  describe("PATCH - Comment - /api/comments/:commentId", () => {
    const updateCommentContent = { content: "I like this  web app." };
    test("Update Comment without logged in or invalid token and return status code 401", async () => {
      const response = await request(app)
        .patch(`/api/comments/${commentId}`)
        .send(updateCommentContent);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Comment with invalid Comment ID and return status code 404", async () => {
      const response = await request(app)
        .patch(`/api/comments/67d6977558f097c204d90467`)
        .send(updateCommentContent)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Update Comment with valid Comment ID and return status code 200", async () => {
      const response = await request(app)
        .patch(`/api/comments/${commentId}`)
        .send(updateCommentContent)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("comment");
    });
  });

  describe("DELETE - Comment - /api/comments/:commentId", () => {
    test("Delete Comment without logged in or invalid token and return status code 401", async () => {
      const response = await request(app).delete(`/api/comments/${commentId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Comment with invalid Comment ID and return status code 404", async () => {
      const response = await request(app)
        .delete(`/api/comments/67d6977558f097c204d90467`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("errorCode");
    });

    test("Delete Comment with valid Comment ID and return status code 204", async () => {
      const response = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set("Authentication", `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
  });
});
