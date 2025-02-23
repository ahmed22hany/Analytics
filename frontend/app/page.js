"use client";

import React, { useState } from "react";

import OrderForm from "../app/components/OrderForm";
import SalesAnalytics from "../app/components/SalesAnalytics";
import LiveOrders from "../app/components/LiveOrders";
import RevenueChart from "../app/components/RevenueChart";
import DownloadReport from "../app/components/DownloadReport";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`transition-all duration-500 ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="container mx-auto p-6">
        {/* Dark Mode Toggle */}
        <button
          className="px-4 py-2 rounded-lg bg-blue-500 text-white transition-transform transform hover:scale-110"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 className="text-3xl font-bold mt-4 transition-opacity duration-500">
          📊 Real-Time Sales Dashboard
        </h1>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300">
            <OrderForm />
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300">
            <SalesAnalytics />
          </div>

          <div className="p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300">
            <DownloadReport />
          </div>
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300">
          <RevenueChart />
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300">
          <LiveOrders />
        </div>
      </div>
    </div>
  );
}
