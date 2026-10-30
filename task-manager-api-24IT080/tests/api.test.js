const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager-test";

let authToken = "";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_URI);
  }

  // Create or login test user to get JWT token
  const testEmail = `citest_${Date.now()}@example.com`;
  const password = "password123";

  await request(app).post("/register").send({ email: testEmail, password });

  const loginRes = await request(app)
    .post("/login")
    .send({ email: testEmail, password });

  authToken = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Task Management API & Authentication Tests", () => {
  test("GET /tasks without authorization header returns 401", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  test("GET /tasks with valid token returns 200 array", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /tasks creates a new task and returns 201", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Automated CI Test Task",
        description: "Created during CI/CD test run",
        priority: "high",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Automated CI Test Task");
  });

  test("POST /tasks without title returns 400 validation error", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        description: "Missing title",
      });

    expect(res.statusCode).toBe(400);
  });

  test("POST /api/ai/generate-description generates suggestion with graceful degradation", async () => {
    const res = await request(app)
      .post("/api/ai/generate-description")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Fix database connection timeout bug",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("description");
    expect(typeof res.body.description).toBe("string");
    expect(res.body.description.length).toBeGreaterThan(0);
  });
});
