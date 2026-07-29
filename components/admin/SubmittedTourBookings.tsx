'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, MapPin, DollarSign, Phone, Mail, Loader2, RefreshCw } from 'lucide-react';

interface TourBooking {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  tourName: string;
  numberOfPeople: number;
  bookingDate: string;
  totalCost: number;
  specialRequests?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  Scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Confirmed: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const STATUS_NEXT: Record<string, string[]> = {
  Scheduled: ['Confirmed', 'Cancelled'],
  Confirmed: ['Completed', 'Cancelled'],
  Completed: [],
  Cancelled: [],
};

export default function SubmittedTourBookings() {
  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/tours/booking');
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Failed to fetch bookings');
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    try {
      setUpdating(bookingId);
      const res = await fetch('/api/tours/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || 'Failed to update status');

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: status as any } : b))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const totalRevenue = bookings
    .filter((b) => b.status !== 'Cancelled')
    .reduce((sum, b) => sum + b.totalCost, 0);

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-white">Submitted Tour Bookings</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {bookings.filter((b) => b.status !== 'Cancelled').length} active · LKR {totalRevenue.toLocaleString()} total revenue
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-600 transition-all"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && bookings.length === 0 && (
        <div className="text-center py-10 bg-slate-900/50 rounded-xl border border-slate-800/60 text-slate-500 text-sm">
          No tour bookings yet. Bookings will appear here once guests submit them.
        </div>
      )}

      {/* Booking Cards Grid */}
      {!loading && !error && bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-slate-900/80 border border-slate-800/60 rounded-2xl p-5 hover:border-amber-500/20 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Header: Name + Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm truncate">{booking.fullName}</h4>
                      <p className="text-amber-400 text-xs font-medium mt-0.5 truncate">{booking.tourName}</p>
                    </div>
                    <span className={`ml-2 shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${STATUS_STYLES[booking.status] || STATUS_STYLES.Scheduled}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Mail size={11} className="shrink-0" />
                      <span className="truncate">{booking.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Phone size={11} className="shrink-0" />
                      <span>{booking.phone}</span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Calendar size={11} className="text-amber-500" />
                      {formatDate(booking.bookingDate)}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Users size={11} className="text-amber-500" />
                      {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'guest' : 'guests'}
                    </span>
                  </div>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <p className="text-xs text-slate-500 italic bg-slate-800/50 rounded-lg px-3 py-2 mb-4 line-clamp-2">
                      &ldquo;{booking.specialRequests}&rdquo;
                    </p>
                  )}
                </div>

                <div>
                  {/* Status Action Buttons for Admin */}
                  {STATUS_NEXT[booking.status]?.length > 0 && (
                    <div className="flex gap-2 mb-3 pt-3 border-t border-slate-800">
                      {STATUS_NEXT[booking.status].map((nextStatus) => (
                        <button
                          key={nextStatus}
                          disabled={updating === booking._id}
                          onClick={() => handleUpdateStatus(booking._id, nextStatus)}
                          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                            nextStatus === 'Confirmed'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950'
                              : nextStatus === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          {updating === booking._id ? 'Updating...' : `Mark ${nextStatus}`}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Footer: Price + Booked Date */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                      <DollarSign size={13} />
                      LKR {booking.totalCost.toLocaleString()}
                    </div>
                    <span className="text-xs text-slate-600">
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Divider */}
      {bookings.length > 0 && (
        <div className="mt-6 border-t border-slate-800/60 pt-6" />
      )}
    </div>
  );
}

