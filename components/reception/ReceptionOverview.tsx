'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Users, UserCheck, Key, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReceptionOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reception/stats');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-white animate-pulse">Loading dashboard...</div>;
  }

  const stats = [
    { label: 'Available Rooms', value: data?.roomStats?.available || 0, icon: Key, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Occupied Rooms', value: data?.roomStats?.occupied || 0, icon: BedDouble, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Expected Check-ins', value: data?.todayCheckIns?.length || 0, icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Guests', value: data?.totalGuests || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Today's Overview</h3>
        <button onClick={fetchData} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}>
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-luxury-card p-6 rounded-lg flex items-center gap-4 border border-slate-700"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Today's Check-ins */}
        <div className="bg-luxury-card rounded-lg p-6 border border-slate-700" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-dataViz-orange" />
            Today's Check-ins
          </h4>
          <div className="space-y-3">
            {data?.todayCheckIns?.length > 0 ? (
              data.todayCheckIns.map((booking: any) => (
                <div key={booking._id} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700" style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)' }}>
                  <div>
                    <p className="text-white font-medium">{booking.guestName}</p>
                    <p className="text-xs text-slate-400">Room: {booking.room?.roomNumber || 'Unassigned'} • Guests: {booking.numberOfGuests}</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors border border-emerald-500/30">
                    Check In
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">No check-ins scheduled for today.</p>
            )}
          </div>
        </div>

        {/* Room Status Snapshot */}
        <div className="bg-luxury-card rounded-lg p-6 border border-slate-700" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-dataViz-blue" />
            Room Status
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Available</span>
              <span className="text-emerald-400 font-medium">{data?.roomStats?.available || 0}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(data?.roomStats?.available / data?.roomStats?.total) * 100 || 0}%` }}></div>
            </div>

            <div className="flex justify-between text-sm mt-4">
              <span className="text-slate-400">Occupied</span>
              <span className="text-blue-400 font-medium">{data?.roomStats?.occupied || 0}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-dataViz-blue h-2 rounded-full" style={{ width: `${(data?.roomStats?.occupied / data?.roomStats?.total) * 100 || 0}%` }}></div>
            </div>

            <div className="flex justify-between text-sm mt-4">
              <span className="text-slate-400">Cleaning</span>
              <span className="text-dataViz-orange font-medium">{data?.roomStats?.cleaning || 0}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-dataViz-orange h-2 rounded-full" style={{ width: `${(data?.roomStats?.cleaning / data?.roomStats?.total) * 100 || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
