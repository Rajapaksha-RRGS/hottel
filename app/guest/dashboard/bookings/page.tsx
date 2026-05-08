'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  BedDouble,
  Users,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';

interface Booking {
  _id: string;
  guestName: string;
  guestEmail: string;
  room: {
    _id: string;
    roomNumber: string;
    type: string;
    pricePerNight: number;
    amenities: string[];
    images: string[];
  } | null;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  advancePayment: number;
  paymentStatus: string;
  status: string;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.email) return;
      try {
        const params = new URLSearchParams({ email: session.user.email });
        if (session.user.name) params.set('name', session.user.name);
        const res = await fetch(`/api/guest/bookings?${params}`);
        const data = await res.json();
        if (data.ok) {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [session]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'status-badge status-confirmed';
      case 'Checked-In': return 'status-badge status-checked-in';
      case 'Checked-Out': return 'status-badge status-checked-out';
      case 'Cancelled': return 'status-badge status-cancelled';
      default: return 'status-badge';
    }
  };

  const getPaymentClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-badge payment-pending';
      case 'Partially-Paid': return 'status-badge payment-partial';
      case 'Paid': return 'status-badge payment-paid';
      default: return 'status-badge';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const statuses = ['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const matchesSearch = b.room?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="dashboard-card rounded-xl p-6">
            <div className="skeleton h-5 w-48 mb-3" />
            <div className="skeleton h-4 w-72 mb-2" />
            <div className="skeleton h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-bone">Booking History</h2>
          <p className="text-sm text-bone/40 mt-1">{bookings.length} total booking(s)</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-bone/30" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-bone/5 border border-bone/10 rounded-lg text-sm text-bone placeholder-bone/30 outline-none focus:border-gold/40 transition-colors w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === s
                ? 'bg-gold/20 text-gold border border-gold/30'
                : 'text-bone/40 border border-bone/10 hover:text-bone/70 hover:border-bone/20'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filteredBookings.length === 0 ? (
        <div className="dashboard-card rounded-xl p-12 text-center">
          <Calendar size={40} className="mx-auto text-bone/15 mb-4" />
          <h3 className="font-serif text-lg text-bone mb-2">No Bookings Found</h3>
          <p className="text-sm text-bone/40">
            {filter !== 'All' ? `No ${filter.toLowerCase()} bookings found.` : 'You haven\'t made any bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="dashboard-card rounded-xl overflow-hidden">
              {/* Main row */}
              <button
                onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-bone/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-bone/5 flex items-center justify-center flex-shrink-0">
                    <BedDouble size={20} className="text-bone/30" />
                  </div>
                  <div>
                    <p className="text-sm text-bone font-medium">
                      {booking.room?.type || 'Room'} • Room {booking.room?.roomNumber || 'N/A'}
                    </p>
                    <p className="text-xs text-bone/40 mt-0.5">
                      {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                      <span className="text-bone/20 mx-1">•</span>
                      {getNights(booking.checkInDate, booking.checkOutDate)} night(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <p className="text-sm font-serif text-gold">${booking.totalAmount.toLocaleString()}</p>
                  <span className={getStatusClass(booking.status)}>{booking.status}</span>
                  {expandedId === booking._id
                    ? <ChevronUp size={16} className="text-bone/30" />
                    : <ChevronDown size={16} className="text-bone/30" />
                  }
                </div>
              </button>

              {/* Expanded details */}
              {expandedId === booking._id && (
                <div className="px-5 pb-5 pt-2 border-t border-bone/5 animate-fade-in-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Booking ID</p>
                      <p className="text-sm text-bone mt-1 font-mono">#{booking._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Guests</p>
                      <p className="text-sm text-bone mt-1 flex items-center gap-1.5">
                        <Users size={14} className="text-gold/60" />
                        {booking.numberOfGuests}
                      </p>
                    </div>
                    <div className="glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Advance Paid</p>
                      <p className="text-sm text-bone mt-1">${booking.advancePayment.toLocaleString()}</p>
                    </div>
                    <div className="glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Payment Status</p>
                      <span className={`${getPaymentClass(booking.paymentStatus)} mt-1`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="mt-4 glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Special Requests</p>
                      <p className="text-sm text-bone/60 mt-1">{booking.specialRequests}</p>
                    </div>
                  )}

                  {booking.notes && (
                    <div className="mt-3 glass-light rounded-lg p-3">
                      <p className="text-[10px] uppercase tracking-wider text-bone/40">Notes</p>
                      <p className="text-sm text-bone/60 mt-1">{booking.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
