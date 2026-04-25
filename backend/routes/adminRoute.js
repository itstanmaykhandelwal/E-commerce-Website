import express from "express";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, item) => acc + item.amount, 0);

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        totalUsers,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

export default router;