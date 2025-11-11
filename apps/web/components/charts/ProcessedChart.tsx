"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function ProcessedChart({ data }: { data: any[] }) {
  const processed = data.filter((f) => f.status === "processed").length;
  const unprocessed = data.length - processed;

  const chartData = [
    { name: "Processed", value: processed },
    { name: "Unprocessed", value: unprocessed },
  ];

  const COLORS = ["#16a34a", "#f43f5e"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        🥧 File Status Breakdown
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
