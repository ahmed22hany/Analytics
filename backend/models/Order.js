const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  productId: String,
  quantity: Number,
  price: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
