jest.setTimeout(15000);

const request = require("supertest");
const app = require("../../src/app");
const prisma = require("../../src/config/prisma");

describe("Auth Integration Tests", () => {
  // 🧹 Ensure clean DB before each test
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  // 🧹 Cleanup after all tests
  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  // =========================
  // REGISTER
  // =========================
  describe("POST /api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@test.com",
          password: "123456",
        });

      // FIX: correct status check
      expect([200, 201]).toContain(res.statusCode);

      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("john@test.com");
    });

    it("should fail if user already exists", async () => {
      // first create user
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@test.com",
          password: "123456",
        });

      // second attempt (should fail)
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@test.com",
          password: "123456",
        });

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  // =========================
  // LOGIN
  // =========================
  describe("POST /api/v1/auth/login", () => {
    it("should login user", async () => {
      // ensure user exists first
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@test.com",
          password: "123456",
        });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@test.com",
          password: "123456",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("should fail with wrong password", async () => {
      // ensure user exists first
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@test.com",
          password: "123456",
        });

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "john@test.com",
          password: "wrongpass",
        });

      // FIX: correct assertion
      expect([400, 401]).toContain(res.statusCode);
    });
  });
});