import request from "supertest";
import app from "../../server.js";   // agar tera file server.js hai

describe("Server Test", () => {

  test("GET / should return API Working", async () => {

    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("API Working");

  });

});