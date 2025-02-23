"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
  transports: ["websocket"],
});

const NewOrders = () => {
  const [recentOrders, setRecentOrders] = useState(0);

  useEffect(() => {
    fetchAnalytics();

    socket.on("analyticsUpdate", (data) => {
      console.log("🔄 Real-time update received for recent orders:", data);
      setRecentOrders(data.recentOrders);
    });

    return () => socket.off("analyticsUpdate");
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/analytics");
      setRecentOrders(data.recentOrders || 0);
    } catch (error) {
      console.error("❌ Error fetching recent orders:", error);
    }
  };

  return (
    <div>
      <h3>New Orders in the Last Minute: {recentOrders}</h3>
    </div>
  );
};

export default NewOrders;
