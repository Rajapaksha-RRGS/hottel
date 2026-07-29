'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface OccupancyItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

const defaultData: OccupancyItem[] = [
  { name: 'Occupied', value: 0, count: 0, color: '#f59e0b' },
  { name: 'Reserved', value: 0, count: 0, color: '#d97706' },
  { name: 'Available', value: 100, count: 0, color: '#1e293b' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium">{payload[0].name}</p>
        <p className="text-amber-400 text-sm font-semibold">{payload[0].value}% ({payload[0].payload.count || 0} rooms)</p>
      </div>
    );
  }
  return null;
};

export default function OccupancyChart() {
  const [data, setData] = useState<OccupancyItem[]>(defaultData);
  const [occupancyRate, setOccupancyRate] = useState<string>('0%');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();

        if (json.success && json.stats) {
          if (json.stats.occupancyBreakdown && json.stats.occupancyBreakdown.length > 0) {
            setData(json.stats.occupancyBreakdown);
          }
          if (json.stats.occupancyRate) {
            setOccupancyRate(json.stats.occupancyRate);
          }
        }
      } catch (err) {
        console.error('Error fetching occupancy chart data:', err);
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
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Occupancy Overview</h3>
        <p className="text-sm text-slate-400 mt-1">Live room allocation status</p>
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
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-white">{occupancyRate}</span>
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

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-2xl backdrop-blur-xs">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
