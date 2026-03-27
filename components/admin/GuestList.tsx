'use client';

import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, MoreHorizontal } from 'lucide-react';

const guests = [
  { id: 'G-001', name: 'James Wilson', email: 'james.w@email.com', phone: '+1 234-567-8901', room: 'Suite 201', checkIn: 'Mar 25', checkOut: 'Mar 28', status: 'Checked In', nights: 3 },
  { id: 'G-002', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 234-567-8902', room: 'Deluxe 405', checkIn: 'Mar 26', checkOut: 'Mar 30', status: 'Checked In', nights: 4 },
  { id: 'G-003', name: 'Robert Chen', email: 'robert.c@email.com', phone: '+1 234-567-8903', room: 'Standard 112', checkIn: 'Mar 27', checkOut: 'Mar 29', status: 'Expected', nights: 2 },
  { id: 'G-004', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 234-567-8904', room: 'Penthouse 501', checkIn: 'Mar 26', checkOut: 'Apr 02', status: 'Checked In', nights: 7 },
  { id: 'G-005', name: 'Michael Park', email: 'michael.p@email.com', phone: '+1 234-567-8905', room: 'Suite 305', checkIn: 'Mar 28', checkOut: 'Mar 31', status: 'Expected', nights: 3 },
  { id: 'G-006', name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 234-567-8906', room: 'Deluxe 210', checkIn: 'Mar 24', checkOut: 'Mar 26', status: 'Checked Out', nights: 2 },
];

const statusColors: Record<string, string> = {
  'Checked In': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Expected: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Checked Out': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function GuestList() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Guest Directory</h2>
          <p className="text-sm text-slate-400 mt-1">View and manage current and upcoming guests</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search guests..." className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200" />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="space-y-3">
        {guests.map((guest, i) => (
          <motion.div
            key={guest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-sm font-semibold text-amber-400 border border-amber-500/20">
                  {guest.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-semibold">{guest.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{guest.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-slate-300">{guest.room}</p>
                  <p className="text-xs text-slate-500">{guest.checkIn} – {guest.checkOut} ({guest.nights} nights)</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[guest.status]}`}>
                  {guest.status}
                </span>
                <button className="text-slate-600 hover:text-slate-300 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
