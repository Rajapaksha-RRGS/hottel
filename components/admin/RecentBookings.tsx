'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BookingItem {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: string;
}

const statusStyles: Record<string, string> = {
  'Checked In': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Confirmed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Pending: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  Completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function RecentBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (json.success && json.stats && Array.isArray(json.stats.recentBookings)) {
          setBookings(json.stats.recentBookings);
        }
      } catch (err) {
        console.error('Error fetching recent bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          <p className="text-sm text-slate-400 mt-1">Live guest reservations from database</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/80">
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Guest
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Room
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Check-In
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Check-Out
              </th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider pb-3 pr-4">
                Status
              </th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider pb-3">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="group hover:bg-amber-500/[0.03] transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-xs font-semibold text-amber-400 border border-amber-500/20">
                        {booking.guest.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {booking.guest}
                        </p>
                        <p className="text-xs text-slate-500">{booking.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-slate-300">{booking.room}</td>
                  <td className="py-3.5 pr-4 text-sm text-slate-400">{booking.checkIn}</td>
                  <td className="py-3.5 pr-4 text-sm text-slate-400">{booking.checkOut}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        statusStyles[booking.status] || 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-sm font-semibold text-white">
                    {booking.amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                  {loading ? 'Loading recent bookings...' : 'No bookings recorded in database yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-2xl backdrop-blur-xs">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}
