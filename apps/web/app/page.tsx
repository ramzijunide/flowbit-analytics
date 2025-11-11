"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import FileTrendChart from "@/components/charts/FileTrendChart";
import ProcessedChart from "@/components/charts/ProcessedChart";


export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/stats`);
        const filesRes = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/files`);

        setStats(statsRes.data);
        setFiles(filesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

 return (
  <main className="p-8 bg-gray-100 min-h-screen text-gray-900">
    <h1 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-2">
      <span role="img" aria-label="chart">📊</span>
      Flowbit Analytics Dashboard
    </h1>

    {/* Stats Cards */}
    {stats && (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Total, Processed, Size Cards */}
      </div>
    )}

    {/* 📊 Charts Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <FileTrendChart data={files} />
      <ProcessedChart data={files} />
    </div>

    {/* 📋 Data Table */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        {/* Table content */}
      </table>
    </div>
  </main>
);


}

