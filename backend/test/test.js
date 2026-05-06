const request = require("supertest");
const app = require("../app");

describe("Auth API tests", () => {
  it("should return 401 for invalid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "badpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid Email Address");
  });

  it("should return 200 for valid login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 200 for GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Backend is running 🚀");
  });
});
