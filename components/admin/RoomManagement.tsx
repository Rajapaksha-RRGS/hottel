'use client';

import { motion } from 'framer-motion';
import {
  BedDouble,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Wifi,
  AirVent,
  Tv,
  Bath,
} from 'lucide-react';

const rooms = [
  { id: '101', type: 'Standard', floor: '1st', beds: 1, price: 120, status: 'Available', amenities: ['wifi', 'tv'] },
  { id: '201', type: 'Suite', floor: '2nd', beds: 2, price: 350, status: 'Occupied', amenities: ['wifi', 'tv', 'ac', 'bath'] },
  { id: '202', type: 'Deluxe', floor: '2nd', beds: 2, price: 220, status: 'Occupied', amenities: ['wifi', 'tv', 'ac'] },
  { id: '301', type: 'Penthouse', floor: '3rd', beds: 3, price: 750, status: 'Reserved', amenities: ['wifi', 'tv', 'ac', 'bath'] },
  { id: '102', type: 'Standard', floor: '1st', beds: 1, price: 120, status: 'Maintenance', amenities: ['wifi', 'tv'] },
  { id: '305', type: 'Suite', floor: '3rd', beds: 2, price: 380, status: 'Available', amenities: ['wifi', 'tv', 'ac', 'bath'] },
  { id: '405', type: 'Deluxe', floor: '4th', beds: 2, price: 240, status: 'Available', amenities: ['wifi', 'tv', 'ac'] },
  { id: '501', type: 'Penthouse', floor: '5th', beds: 3, price: 900, status: 'Occupied', amenities: ['wifi', 'tv', 'ac', 'bath'] },
];

const statusColors: Record<string, string> = {
  Available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Occupied: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Reserved: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Maintenance: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const amenityIcons: Record<string, any> = { wifi: Wifi, tv: Tv, ac: AirVent, bath: Bath };

export default function RoomManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Room Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage and monitor all hotel rooms</p>
        </div>
        <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]">
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full bg-slate-900/80 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800/60 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {rooms.map((room, i) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.06)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800/60">
                  <BedDouble className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Room {room.id}</p>
                  <p className="text-xs text-slate-500">{room.type} · {room.floor} Floor</p>
                </div>
              </div>
              <button className="text-slate-600 hover:text-slate-300 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[room.status]}`}>
                {room.status}
              </span>
              <span className="text-lg font-bold text-white">${room.price}<span className="text-xs text-slate-500 font-normal">/night</span></span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
              {room.amenities.map((a) => {
                const Icon = amenityIcons[a];
                return Icon ? (
                  <div key={a} className="p-1.5 rounded-lg bg-slate-800/40" title={a}>
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                ) : null;
              })}
              <span className="ml-auto text-xs text-slate-500">{room.beds} {room.beds > 1 ? 'Beds' : 'Bed'}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
