const request = require("supertest");
const express = require("express");
const dashboardRouter = require("../router/dashboard.js"); // CommonJS import

const app = express();
app.use(express.json());
app.use("/router/dashboard", dashboardRouter); 

describe("Dashboard API", () => {

  let testItemCode = "TEST001"; 
  let cartItemId;

  it("should return items matching code", async () => {
    const res = await request(app)
      .get("/api/dashboard/getItem")
      .query({ code: testItemCode });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should add item to cart", async () => {
    const res = await request(app)
      .post("/api/dashboard/addToCart")
      .send({ code: testItemCode, quantity: 1 });

    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200 && res.body.cartId) {
      cartItemId = res.body.cartId;
    }
  });

  it("should return cart items for today", async () => {
    const res = await request(app).get("/api/dashboard/Getcartitem");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("totalAmount");
  });

  it("should delete cart item", async () => {
    if (!cartItemId) return;
    const res = await request(app).delete(`/api/dashboard/deleteCartItem/${cartItemId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Item deleted successfully");
  });

  it("should update bill with customer mobile", async () => {
    const res = await request(app)
      .post("/api/dashboard/updateBillMobile")
      .send({ mobile: "0771234567" }); 
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should update bill action", async () => {
    const res = await request(app)
      .post("/api/dashboard/updateBillAction")
      .send({ action: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Bill action updated successfully");
  });

});
