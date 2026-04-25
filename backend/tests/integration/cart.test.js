import request from "supertest";
import { jest } from "@jest/globals";

// controller mock
jest.unstable_mockModule("../../controllers/cartController.js", () => ({
  addToCart: (req, res) => {
    res.json({
      success: true,
      message: "Item added to cart"
    });
  },

  getUserCart: jest.fn(),
  updateCart: jest.fn()
}));

// auth middleware mock
jest.unstable_mockModule("../../middleware/auth.js", () => ({
  default: (req, res, next) => {
    req.userId = "testUser"; // fake user
    next();
  }
}));

// server import AFTER mocks
const { default: app } = await import("../../server.js");

describe("Cart API", () => {

  test("POST /api/cart/add should add item to cart", async () => {

    const res = await request(app)
      .post("/api/cart/add")
      .send({
        itemId: "123",
        size: "M"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

  });

});