'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';

const tours = [
  { id: 'T-001', name: 'City Heritage Walk', location: 'Old Town District', duration: '3 hours', capacity: 15, booked: 12, rating: 4.8, price: 55, status: 'Active' },
  { id: 'T-002', name: 'Sunset Beach Cruise', location: 'Marina Bay', duration: '2 hours', capacity: 30, booked: 28, rating: 4.9, price: 120, status: 'Active' },
  { id: 'T-003', name: 'Mountain Adventure Trek', location: 'Highland Trails', duration: '6 hours', capacity: 10, booked: 10, rating: 4.7, price: 180, status: 'Full' },
  { id: 'T-004', name: 'Wine & Dine Experience', location: 'Vineyard Valley', duration: '4 hours', capacity: 20, booked: 8, rating: 4.6, price: 95, status: 'Active' },
  { id: 'T-005', name: 'Cultural Museum Tour', location: 'Arts Quarter', duration: '2.5 hours', capacity: 25, booked: 14, rating: 4.5, price: 40, status: 'Active' },
  { id: 'T-006', name: 'Night Sky Stargazing', location: 'Observatory Hill', duration: '3 hours', capacity: 12, booked: 12, rating: 4.9, price: 75, status: 'Full' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Full: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Inactive: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function TourManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tour Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage tour packages and excursions</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]">
          <Plus className="w-4 h-4" /> Add Tour
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input type="text" placeholder="Search tours..." className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200" />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tours.map((tour, i) => (
          <motion.div
            key={tour.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold">{tour.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span className="text-xs text-slate-500">{tour.location}</span>
                </div>
              </div>
              <button className="text-slate-600 hover:text-slate-300 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duration}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{tour.booked}/{tour.capacity}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" />{tour.rating}</span>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${(tour.booked / tour.capacity) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[tour.status]}`}>{tour.status}</span>
              <span className="text-lg font-bold text-white">${tour.price}<span className="text-xs text-slate-500 font-normal">/person</span></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
