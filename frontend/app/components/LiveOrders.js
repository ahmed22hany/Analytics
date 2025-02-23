"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ["websocket"],
});

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders(); // Fetch existing orders on load

    // ✅ Listen for new orders in real-time
    socket.on("newOrder", (order) => {
      console.log("🆕 New order received:", order);
      setOrders((prevOrders) => [order, ...prevOrders]); // ✅ Add new order instantly
    });

    return () => {
      socket.off("newOrder"); // Cleanup listener to prevent duplicate events
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/orders");
      setOrders(data.reverse()); // Show latest orders first
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold">📦 Live Orders</h3>
      <ul className="mt-4 space-y-2">
        {orders.map((order, index) => (
          <li
            key={index}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md animate-slide-in"
          >
            {order.productId} - {order.quantity} pcs - ${order.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveOrders;
