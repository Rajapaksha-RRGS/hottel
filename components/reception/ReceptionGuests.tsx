'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, MoreHorizontal } from 'lucide-react';

export default function ReceptionGuests() {
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
    return <div className="text-white animate-pulse">Loading guests...</div>;
  }

  // We are extracting unique guests from bookings for the reception view
  // since reception interacts mostly with checked-in/expected guests
  const bookings = data?.allBookings || [];

  // Use a map to get unique guests by email/phone or name
  const guestsMap = new Map();
  bookings.forEach((b: any) => {
    const key = b.guestEmail || b.guestPhone || b.guestName;
    if (!guestsMap.has(key)) {
      guestsMap.set(key, {
        id: b._id,
        name: b.guestName,
        email: b.guestEmail,
        phone: b.guestPhone,
        currentRoom: b.room?.roomNumber,
        status: b.status,
      });
    } else {
      // If they have an active booking, prefer that status
      if (b.status === 'Checked-In' || b.status === 'Confirmed') {
        const existing = guestsMap.get(key);
        guestsMap.set(key, { ...existing, currentRoom: b.room?.roomNumber, status: b.status });
      }
    }
  });

  const guests = Array.from(guestsMap.values());

  const statusColors: Record<string, string> = {
    'Checked-In': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Confirmed': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Checked-Out': 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    'Cancelled': 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Guest Directory</h2>
          <p className="text-sm text-slate-400 mt-1">View and manage guest profiles</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search guests..."
            className="bg-luxury-card border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none w-full sm:w-64"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {guests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-luxury-card rounded-lg border border-slate-700">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No guests found.</p>
          </div>
        ) : (
          guests.map((guest: any, i: number) => (
            <motion.div
              key={guest.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group bg-luxury-card border border-slate-700 rounded-2xl p-5 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center text-sm font-semibold text-emerald-400 border border-emerald-500/30 uppercase">
                    {guest.name?.substring(0, 2) || 'G'}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{guest.name || 'Unknown Guest'}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      {guest.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{guest.email}</span>}
                      {guest.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-slate-300">Room: {guest.currentRoom || 'N/A'}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[guest.status] || statusColors['Checked-Out']}`}>
                    {guest.status || 'Past Guest'}
                  </span>
                  <button className="text-slate-600 hover:text-slate-300 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
