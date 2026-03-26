'use client';

import { motion } from 'framer-motion';

const bookings = [
  {
    id: 'BK-001',
    guest: 'James Wilson',
    room: 'Suite 201',
    checkIn: 'Mar 25, 2026',
    checkOut: 'Mar 28, 2026',
    status: 'Checked In',
    amount: '$1,200',
  },
  {
    id: 'BK-002',
    guest: 'Sarah Johnson',
    room: 'Deluxe 405',
    checkIn: 'Mar 26, 2026',
    checkOut: 'Mar 30, 2026',
    status: 'Confirmed',
    amount: '$980',
  },
  {
    id: 'BK-003',
    guest: 'Robert Chen',
    room: 'Standard 112',
    checkIn: 'Mar 27, 2026',
    checkOut: 'Mar 29, 2026',
    status: 'Pending',
    amount: '$450',
  },
  {
    id: 'BK-004',
    guest: 'Emily Davis',
    room: 'Penthouse 501',
    checkIn: 'Mar 26, 2026',
    checkOut: 'Apr 02, 2026',
    status: 'Checked In',
    amount: '$3,500',
  },
  {
    id: 'BK-005',
    guest: 'Michael Park',
    room: 'Suite 305',
    checkIn: 'Mar 28, 2026',
    checkOut: 'Mar 31, 2026',
    status: 'Confirmed',
    amount: '$1,650',
  },
  {
    id: 'BK-006',
    guest: 'Lisa Thompson',
    room: 'Deluxe 210',
    checkIn: 'Mar 29, 2026',
    checkOut: 'Apr 01, 2026',
    status: 'Pending',
    amount: '$720',
  },
];

const statusStyles: Record<string, string> = {
  'Checked In': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Confirmed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Pending: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function RecentBookings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/60 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
          <p className="text-sm text-slate-400 mt-1">Latest guest reservations</p>
        </div>
        <button className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors duration-200">
          View All →
        </button>
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
            {bookings.map((booking, i) => (
              <tr
                key={booking.id}
                className="group hover:bg-amber-500/[0.03] transition-colors duration-200 cursor-pointer"
              >
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-xs font-semibold text-amber-400 border border-amber-500/20">
                      {booking.guest.split(' ').map(n => n[0]).join('')}
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
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusStyles[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-3.5 text-right text-sm font-semibold text-white">
                  {booking.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
