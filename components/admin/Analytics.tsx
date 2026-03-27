'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, BedDouble, DollarSign, Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', bookings: 320, revenue: 32000, occupancy: 72 },
  { month: 'Feb', bookings: 380, revenue: 38000, occupancy: 78 },
  { month: 'Mar', bookings: 420, revenue: 42000, occupancy: 82 },
  { month: 'Apr', bookings: 350, revenue: 35000, occupancy: 75 },
  { month: 'May', bookings: 480, revenue: 48000, occupancy: 85 },
  { month: 'Jun', bookings: 520, revenue: 52000, occupancy: 88 },
  { month: 'Jul', bookings: 580, revenue: 58000, occupancy: 92 },
  { month: 'Aug', bookings: 550, revenue: 55000, occupancy: 89 },
  { month: 'Sep', bookings: 620, revenue: 62000, occupancy: 90 },
  { month: 'Oct', bookings: 680, revenue: 68000, occupancy: 91 },
  { month: 'Nov', bookings: 720, revenue: 72000, occupancy: 87 },
  { month: 'Dec', bookings: 780, revenue: 78000, occupancy: 94 },
];

const roomTypeData = [
  { name: 'Standard', value: 35, color: '#f59e0b' },
  { name: 'Deluxe', value: 30, color: '#d97706' },
  { name: 'Suite', value: 22, color: '#b45309' },
  { name: 'Penthouse', value: 13, color: '#92400e' },
];

const kpis = [
  { title: 'Avg. Daily Rate', value: '$245', change: '+8.3%', up: true, icon: DollarSign },
  { title: 'RevPAR', value: '$214', change: '+12.1%', up: true, icon: TrendingUp },
  { title: 'Avg. Stay Duration', value: '3.2 nights', change: '-0.3', up: false, icon: Calendar },
  { title: 'Guest Satisfaction', value: '4.7/5', change: '+0.2', up: true, icon: Users },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-amber-400 text-sm font-semibold">
            {entry.name}: {typeof entry.value === 'number' && entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Comprehensive performance insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800/60"><Icon className="w-4 h-4 text-slate-400" /></div>
                <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Bookings Trend</h3>
          <p className="text-sm text-slate-400 mb-6">Monthly booking volume</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bookings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Room Type Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-1">Room Type Distribution</h3>
          <p className="text-sm text-slate-400 mb-6">Booking share by room type</p>
          <div className="flex items-center gap-6">
            <div className="h-[220px] w-[220px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roomTypeData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {roomTypeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {roomTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Occupancy Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-1">Occupancy Rate Trend</h3>
        <p className="text-sm text-slate-400 mb-6">Monthly occupancy percentage</p>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="occGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="occupancy" stroke="#f59e0b" strokeWidth={2.5} fill="url(#occGradient)" dot={false} activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
