"use client";

import React from "react";
import { RiFileExcel2Fill } from "react-icons/ri";

const DownloadReport = () => {
  const handleDownload = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL}/report/export`, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded flex items-center space-x-2 gap-2"
    >
      <RiFileExcel2Fill color="green" />
      Download Sales Report
    </button>
  );
};

export default DownloadReport;
