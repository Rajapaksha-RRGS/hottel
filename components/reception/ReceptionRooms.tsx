'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BedDouble, CheckCircle, Clock, Wrench } from 'lucide-react';

export default function ReceptionRooms() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    return <div className="text-white animate-pulse">Loading rooms...</div>;
  }

  const rooms = data?.rooms || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-luxury-text">Room Status</h2>
          <p className="text-sm text-slate-400 mt-1">Live status of all rooms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-1">Available</p>
            <p className="text-2xl font-bold text-luxury-text">{data?.roomStats?.available || 0}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-emerald-500 opacity-50" />
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wider mb-1">Occupied</p>
            <p className="text-2xl font-bold text-white">{data?.roomStats?.occupied || 0}</p>
          </div>
          <BedDouble className="w-8 h-8 text-blue-500 opacity-50" />
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-1">Cleaning</p>
            <p className="text-2xl font-bold text-white">{data?.roomStats?.cleaning || 0}</p>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-50" />
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-red-400 font-medium uppercase tracking-wider mb-1">Maintenance</p>
            <p className="text-2xl font-bold text-white">{data?.roomStats?.maintenance || 0}</p>
          </div>
          <Wrench className="w-8 h-8 text-red-500 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center text-slate-400 p-8 bg-luxury-card rounded-lg border border-slate-700">
            No rooms found.
          </div>
        ) : (
          rooms.map((room: any, idx: number) => {
            let statusClass = 'border-slate-800 bg-slate-900 text-slate-400';

            if (room.status === 'Available') {
              statusClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400';
            } else if (room.status === 'Occupied') {
              statusClass = 'border-blue-500/40 bg-blue-500/10 text-blue-400';
            } else if (room.status === 'Cleaning') {
              statusClass = 'border-amber-500/40 bg-amber-500/10 text-amber-400';
            } else if (room.status === 'Maintenance') {
              statusClass = 'border-red-500/40 bg-red-500/10 text-red-400';
            }

            return (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className={`p-4 rounded-xl border ${statusClass} flex flex-col items-center justify-center text-center cursor-pointer hover:brightness-110 transition-all`}
              >
                <span className="text-xl font-bold mb-1">{room.roomNumber}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{room.type}</span>
                <span className="text-[10px] mt-2 opacity-60 bg-black/20 px-2 py-0.5 rounded-md">{room.status}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
