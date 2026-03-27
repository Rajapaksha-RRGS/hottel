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

const data = [
  { month: 'Jan', revenue: 32000, lastYear: 28000 },
  { month: 'Feb', revenue: 38000, lastYear: 30000 },
  { month: 'Mar', revenue: 42000, lastYear: 35000 },
  { month: 'Apr', revenue: 35000, lastYear: 32000 },
  { month: 'May', revenue: 48000, lastYear: 38000 },
  { month: 'Jun', revenue: 52000, lastYear: 42000 },
  { month: 'Jul', revenue: 58000, lastYear: 45000 },
  { month: 'Aug', revenue: 55000, lastYear: 48000 },
  { month: 'Sep', revenue: 62000, lastYear: 50000 },
  { month: 'Oct', revenue: 68000, lastYear: 55000 },
  { month: 'Nov', revenue: 72000, lastYear: 58000 },
  { month: 'Dec', revenue: 78000, lastYear: 62000 },
];

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
          <p className="text-sm text-slate-400 mt-1">Monthly revenue performance</p>
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
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
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
              activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
