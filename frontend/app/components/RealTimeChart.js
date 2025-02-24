"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  transports: ["websocket"],
});

const RealTimeChart = () => {
  const canvasRef = useRef(null);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAnalytics();
    socket.on("analyticsUpdate", fetchAnalytics);
    return () => socket.off("analyticsUpdate");
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/analytics`
      );
      console.log("📊 Received Analytics Data:", data);
      setTopProducts(data.topProducts || []);
      drawChart(data.topProducts || []);
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
    }
  };

  const drawChart = (products) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = 50;
    const gap = 20;
    let animationStep = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      products.forEach((product, index) => {
        const barHeight = Math.max(
          product.sales * 2 * (animationStep / 20),
          10
        );
        ctx.fillStyle = "#4CAF50";
        ctx.fillRect(
          index * (barWidth + gap) + 10,
          200 - barHeight,
          barWidth,
          barHeight
        );
        ctx.fillStyle = "black";
        ctx.fillText(product.name, index * (barWidth + gap) + 15, 220);
      });

      if (animationStep < 20) {
        animationStep++;
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return (
    <canvas
      ref={canvasRef}
      width="400"
      height="250"
      style={{ border: "1px solid black" }}
    ></canvas>
  );
};

export default RealTimeChart;
