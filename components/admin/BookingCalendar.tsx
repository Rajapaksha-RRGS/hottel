'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const bookingEvents: Record<number, { guest: string; color: string }[]> = {
  3: [{ guest: 'J. Wilson', color: 'bg-amber-500' }],
  5: [{ guest: 'S. Johnson', color: 'bg-emerald-500' }],
  8: [{ guest: 'R. Chen', color: 'bg-blue-500' }, { guest: 'E. Davis', color: 'bg-amber-500' }],
  12: [{ guest: 'M. Park', color: 'bg-emerald-500' }],
  15: [{ guest: 'L. Thompson', color: 'bg-blue-500' }],
  18: [{ guest: 'A. Garcia', color: 'bg-amber-500' }],
  22: [{ guest: 'K. Lee', color: 'bg-emerald-500' }, { guest: 'J. Brown', color: 'bg-blue-500' }],
  25: [{ guest: 'N. Patel', color: 'bg-amber-500' }],
  28: [{ guest: 'D. Kim', color: 'bg-emerald-500' }],
};

const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 5; // offset to start on correct weekday
  if (day < 1 || day > 31) return null;
  return day;
});

export default function BookingCalendar() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Booking Calendar</h2>
        <p className="text-sm text-slate-400 mt-1">View and manage scheduled bookings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-6"
      >
        {/* Month Header */}
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-semibold text-white">March 2026</h3>
          <button className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`min-h-[80px] p-2 rounded-xl border transition-all duration-200 ${
                day
                  ? 'bg-slate-800/30 border-slate-800/40 hover:border-amber-500/30 hover:bg-slate-800/50 cursor-pointer'
                  : 'border-transparent'
              } ${day === 26 ? 'border-amber-500/50 bg-amber-500/5' : ''}`}
            >
              {day && (
                <>
                  <span className={`text-xs font-medium ${day === 26 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {bookingEvents[day]?.map((event, j) => (
                      <div
                        key={j}
                        className={`${event.color}/20 border ${event.color === 'bg-amber-500' ? 'border-amber-500/30' : event.color === 'bg-emerald-500' ? 'border-emerald-500/30' : 'border-blue-500/30'} rounded-md px-1.5 py-0.5`}
                      >
                        <span className="text-[10px] text-slate-300 truncate block">{event.guest}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Check-in</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Check-out</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Reserved</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
