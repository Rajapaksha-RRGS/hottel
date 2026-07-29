'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  BedDouble,
  Users,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Clock,
  Star,
} from 'lucide-react';

interface RoomBooking {
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

interface TourBooking {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  tourPackageId: string;
  tourName: string;
  numberOfPeople: number;
  bookingDate: string;
  totalCost: number;
  specialRequests?: string;
  status: string;
  createdAt: string;
}

export default function BookingsPage() {
  const { data: session } = useSession();
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'rooms' | 'tours'>('rooms');
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState('All');
  const [tourFilter, setTourFilter] = useState('All');

  useEffect(() => {
    const fetchAll = async () => {
      if (!session?.user?.email) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({ email: session.user.email });
        if (session.user.name) params.set('name', session.user.name);

        const [roomRes, tourRes] = await Promise.all([
          fetch(`/api/guest/bookings?${params}`),
          fetch(`/api/guest/tour-bookings?${params}`),
        ]);

        const roomData = await roomRes.json();
        const tourData = await tourRes.json();

        if (roomData.ok) setRoomBookings(roomData.bookings);
        if (tourData.ok) setTourBookings(tourData.tourBookings);
      } catch (err) {
        console.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [session]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

  const getNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoomStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed':   return 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Checked-In':  return 'px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30';
      case 'Checked-Out': return 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30';
      case 'Cancelled':   return 'px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30';
      default:            return 'px-2.5 py-1 rounded-full text-xs font-medium bg-bone/10 text-bone/50 border border-bone/10';
    }
  };

  const getTourStatusClass = (status: string) => {
    switch (status) {
      case 'Scheduled':  return 'px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-400 border border-violet-500/30';
      case 'Confirmed':  return 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      case 'Completed':  return 'px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/15 text-slate-400 border border-slate-500/30';
      case 'Cancelled':  return 'px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/15 text-red-400 border border-red-500/30';
      default:           return 'px-2.5 py-1 rounded-full text-xs font-medium bg-bone/10 text-bone/50 border border-bone/10';
    }
  };

  const getPaymentClass = (status: string) => {
    switch (status) {
      case 'Pending':        return 'px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30';
      case 'Partially-Paid': return 'px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-400 border border-orange-500/30';
      case 'Paid':           return 'px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
      default:               return 'px-2.5 py-1 rounded-full text-xs font-medium bg-bone/10 text-bone/50 border border-bone/10';
    }
  };

  const roomStatuses = ['All', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'];
  const tourStatuses = ['All', 'Scheduled', 'Confirmed', 'Completed', 'Cancelled'];

  const filteredRoomBookings = roomBookings.filter((b) => {
    const matchesFilter = roomFilter === 'All' || b.status === roomFilter;
    const matchesSearch =
      b.room?.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room?.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredTourBookings = tourBookings.filter((b) => {
    const matchesFilter = tourFilter === 'All' || b.status === tourFilter;
    const matchesSearch =
      b.tourName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-bone">Booking History</h2>
          <p className="text-sm text-bone/40 mt-1">
            {roomBookings.length} room booking(s) • {tourBookings.length} tour booking(s)
          </p>
        </div>
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

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'rooms'
              ? 'bg-gold/20 text-gold border border-gold/30'
              : 'text-bone/40 border border-bone/10 hover:text-bone/70 hover:border-bone/20'
          }`}
        >
          <BedDouble size={15} />
          Room Bookings
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'rooms' ? 'bg-gold/20 text-gold' : 'bg-bone/10 text-bone/40'
          }`}>
            {roomBookings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('tours')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeTab === 'tours'
              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
              : 'text-bone/40 border border-bone/10 hover:text-bone/70 hover:border-bone/20'
          }`}
        >
          <MapPin size={15} />
          Tour Bookings
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'tours' ? 'bg-violet-500/20 text-violet-400' : 'bg-bone/10 text-bone/40'
          }`}>
            {tourBookings.length}
          </span>
        </button>
      </div>

      {/* ═══════════════════════════════════ ROOM BOOKINGS TAB ═══════════════════════════════════ */}
      {activeTab === 'rooms' && (
        <div className="space-y-4">
          {/* Filter row */}
          <div className="flex flex-wrap gap-2">
            {roomStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setRoomFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  roomFilter === s
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'text-bone/40 border border-bone/10 hover:text-bone/70 hover:border-bone/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {filteredRoomBookings.length === 0 ? (
            <div className="dashboard-card rounded-xl p-12 text-center">
              <BedDouble size={40} className="mx-auto text-gold/20 mb-4" />
              <h3 className="font-serif text-lg text-bone mb-2">No Room Bookings Found</h3>
              <p className="text-sm text-bone/40">
                {roomFilter !== 'All'
                  ? `No ${roomFilter.toLowerCase()} room bookings found.`
                  : "You haven't made any room bookings yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRoomBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl overflow-hidden border border-gold/10 bg-gradient-to-br from-charcoal/80 to-charcoal/60 backdrop-blur-sm hover:border-gold/25 transition-all duration-300"
                >
                  {/* Left accent bar */}
                  <div className="flex">
                    <div className="w-1 bg-gradient-to-b from-gold via-gold/70 to-gold/30 flex-shrink-0" />
                    <div className="flex-1">
                      {/* Main Row */}
                      <button
                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-gold/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 border border-gold/20">
                            <BedDouble size={20} className="text-gold/60" />
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
                          <span className={getRoomStatusClass(booking.status)}>{booking.status}</span>
                          {expandedId === booking._id
                            ? <ChevronUp size={16} className="text-bone/30" />
                            : <ChevronDown size={16} className="text-bone/30" />}
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {expandedId === booking._id && (
                        <div className="px-5 pb-5 pt-2 border-t border-gold/10 animate-fade-in-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Booking ID</p>
                              <p className="text-sm text-bone mt-1 font-mono">#{booking._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Guests</p>
                              <p className="text-sm text-bone mt-1 flex items-center gap-1.5">
                                <Users size={14} className="text-gold/60" />
                                {booking.numberOfGuests}
                              </p>
                            </div>
                            <div className="bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Advance Paid</p>
                              <p className="text-sm text-bone mt-1">${booking.advancePayment.toLocaleString()}</p>
                            </div>
                            <div className="bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Payment</p>
                              <span className={`${getPaymentClass(booking.paymentStatus)} mt-1 inline-block`}>
                                {booking.paymentStatus}
                              </span>
                            </div>
                          </div>
                          {booking.specialRequests && (
                            <div className="mt-4 bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Special Requests</p>
                              <p className="text-sm text-bone/60 mt-1">{booking.specialRequests}</p>
                            </div>
                          )}
                          {booking.notes && (
                            <div className="mt-3 bg-gold/5 border border-gold/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Notes</p>
                              <p className="text-sm text-bone/60 mt-1">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════ TOUR BOOKINGS TAB ═══════════════════════════════════ */}
      {activeTab === 'tours' && (
        <div className="space-y-4">
          {/* Filter row */}
          <div className="flex flex-wrap gap-2">
            {tourStatuses.map((s) => (
              <button
                key={s}
                onClick={() => setTourFilter(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  tourFilter === s
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'text-bone/40 border border-bone/10 hover:text-bone/70 hover:border-bone/20'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {filteredTourBookings.length === 0 ? (
            <div className="dashboard-card rounded-xl p-12 text-center">
              <MapPin size={40} className="mx-auto text-violet-400/20 mb-4" />
              <h3 className="font-serif text-lg text-bone mb-2">No Tour Bookings Found</h3>
              <p className="text-sm text-bone/40">
                {tourFilter !== 'All'
                  ? `No ${tourFilter.toLowerCase()} tour bookings found.`
                  : "You haven't booked any tours yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTourBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl overflow-hidden border border-violet-500/15 bg-gradient-to-br from-violet-950/30 to-charcoal/70 backdrop-blur-sm hover:border-violet-500/30 transition-all duration-300"
                >
                  {/* Left accent bar */}
                  <div className="flex">
                    <div className="w-1 bg-gradient-to-b from-violet-500 via-violet-400/70 to-violet-400/20 flex-shrink-0" />
                    <div className="flex-1">
                      {/* Main Row */}
                      <button
                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        className="w-full px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left hover:bg-violet-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
                            <MapPin size={20} className="text-violet-400/70" />
                          </div>
                          <div>
                            <p className="text-sm text-bone font-medium flex items-center gap-2">
                              {booking.tourName}
                              <span className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={9} className="text-gold/50 fill-gold/50" />
                                ))}
                              </span>
                            </p>
                            <p className="text-xs text-bone/40 mt-0.5">
                              <Clock size={11} className="inline mr-1" />
                              Tour Date: {formatDate(booking.bookingDate)}
                              <span className="text-bone/20 mx-1">•</span>
                              <Users size={11} className="inline mr-1" />
                              {booking.numberOfPeople} {booking.numberOfPeople > 1 ? 'people' : 'person'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <p className="text-sm font-serif text-violet-400">${booking.totalCost.toLocaleString()}</p>
                          <span className={getTourStatusClass(booking.status)}>{booking.status}</span>
                          {expandedId === booking._id
                            ? <ChevronUp size={16} className="text-bone/30" />
                            : <ChevronDown size={16} className="text-bone/30" />}
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {expandedId === booking._id && (
                        <div className="px-5 pb-5 pt-2 border-t border-violet-500/10 animate-fade-in-up">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Booking ID</p>
                              <p className="text-sm text-bone mt-1 font-mono">#{booking._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Booked On</p>
                              <p className="text-sm text-bone mt-1">{formatDate(booking.createdAt)}</p>
                            </div>
                            <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Contact</p>
                              <p className="text-sm text-bone mt-1 flex items-center gap-1.5">
                                <Phone size={13} className="text-violet-400/60" />
                                {booking.phone}
                              </p>
                            </div>
                          </div>
                          {booking.specialRequests && (
                            <div className="mt-4 bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">
                              <p className="text-[10px] uppercase tracking-wider text-bone/40">Special Requests</p>
                              <p className="text-sm text-bone/60 mt-1">{booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
