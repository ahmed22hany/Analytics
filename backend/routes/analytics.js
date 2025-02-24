const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

    if (!orders || orders.length === 0) {
      return res.json({
        totalRevenue: 0,
        topProducts: [],
        revenueTrends: {},
        recentOrders: 0,
      });
    }

    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentOrders = orders.filter(
      (order) => new Date(order.date) > oneMinuteAgo
    ).length;

    const revenueTrends = {};
    orders.forEach((order) => {
      const minute = new Date(order.date).toISOString().slice(0, 16);
      if (!revenueTrends[minute]) {
        revenueTrends[minute] = 0;
      }
      revenueTrends[minute] += order.price * order.quantity;
    });

    const productSales = {};
    orders.forEach((order) => {
      const productKey = order.productId.toString().trim();
      if (!productSales[productKey]) {
        productSales[productKey] = 0;
      }
      productSales[productKey] += order.quantity;
    });

    const topProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    res.json({ totalRevenue, topProducts, revenueTrends, recentOrders });
  } catch (err) {
    console.error("❌ Error in /analytics:", err.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
