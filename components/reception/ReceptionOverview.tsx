'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Users, UserCheck, Key, RefreshCcw, X, CreditCard, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Booking {
  _id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  numberOfGuests: number;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  paymentStatus: string;
  room?: { roomNumber: string; roomType: string };
}

type IdType = 'nic' | 'passport';

// ─── Check-In Modal ─────────────────────────────────────────────────────────
function CheckInModal({
  booking,
  onClose,
  onSuccess,
}: {
  booking: Booking;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}) {
  const [idType, setIdType] = useState<IdType>('nic');
  const [nicNumber, setNicNumber] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const idValue = idType === 'nic' ? nicNumber.trim() : passportNumber.trim();
    if (!idValue) {
      setError(`Please enter a valid ${idType === 'nic' ? 'NIC number' : 'passport number'}.`);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/booking/check-in', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking._id,
          ...(idType === 'nic' ? { nicNumber: idValue } : { passportNumber: idValue }),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.message || 'Check-in failed. Please try again.');
      } else {
        setDone(true);
        setTimeout(() => {
          onSuccess(booking._id);
          onClose();
        }, 1800);
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-700 overflow-hidden"
          style={{ background: '#0f1f38', boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(100,255,218,0.08)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60"
            style={{ background: 'linear-gradient(135deg, #112240, #0a192f)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Guest Check-In</h2>
                <p className="text-slate-400 text-xs mt-0.5">Verify guest identity to complete check-in</p>
              </div>
            </div>
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Booking Summary */}
          <div className="mx-6 mt-5 p-4 rounded-xl border border-slate-700/50"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Booking Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Guest</span>
                <span className="text-sm text-white font-medium">{booking.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Room</span>
                <span className="text-sm text-white font-medium">
                  {booking.room?.roomNumber ? `#${booking.room.roomNumber} · ${booking.room.roomType}` : 'Unassigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Check-in</span>
                <span className="text-sm text-white font-medium">{formatDate(booking.checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Check-out</span>
                <span className="text-sm text-white font-medium">{formatDate(booking.checkOutDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Guests</span>
                <span className="text-sm text-white font-medium">{booking.numberOfGuests}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700/50 mt-2">
                <span className="text-sm text-slate-400">Total</span>
                <span className="text-sm font-semibold text-emerald-400">LKR {booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ID Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-medium">Identity Verification</p>

              {/* ID Type Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => { setIdType('nic'); setPassportNumber(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    idType === 'nic'
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  NIC / National ID
                </button>
                <button
                  type="button"
                  onClick={() => { setIdType('passport'); setNicNumber(''); setError(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    idType === 'passport'
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Passport
                </button>
              </div>

              {/* Input */}
              <AnimatePresence mode="wait">
                {idType === 'nic' ? (
                  <motion.div key="nic" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <label className="block text-xs text-slate-400 mb-1.5">NIC Number <span className="text-emerald-400">*</span></label>
                    <input
                      type="text"
                      value={nicNumber}
                      onChange={(e) => { setNicNumber(e.target.value); setError(''); }}
                      placeholder="e.g. 200012345678 or 983456789V"
                      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      autoFocus
                    />
                  </motion.div>
                ) : (
                  <motion.div key="passport" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <label className="block text-xs text-slate-400 mb-1.5">Passport Number <span className="text-blue-400">*</span></label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => { setPassportNumber(e.target.value); setError(''); }}
                      placeholder="e.g. N1234567"
                      className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success */}
            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Check-in successful! Welcome, {booking.guestName}!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            {!done && (
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg text-sm font-medium border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: submitting ? 'rgba(16, 185, 129, 0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: submitting ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.35)',
                    color: '#fff',
                  }}
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><UserCheck className="w-4 h-4" /> Confirm Check-In</>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ReceptionOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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

  const handleCheckInSuccess = (bookingId: string) => {
    setCheckedInIds((prev) => new Set([...prev, bookingId]));
    fetchData(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  const stats = [
    { label: 'Available Rooms', value: data?.roomStats?.available || 0, icon: Key, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Occupied Rooms', value: data?.roomStats?.occupied || 0, icon: BedDouble, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Expected Check-ins', value: data?.todayCheckIns?.length || 0, icon: UserCheck, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Guests', value: data?.totalGuests || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const pendingCheckIns = (data?.todayCheckIns || []).filter(
    (b: Booking) => !checkedInIds.has(b._id)
  );

  return (
    <>
      {/* Check-In Modal */}
      {selectedBooking && (
        <CheckInModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={handleCheckInSuccess}
        />
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Today's Overview</h3>
          <button
            onClick={fetchData}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-luxury-card p-6 rounded-lg flex items-center gap-4 border border-slate-700"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
            >
              <div className={`p-4 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Today's Check-ins */}
          <div
            className="bg-luxury-card rounded-lg p-6 border border-slate-700"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-dataViz-orange" />
              Today's Check-ins
              {pendingCheckIns.length > 0 && (
                <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {pendingCheckIns.length} pending
                </span>
              )}
            </h4>
            <div className="space-y-3">
              {pendingCheckIns.length > 0 ? (
                pendingCheckIns.map((booking: Booking) => (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                    style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)' }}
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{booking.guestName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Room: {booking.room?.roomNumber || 'Unassigned'} &bull; {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 active:scale-95 transition-all border border-emerald-500/30 flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Check In
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/40 mb-2" />
                  <p className="text-sm text-slate-500 italic">All check-ins completed for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Status Snapshot */}
          <div
            className="bg-luxury-card rounded-lg p-6 border border-slate-700"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            <h4 className="text-white font-medium mb-4 flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-dataViz-blue" />
              Room Status
            </h4>
            <div className="space-y-4">
              {[
                { label: 'Available', count: data?.roomStats?.available || 0, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'Occupied', count: data?.roomStats?.occupied || 0, color: 'bg-blue-500', textColor: 'text-blue-400' },
                { label: 'Cleaning', count: data?.roomStats?.cleaning || 0, color: 'bg-dataViz-orange', textColor: 'text-dataViz-orange' },
              ].map((item) => {
                const total = data?.roomStats?.total || 1;
                const pct = Math.round((item.count / total) * 100) || 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-400">{item.label}</span>
                      <span className={`font-medium ${item.textColor}`}>{item.count} <span className="text-slate-600 text-xs">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`${item.color} h-2 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
