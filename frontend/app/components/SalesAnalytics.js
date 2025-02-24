"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
  transports: ["websocket"],
});

const SalesAnalytics = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAnalytics();

    socket.on("analyticsUpdate", (data) => {
      setTotalSales(data.totalRevenue);
      setTopProducts(data.topProducts);
    });

    return () => socket.off("analyticsUpdate");
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics`
      );
      setTotalSales(data.totalRevenue);
      setTopProducts(data.topProducts);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">📈 Total Sales: ${totalSales}</h2>
      <h3 className="text-lg mt-4 font-medium">🏆 Top 2 Selling Products</h3>
      <ul className="mt-2 space-y-2">
        {topProducts.slice(0, 2).map((p, i) => (
          <li
            key={i}
            className="text-lg p-2 bg-gray-100 dark:bg-gray-700 rounded-md mt-2 animate-fade-in"
          >
            {p.name} - {p.sales} sales
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesAnalytics;
