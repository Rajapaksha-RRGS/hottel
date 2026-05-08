'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface BookingEvent {
  guest: string;
  color: string;
  type: 'check-in' | 'check-out' | 'reserved';
  roomNumber?: string;
  bookingId?: string;
}

type BookingData = Record<number, BookingEvent[]>;

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingEvents, setBookingEvents] = useState<BookingData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Calculate calendar days
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return day;
  });

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/booking?year=${year}&month=${month}`, {
          cache: 'no-store'
        });
        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.message || 'Failed to fetch bookings');
        }

        // Process bookings to extract calendar events
        const events: BookingData = {};

        data.bookings.forEach((booking: any) => {
          const checkInDate = new Date(booking.checkInDate);
          const checkOutDate = new Date(booking.checkOutDate);
          const guestName = booking.guestName || 'Unknown Guest';
          const roomNumber = booking.room?.roomNumber || 'Room ' + booking._id?.toString().slice(-4);

          // Check-in on the first day
          const checkInDay = checkInDate.getDate();
          if (!events[checkInDay]) events[checkInDay] = [];
          events[checkInDay].push({
            guest: `${guestName} (Check-in)`,
            color: 'bg-amber-500',
            type: 'check-in',
            roomNumber,
            bookingId: booking._id
          });

          // Check-out on the last day
          const checkOutDay = checkOutDate.getDate();
          if (!events[checkOutDay]) events[checkOutDay] = [];
          events[checkOutDay].push({
            guest: `${guestName} (Check-out)`,
            color: 'bg-emerald-500',
            type: 'check-out',
            roomNumber,
            bookingId: booking._id
          });

          // Reserved days (all days between check-in and check-out)
          let currentDay = new Date(checkInDate);
          while (currentDay < checkOutDate) {
            currentDay.setDate(currentDay.getDate() + 1);
            const day = currentDay.getDate();

            // Only add if it's not check-in or check-out day and within the month
            if (day !== checkInDay && day !== checkOutDay && currentDay.getMonth() === checkInDate.getMonth()) {
              if (!events[day]) events[day] = [];
              // Only add if not already added
              if (!events[day].some(e => e.bookingId === booking._id && e.type === 'reserved')) {
                events[day].push({
                  guest: guestName,
                  color: 'bg-blue-500',
                  type: 'reserved',
                  roomNumber,
                  bookingId: booking._id
                });
              }
            }
          }
        });

        setBookingEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching bookings');
        setBookingEvents({});
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() &&
           month === today.getMonth() + 1 &&
           year === today.getFullYear();
  };

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
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-lg font-semibold text-white">{monthName}</h3>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-6 h-6 text-amber-500 animate-spin mr-2" />
            <span className="text-slate-400">Loading bookings...</span>
          </div>
        )}

        {/* Day Headers */}
        {!loading && (
          <>
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
                  className={`min-h-[100px] p-2 rounded-xl border transition-all duration-200 ${
                    day
                      ? `bg-slate-800/30 border-slate-800/40 hover:border-amber-500/30 hover:bg-slate-800/50 cursor-pointer ${
                          isToday(day) ? 'border-amber-500/50 bg-amber-500/5' : ''
                        }`
                      : 'border-transparent'
                  }`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-xs font-medium ${
                          isToday(day) ? 'text-amber-400' : 'text-slate-400'
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {bookingEvents[day]?.slice(0, 3).map((event, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: j * 0.05 }}
                            className={`${event.color}/20 border ${
                              event.color === 'bg-amber-500'
                                ? 'border-amber-500/30'
                                : event.color === 'bg-emerald-500'
                                ? 'border-emerald-500/30'
                                : 'border-blue-500/30'
                            } rounded-md px-1.5 py-0.5 group relative`}
                            title={`${event.guest} - ${event.roomNumber || 'N/A'}`}
                          >
                            <span className="text-[10px] text-slate-300 truncate block">
                              {event.guest}
                            </span>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {event.roomNumber}
                            </div>
                          </motion.div>
                        ))}
                        {bookingEvents[day]?.length > 3 && (
                          <div className="text-[10px] text-slate-400 px-1 py-0.5">
                            +{bookingEvents[day].length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/60 flex-wrap">
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
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Today</span>
              </div>
            </div>

            {/* No Events Message */}
            {Object.keys(bookingEvents).length === 0 && !loading && (
              <div className="text-center py-8 text-slate-400">
                <p>No bookings for {monthName}</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
