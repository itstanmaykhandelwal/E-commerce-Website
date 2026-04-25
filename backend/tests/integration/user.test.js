import request from "supertest";
import { jest } from "@jest/globals";

// mock user controller
jest.unstable_mockModule("../../controllers/userController.js", () => ({
  loginUser: (req, res) => {
    const { email, password } = req.body;

    if (email === "test@example.com" && password === "123456") {
      return res.json({
        success: true,
        token: "fake-jwt-token"
      });
    }

    res.json({
      success: false,
      message: "Invalid credentials"
    });
  },

  registerUser: jest.fn(),
  adminLogin: jest.fn(),
  profileUser: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn()
}));

// import server AFTER mock
const { default: app } = await import("../../server.js");

describe("User API", () => {

  test("POST /api/user/login should login user", async () => {

    const res = await request(app)
      .post("/api/user/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();

  });

});