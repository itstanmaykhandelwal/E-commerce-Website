import request from "supertest";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../../controllers/productController.js", () => ({
  listProducts: (req, res) => {
    res.json({
      success: true,
      products: [{ name: "Test Product", price: 100 }]
    });
  },

  addProduct: jest.fn(),
  removeProduct: jest.fn(),
  singleProduct: jest.fn()
}));

const { default: app } = await import("../../server.js");

describe("Product API", () => {

  test("GET /api/product/list should return product list", async () => {

    const res = await request(app).get("/api/product/list");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);

  });

});