'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Search, Check, X, Clock } from 'lucide-react';

export default function ReceptionBookings() {
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
    return <div className="text-white animate-pulse">Loading bookings...</div>;
  }

  const bookings = data?.allBookings || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Bookings</h2>
          <p className="text-sm text-slate-400 mt-1">Manage all reservations and check-ins</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="bg-luxury-card border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none w-full sm:w-64"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
          />
        </div>
      </div>

      <div className="bg-luxury-card rounded-lg overflow-hidden border border-slate-700" style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-sm bg-slate-800/50 border-b border-slate-700">
              <th className="px-6 py-4 font-medium">Guest</th>
              <th className="px-6 py-4 font-medium">Room</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking: any, idx: number) => {
                const checkIn = new Date(booking.checkInDate).toLocaleDateString();
                const checkOut = new Date(booking.checkOutDate).toLocaleDateString();

                let statusColor = 'text-slate-400 bg-slate-700/30 border-slate-600';
                if (booking.status === 'Confirmed') statusColor = 'text-blue-300 bg-blue-500/20 border-blue-500/40';
                if (booking.status === 'Checked-In') statusColor = 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40';
                if (booking.status === 'Cancelled') statusColor = 'text-red-300 bg-red-500/20 border-red-500/40';

                return (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-800/30 transition-colors border-b border-slate-700"
                  >
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{booking.guestName}</div>
                      <div className="text-xs text-slate-500">{booking.guestEmail || booking.guestPhone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300">{booking.room?.roomNumber || 'Unassigned'}</div>
                      <div className="text-xs text-slate-500">{booking.room?.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-300 text-sm">{checkIn}</div>
                      <div className="text-xs text-slate-500">to {checkOut}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-medium border ${statusColor}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {booking.status === 'Confirmed' && (
                        <button title="Check In" className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg border border-emerald-500/40 transition-colors inline-flex">
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      {booking.status === 'Checked-In' && (
                        <button title="Check Out" className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg border border-amber-500/40 transition-colors inline-flex">
                          <Clock className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
