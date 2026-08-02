'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  CreditCard,
  Clock,
  MapPin,
  Users,
  Star,
  BedDouble,
  Phone,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

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

export default function GuestDashboard() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [session]);

  // Find the current active booking (Confirmed or Checked-In)
  const activeBooking = bookings.find(
    (b) => b.status === 'Checked-In' || b.status === 'Confirmed'
  );

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

  const getDaysUntilCheckIn = (checkInDate: string) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const diff = checkIn.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Skeleton stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="dashboard-card rounded-xl p-5">
              <div className="skeleton h-4 w-24 mb-3" />
              <div className="skeleton h-7 w-16 mb-2" />
              <div className="skeleton h-3 w-32" />
            </div>
          ))}
        </div>
        {/* Skeleton active booking */}
        <div className="dashboard-card rounded-xl p-6">
          <div className="skeleton h-6 w-48 mb-4" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Calendar size={20} className="text-gold" />
            </div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Total Bookings</p>
          </div>
          <p className="text-2xl font-serif text-bone">{bookings.length}</p>
          <p className="text-xs text-bone/30 mt-1">All time reservations</p>
        </div>

        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Active</p>
          </div>
          <p className="text-2xl font-serif text-bone">
            {bookings.filter((b) => b.status === 'Checked-In' || b.status === 'Confirmed').length}
          </p>
          <p className="text-xs text-bone/30 mt-1">Current reservations</p>
        </div>

        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CreditCard size={20} className="text-blue-400" />
            </div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Total Spent</p>
          </div>
          <p className="text-2xl font-serif text-bone">
            ${bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
          </p>
          <p className="text-xs text-bone/30 mt-1">Across all bookings</p>
        </div>

        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <BedDouble size={20} className="text-purple-400" />
            </div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Nights Stayed</p>
          </div>
          <p className="text-2xl font-serif text-bone">
            {bookings
              .filter((b) => b.status !== 'Cancelled')
              .reduce((sum, b) => sum + getNights(b.checkInDate, b.checkOutDate), 0)}
          </p>
          <p className="text-xs text-bone/30 mt-1">Total nights</p>
        </div>
      </div>

      {/* Active Booking Card */}
      {activeBooking ? (
        <div className="dashboard-card rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-bone/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-bone">Current Booking</h2>
              <p className="text-xs text-bone/40 mt-1">
                Booking ID: #{activeBooking._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={getStatusClass(activeBooking.status)}>
                <span className={`w-2 h-2 rounded-full ${activeBooking.status === 'Checked-In' ? 'bg-green-400 availability-dot' : 'bg-gold'
                  }`} />
                {activeBooking.status}
              </span>
              <span className={getPaymentClass(activeBooking.paymentStatus)}>
                {activeBooking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Room Info */}
              <div className="lg:col-span-1">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${activeBooking.room?.images?.[0] ||
                        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                        })`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-bone font-serif text-lg">
                      {activeBooking.room?.type || 'Room'}
                    </p>
                    <p className="text-bone/60 text-xs">
                      Room {activeBooking.room?.roomNumber || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Amenities */}
                {activeBooking.room?.amenities && activeBooking.room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {activeBooking.room.amenities.slice(0, 4).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2.5 py-1 text-[11px] text-bone/50 border border-bone/10 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {activeBooking.room.amenities.length > 4 && (
                      <span className="px-2.5 py-1 text-[11px] text-gold/60 border border-gold/20 rounded-full">
                        +{activeBooking.room.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Booking Details */}
              <div className="lg:col-span-2 space-y-5">
                {/* Date row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-light rounded-lg p-4">
                    <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-1">Check-in</p>
                    <p className="text-sm text-bone font-medium">
                      {formatDate(activeBooking.checkInDate)}
                    </p>
                    {activeBooking.status === 'Confirmed' && (
                      <p className="text-[11px] text-gold mt-1">
                        {getDaysUntilCheckIn(activeBooking.checkInDate) > 0
                          ? `In ${getDaysUntilCheckIn(activeBooking.checkInDate)} days`
                          : 'Today!'}
                      </p>
                    )}
                  </div>

                  <div className="glass-light rounded-lg p-4">
                    <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-1">Check-out</p>
                    <p className="text-sm text-bone font-medium">
                      {formatDate(activeBooking.checkOutDate)}
                    </p>
                    <p className="text-[11px] text-bone/30 mt-1">
                      {getNights(activeBooking.checkInDate, activeBooking.checkOutDate)} night(s)
                    </p>
                  </div>

                  <div className="glass-light rounded-lg p-4">
                    <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-1">Guests</p>
                    <p className="text-sm text-bone font-medium flex items-center gap-1.5">
                      <Users size={14} className="text-gold/60" />
                      {activeBooking.numberOfGuests} Guest(s)
                    </p>
                  </div>
                </div>

                {/* Financial */}
                <div className="glass-light rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-1">Total Amount</p>
                      <p className="text-xl font-serif text-gold">
                        ${activeBooking.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    {activeBooking.advancePayment > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-1">Advance Paid</p>
                        <p className="text-sm text-green-400">
                          ${activeBooking.advancePayment.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requests */}
                {activeBooking.specialRequests && (
                  <div className="glass-light rounded-lg p-4">
                    <p className="text-[10px] uppercase tracking-wider text-bone/40 mb-2">Special Requests</p>
                    <p className="text-sm text-bone/70">{activeBooking.specialRequests}</p>
                  </div>
                )}

                {/* Status indicator for Checked-In */}
                {activeBooking.status === 'Checked-In' && (
                  <div className="glass-gold rounded-lg p-4 flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full availability-dot" />
                    <div>
                      <p className="text-sm text-gold font-medium">Currently Staying</p>
                      <p className="text-xs text-bone/40">
                        You are checked into the hotel. Enjoy your stay!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Active Booking */
        <div className="dashboard-card rounded-xl p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-bone/5 flex items-center justify-center mx-auto mb-6">
            <Calendar size={32} className="text-bone/20" />
          </div>
          <h3 className="font-serif text-xl text-bone mb-2">No Active Booking</h3>
          <p className="text-sm text-bone/40 max-w-md mx-auto mb-6">
            You don&apos;t have any active reservations at the moment.
            Browse our rooms to plan your next luxurious stay.
          </p>
          <Link
            href="/room"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium text-sm uppercase tracking-wide hover:bg-gold-light transition-all rounded-lg group"
          >
            Explore Rooms
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/guest/dashboard/bookings"
          className="dashboard-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
            <Calendar size={22} className="text-gold" />
          </div>
          <div>
            <p className="text-sm text-bone font-medium group-hover:text-gold transition-colors">
              My Bookings
            </p>
            <p className="text-xs text-bone/30">View all reservations</p>
          </div>
        </Link>

        <Link
          href="/guest/dashboard/payments"
          className="dashboard-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <CreditCard size={22} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-bone font-medium group-hover:text-gold transition-colors">
              Payments
            </p>
            <p className="text-xs text-bone/30">View payment history</p>
          </div>
        </Link>

        <Link
          href="/guest/dashboard/feedback"
          className="dashboard-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <MessageSquare size={22} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-bone font-medium group-hover:text-gold transition-colors">
              Feedback
            </p>
            <p className="text-xs text-bone/30">Share your experience</p>
          </div>
        </Link>

        <Link
          href="/guest/dashboard/complaints"
          className="dashboard-card rounded-xl p-5 flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <AlertCircle size={22} className="text-red-400" />
          </div>
          <div>
            <p className="text-sm text-bone font-medium group-hover:text-gold transition-colors">
              Complaints
            </p>
            <p className="text-xs text-bone/30">Report an issue</p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      {bookings.length > 0 && (
        <div className="dashboard-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-bone/10 flex items-center justify-between">
            <h2 className="font-serif text-lg text-bone">Recent Bookings</h2>
            <Link
              href="/guest/dashboard/bookings"
              className="text-xs text-gold hover:text-gold-light transition-colors flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          <div className="divide-y divide-bone/5">
            {bookings.slice(0, 3).map((booking) => (
              <div
                key={booking._id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bone/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-bone/5 flex items-center justify-center">
                    <BedDouble size={18} className="text-bone/30" />
                  </div>
                  <div>
                    <p className="text-sm text-bone font-medium">
                      {booking.room?.type || 'Room'} • Room {booking.room?.roomNumber || 'N/A'}
                    </p>
                    <p className="text-xs text-bone/40">
                      {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <p className="text-sm font-serif text-gold">
                    ${booking.totalAmount.toLocaleString()}
                  </p>
                  <span className={getStatusClass(booking.status)}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
