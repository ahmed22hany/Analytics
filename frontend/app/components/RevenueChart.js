"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
  transports: ["websocket"],
});

const RevenueChart = () => {
  const canvasRef = useRef(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAnalytics();

    socket.on("analyticsUpdate", (data) => {
      setTopProducts(data.topProducts);
      drawPieChart(data.topProducts);
    });

    return () => socket.off("analyticsUpdate");
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/analytics");
      setTopProducts(data.topProducts);
      drawPieChart(data.topProducts);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
    }
  };

  const drawPieChart = (products) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!products.length) {
      ctx.fillStyle = "red";
      ctx.fillText("No Data Available", 120, 130);
      return;
    }

    const totalSales = products.reduce(
      (sum, product) => sum + product.sales,
      0
    );
    let startAngle = 0;
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"];
    const centerX = 150;
    const centerY = 120;
    const radius = 100;

    products.forEach((product, index) => {
      const sliceAngle = (product.sales / totalSales) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      const percentage = ((product.sales / totalSales) * 100).toFixed(1) + "%";

      const middleAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(middleAngle) * (radius * 0.6);
      const labelY = centerY + Math.sin(middleAngle) * (radius * 0.6);

      ctx.fillStyle = "white"; 
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // ✅ Show product name on top
      ctx.fillText(product.name, labelX, labelY - 10);

      // ✅ Show percentage below product name
      ctx.fillText(percentage, labelX, labelY + 10);

      startAngle += sliceAngle;
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h3 className="text-xl font-semibold text-center">
        📊 Top-Selling Products
      </h3>
      <canvas
        ref={canvasRef}
        width="300"
        height="250"
        className="block mx-auto mt-4"
      ></canvas>
    </div>
  );
};

export default RevenueChart;
