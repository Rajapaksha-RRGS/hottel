'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface ChartDataItem {
  month: string;
  revenue: number;
  lastYear: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        <p className="text-amber-400 text-sm font-semibold">
          This Year: ${payload[0].value?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        {payload[1] && (
          <p className="text-slate-400 text-xs mt-1">
            Last Year: ${payload[1].value?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (data.success && data.stats) {
          if (Array.isArray(data.stats.monthlyChartData) && data.stats.monthlyChartData.length > 0) {
            setChartData(data.stats.monthlyChartData);
          } else {
            // Fallback initialization
            setChartData(
              monthNames.map((month) => ({
                month,
                revenue: 0,
                lastYear: 0,
              }))
            );
          }
        } else {
          setChartData(
            monthNames.map((month) => ({
              month,
              revenue: 0,
              lastYear: 0,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching stats for RevenueChart:", error);
        setChartData(
          monthNames.map((month) => ({
            month,
            revenue: 0,
            lastYear: 0,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-400 mt-1">
            Monthly combined revenue performance (Room, Food & Tours)
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-400">This Year</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="text-slate-400">Last Year</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="lastYear"
              stroke="#334155"
              strokeWidth={2}
              fill="transparent"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#amberGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#f59e0b",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-2xl backdrop-blur-xs">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
