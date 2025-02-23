const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const ExcelJS = require("exceljs");

router.get("/export", async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    // ✅ Define columns
    worksheet.columns = [
      { header: "Order ID", key: "_id", width: 30 },
      { header: "Product", key: "productId", width: 20 },
      { header: "Quantity", key: "quantity", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Total", key: "total", width: 15 },
      { header: "Date", key: "date", width: 25 },
    ];

    // ✅ Add rows
    orders.forEach((order) => {
      worksheet.addRow({
        _id: order._id,
        productId: order.productId,
        quantity: order.quantity,
        price: order.price,
        total: order.quantity * order.price,
        date: order.date,
      });
    });

    // ✅ Send Excel file to client
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Sales_Report.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("❌ Error generating Excel report:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
