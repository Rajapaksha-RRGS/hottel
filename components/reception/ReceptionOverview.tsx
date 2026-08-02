'use client';

import { useEffect, useState } from 'react';
import { BedDouble, Users, UserCheck, Key, RefreshCcw, X, CreditCard, FileText, CheckCircle2, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
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
          className="pointer-events-auto w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-7 py-6"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/15">
                <UserCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Guest Check-In</h2>
                <p className="text-white/35 text-sm mt-0.5">Verify identity to complete check-in</p>
              </div>
            </div>
            <button onClick={onClose} className="cursor-pointer p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.06] transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Booking Summary */}
          <div className="mx-7 mt-6 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs text-white/25 uppercase tracking-[0.12em] mb-4 font-semibold">Booking Details</p>
            <div className="space-y-3">
              {[
                { label: 'Guest', value: booking.guestName },
                { label: 'Room', value: booking.room?.roomNumber ? `#${booking.room.roomNumber} · ${booking.room.roomType}` : 'Unassigned' },
                { label: 'Check-in', value: formatDate(booking.checkInDate) },
                { label: 'Check-out', value: formatDate(booking.checkOutDate) },
                { label: 'Guests', value: String(booking.numberOfGuests) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-sm text-white/40">{row.label}</span>
                  <span className="text-sm text-white font-medium">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm text-white/40">Total Amount</span>
                <span className="text-base font-bold text-emerald-400">LKR {booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ID Form */}
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
            <div>
              <p className="text-xs text-white/25 uppercase tracking-[0.12em] mb-3 font-semibold">Identity Verification</p>

              {/* ID Type Toggle */}
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => { setIdType('nic'); setPassportNumber(''); setError(''); }}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    idType === 'nic'
                      ? 'text-emerald-400'
                      : 'text-white/35 hover:text-white/60'
                  }`}
                  style={{
                    background: idType === 'nic' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                    border: idType === 'nic' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <CreditCard className="w-4 h-4" />
                  NIC / National ID
                </button>
                <button
                  type="button"
                  onClick={() => { setIdType('passport'); setNicNumber(''); setError(''); }}
                  className={`cursor-pointer flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    idType === 'passport'
                      ? 'text-blue-400'
                      : 'text-white/35 hover:text-white/60'
                  }`}
                  style={{
                    background: idType === 'passport' ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                    border: idType === 'passport' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Passport
                </button>
              </div>

              {/* Input */}
              <AnimatePresence mode="wait">
                {idType === 'nic' ? (
                  <motion.div key="nic" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <label className="block text-sm text-white/45 mb-2 font-medium">NIC Number <span className="text-emerald-400">*</span></label>
                    <input
                      type="text"
                      value={nicNumber}
                      onChange={(e) => { setNicNumber(e.target.value); setError(''); }}
                      placeholder="e.g. 200012345678 or 983456789V"
                      className="w-full px-4 py-3.5 rounded-xl text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-emerald-500/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      autoFocus
                    />
                  </motion.div>
                ) : (
                  <motion.div key="passport" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    <label className="block text-sm text-white/45 mb-2 font-medium">Passport Number <span className="text-blue-400">*</span></label>
                    <input
                      type="text"
                      value={passportNumber}
                      onChange={(e) => { setPassportNumber(e.target.value); setError(''); }}
                      placeholder="e.g. N1234567"
                      className="w-full px-4 py-3.5 rounded-xl text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
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
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium"
                  style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
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
                  className="flex items-center justify-center gap-2.5 px-4 py-4 rounded-xl bg-emerald-500/10 text-emerald-400 text-base font-semibold"
                  style={{ border: '1px solid rgba(16,185,129,0.2)' }}
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
                  className="cursor-pointer flex-1 py-3.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                  style={{
                    background: submitting ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                    boxShadow: submitting ? 'none' : '0 4px 20px rgba(16,185,129,0.35)',
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
      <div className="flex items-center gap-3 text-white/40 py-20 justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span className="text-base font-medium">Loading dashboard data...</span>
      </div>
    );
  }

  const stats = [
    { label: 'Available Rooms', value: data?.roomStats?.available || 0, icon: Key, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.15)', trend: '+2 today' },
    { label: 'Occupied Rooms', value: data?.roomStats?.occupied || 0, icon: BedDouble, color: 'text-blue-400', bg: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.15)', trend: 'Active' },
    { label: 'Expected Check-ins', value: data?.todayCheckIns?.length || 0, icon: UserCheck, color: 'text-amber-400', bg: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.15)', trend: 'Today' },
    { label: 'Total Guests', value: data?.totalGuests || 0, icon: Users, color: 'text-purple-400', bg: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.15)', trend: 'In-house' },
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

      <div className="space-y-8">
        {/* Section header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Today&apos;s Overview</h3>
            <p className="text-sm text-white/30 mt-1">Real-time hotel status summary</p>
          </div>
          <button
            onClick={fetchData}
            className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 flex items-start gap-5"
              style={{
                background: '#151515',
                border: `1px solid ${stat.borderColor}`,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              <div className="p-3.5 rounded-xl shrink-0" style={{ background: stat.bg }}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-4xl font-bold text-white leading-none">{stat.value}</p>
                <p className="text-sm text-white/40 mt-2 font-medium">{stat.label}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <TrendingUp className={`w-3 h-3 ${stat.color}`} />
                  <span className={`text-xs font-medium ${stat.color}`}>{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Check-ins */}
          <div
            className="rounded-2xl p-7"
            style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-white flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-amber-400" />
                Today&apos;s Check-ins
              </h4>
              {pendingCheckIns.length > 0 && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-400/10 text-amber-400" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
                  {pendingCheckIns.length} pending
                </span>
              )}
            </div>

            <div className="space-y-3">
              {pendingCheckIns.length > 0 ? (
                pendingCheckIns.map((booking: Booking) => (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-between items-center p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div>
                      <p className="text-white font-semibold text-[15px]">{booking.guestName}</p>
                      <p className="text-sm text-white/35 mt-1">
                        Room {booking.room?.roomNumber || 'Unassigned'} &bull; {booking.numberOfGuests} guest{booking.numberOfGuests !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="cursor-pointer px-4 py-2.5 text-sm font-bold bg-emerald-500/12 text-emerald-400 rounded-xl hover:bg-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
                      style={{ border: '1px solid rgba(16,185,129,0.2)' }}
                    >
                      <UserCheck className="w-4 h-4" />
                      Check In
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/30 mb-3" />
                  <p className="text-sm text-white/30 font-medium">All check-ins completed for today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Room Status Snapshot */}
          <div
            className="rounded-2xl p-7"
            style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}
          >
            <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2.5">
              <BedDouble className="w-5 h-5 text-blue-400" />
              Room Status
            </h4>
            <div className="space-y-6">
              {[
                { label: 'Available', count: data?.roomStats?.available || 0, color: '#10b981', textColor: 'text-emerald-400' },
                { label: 'Occupied', count: data?.roomStats?.occupied || 0, color: '#3b82f6', textColor: 'text-blue-400' },
                { label: 'Cleaning', count: data?.roomStats?.cleaning || 0, color: '#f97316', textColor: 'text-orange-400' },
              ].map((item) => {
                const total = data?.roomStats?.total || 1;
                const pct = Math.round((item.count / total) * 100) || 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/50 font-medium">{item.label}</span>
                      <span className={`font-bold ${item.textColor}`}>
                        {item.count} <span className="text-white/20 text-xs font-medium">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-2.5 rounded-full"
                        style={{ background: item.color, boxShadow: `0 0 8px ${item.color}40` }}
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
