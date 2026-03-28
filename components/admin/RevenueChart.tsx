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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface StatsData {
  totalBookings: number;
  totalRooms: number;
  activeGuests: number;
  revenue: string;
  occupancyRate: string;
  monthlyRoomData: Array<{
    _id: { year: number; month: number };
    total: number;
  }>;
  monthlyFoodData: Array<{
    _id: { year: number; month: number };
    total: number;
  }>;
  monthlyTourData: Array<{
    _id: { year: number; month: number };
    total: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        <p className="text-amber-400 text-sm font-semibold">
          ${payload[0].value?.toLocaleString()}
        </p>
        {payload[1] && (
          <p className="text-slate-500 text-xs">
            Last Year: ${payload[1].value?.toLocaleString()}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const [chartData, setChartData] = useState<
    Array<{ month: string; revenue: number; lastYear: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();

        if (data.success && data.stats) {
          const stats: StatsData = data.stats;

          // Combine room, food, and tour revenue by month
          const monthlyRevenue: Record<number, number> = {};

          // Add room revenue
          stats.monthlyRoomData.forEach((item) => {
            const month = item._id.month;
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + item.total;
          });

          // Add food revenue
          stats.monthlyFoodData.forEach((item) => {
            const month = item._id.month;
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + item.total;
          });

          // Add tour revenue
          stats.monthlyTourData.forEach((item) => {
            const month = item._id.month;
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + item.total;
          });

          // Transform to chart format with both current and last year data
          const currentYear = new Date().getFullYear();
          const lastYear = currentYear - 1;

          // Filter data for current year and last year
          const currentYearData = stats.monthlyRoomData.filter(
            (item) => item._id.year === currentYear,
          );
          const lastYearData = stats.monthlyRoomData.filter(
            (item) => item._id.year === lastYear,
          );

          // Create lookup maps
          const currentYearMap: Record<number, number> = {};
          const lastYearMap: Record<number, number> = {};

          currentYearData.forEach((item) => {
            currentYearMap[item._id.month] = item.total;
          });

          lastYearData.forEach((item) => {
            lastYearMap[item._id.month] = item.total;
          });

          // Build chart data for all 12 months
          const formattedData = monthNames.map((monthName, index) => {
            const monthNum = index + 1;
            const currentRevenue = currentYearMap[monthNum] || 0;
            const lastRevenue = lastYearMap[monthNum] || 0;
            return {
              month: monthName,
              revenue: currentRevenue,
              lastYear: lastRevenue,
            };
          });

          setChartData(formattedData);
        } else {
          // Fallback to placeholder data
          setChartData(
            monthNames.map((month) => ({
              month,
              revenue: 0,
              lastYear: 0,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to placeholder data
        setChartData(
          monthNames.map((month) => ({
            month,
            revenue: 0,
            lastYear: 0,
          })),
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
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-400 mt-1">
            Monthly revenue performance
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
              tickFormatter={(v) => `$${v / 1000}k`}
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
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
