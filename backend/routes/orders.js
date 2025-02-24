const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/", async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;
    const order = new Order({ productId, quantity, price, date: new Date() });
    await order.save();

    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentOrders = orders.filter(
      (order) => new Date(order.date) > oneMinuteAgo
    ).length;

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

   
    global.io.emit("newOrder", order); 
    global.io.emit("analyticsUpdate", {
      totalRevenue,
      topProducts,
      recentOrders,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("❌ Error adding order:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }); 
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
