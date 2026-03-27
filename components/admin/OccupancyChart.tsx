'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Occupied', value: 87.4, color: '#f59e0b' },
  { name: 'Reserved', value: 6.2, color: '#d97706' },
  { name: 'Available', value: 6.4, color: '#1e293b' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium">{payload[0].name}</p>
        <p className="text-amber-400 text-sm font-semibold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function OccupancyChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Occupancy Overview</h3>
        <p className="text-sm text-slate-400 mt-1">Current room allocation status</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[250px] w-[250px] relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">87.4%</span>
            <span className="text-xs text-slate-400">Occupied</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {data.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
