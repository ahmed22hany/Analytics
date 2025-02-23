"use client";

import { useState } from "react";
import axios from "axios";

const OrderForm = () => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/orders", {
      productId,
      quantity,
      price,
    });
    setProductId("");
    setQuantity(1);
    setPrice("");
  };

  return (
    <form
      className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto text-white"
      onSubmit={handleSubmit}
    >
      {/* Product ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" htmlFor="product-id">
          Product ID:
        </label>
        <input
          id="product-id"
          type="text"
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Product ID"
          onChange={(e) => setProductId(e.target.value)}
        />
      </div>

      {/* Quantity & Price in a Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="quantity">
            Quantity:
          </label>
          <input
            id="quantity"
            type="number"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Quantity"
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">
            Price:
          </label>
          <input
            id="price"
            type="text"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Price"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
      >
        Add Order
      </button>
    </form>
  );
};

export default OrderForm;
