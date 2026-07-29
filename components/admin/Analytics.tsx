'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface MonthlyAnalyticsItem {
  month: string;
  bookings: number;
  revenue: number;
  occupancy: number;
}

interface RoomTypeItem {
  name: string;
  value: number;
  count: number;
  color: string;
}

interface KPIItem {
  title: string;
  value: string;
  change: string;
  up: boolean;
  icon: any;
}

const defaultMonthlyData: MonthlyAnalyticsItem[] = [
  { month: 'Jan', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Feb', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Mar', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Apr', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'May', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Jun', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Jul', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Aug', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Sep', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Oct', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Nov', bookings: 0, revenue: 0, occupancy: 0 },
  { month: 'Dec', bookings: 0, revenue: 0, occupancy: 0 },
];

const defaultRoomTypes: RoomTypeItem[] = [
  { name: 'Standard', value: 40, count: 0, color: '#f59e0b' },
  { name: 'Deluxe', value: 30, count: 0, color: '#3b82f6' },
  { name: 'Beach-Cabana', value: 20, count: 0, color: '#10b981' },
  { name: 'Family-Suite', value: 10, count: 0, color: '#8b5cf6' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-300 text-xs font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-amber-400 text-sm font-semibold">
            {entry.name}: {typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue') ? `$${entry.value.toLocaleString()}` : entry.value}
            {entry.name.toLowerCase().includes('occupancy') ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState<MonthlyAnalyticsItem[]>(defaultMonthlyData);
  const [roomTypeData, setRoomTypeData] = useState<RoomTypeItem[]>(defaultRoomTypes);
  const [kpis, setKpis] = useState<KPIItem[]>([
    { title: 'Avg. Daily Rate (ADR)', value: '$0.00', change: '+5.2%', up: true, icon: DollarSign },
    { title: 'RevPAR', value: '$0.00', change: '+8.1%', up: true, icon: TrendingUp },
    { title: 'Avg. Stay Duration', value: '0 nights', change: '+0.4', up: true, icon: Calendar },
    { title: 'Guest Satisfaction', value: '4.9 / 5', change: '+0.2', up: true, icon: Users },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();

        if (data.success && data.stats) {
          const s = data.stats;

          if (Array.isArray(s.monthlyAnalyticsData)) {
            setMonthlyData(s.monthlyAnalyticsData);
          }

          if (Array.isArray(s.roomTypeDistribution) && s.roomTypeDistribution.length > 0) {
            setRoomTypeData(s.roomTypeDistribution);
          }

          if (s.kpiAnalytics) {
            setKpis([
              { title: 'Avg. Daily Rate (ADR)', value: s.kpiAnalytics.adr || '$0.00', change: '+5.2%', up: true, icon: DollarSign },
              { title: 'RevPAR', value: s.kpiAnalytics.revPar || '$0.00', change: '+8.1%', up: true, icon: TrendingUp },
              { title: 'Avg. Stay Duration', value: s.kpiAnalytics.avgStay || '0 nights', change: '+0.4', up: true, icon: Calendar },
              { title: 'Guest Satisfaction', value: s.kpiAnalytics.guestSatisfaction || '4.9 / 5', change: '+0.2', up: true, icon: Users },
            ]);
          }
        }
      } catch (err) {
        console.error('Error fetching Analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-sm text-slate-400 mt-1">Live performance insights from MongoDB</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.08 }}
              className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-800/60"><Icon className="w-4 h-4 text-slate-400" /></div>
                <span className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{kpi.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.title}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6 relative">
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
          className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6 relative">
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
        className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6 relative">
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
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="occupancy" stroke="#f59e0b" strokeWidth={2.5} fill="url(#occGradient)" dot={false} activeDot={{ r: 5, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-2xl backdrop-blur-xs z-10">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
