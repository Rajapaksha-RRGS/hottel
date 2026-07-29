'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  BedDouble,
  Utensils,
  MapPin,
  Printer,
  RefreshCw,
  Clock,
  User,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
} from 'lucide-react';

interface FoodItemDetail {
  foodName: string;
  category: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

interface FoodOrder {
  _id: string;
  orderType: string;
  orderStatus: string;
  totalBill: number;
  createdAt: string;
  items: FoodItemDetail[];
}

interface TourItem {
  _id: string;
  tourName: string;
  numberOfPeople: number;
  bookingDate: string;
  totalCost: number;
  status: string;
}

interface ActiveInvoice {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  paymentStatus: string;
  roomCharge: number;
  foodOrders: FoodOrder[];
  foodTotal: number;
  tours: TourItem[];
  tourTotal: number;
  totalCharges: number;
  advancePaid: number;
  balanceDue: number;
}

interface PaymentHistory {
  bookingId: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  advancePayment: number;
  paymentStatus: string;
  bookingStatus: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const { data: session } = useSession();
  const [activeInvoice, setActiveInvoice] = useState<ActiveInvoice | null>(null);
  const [paymentsHistory, setPaymentsHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const fetchPaymentsData = async (isManualRefresh = false) => {
    if (!session?.user?.email) return;
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams({ email: session.user.email });
      if (session.user.name) params.set('name', session.user.name);

      const res = await fetch(`/api/guest/payments?${params}`);
      const data = await res.json();

      if (data.ok) {
        setActiveInvoice(data.activeInvoice || null);
        setPaymentsHistory(data.payments || []);
      }
    } catch (err) {
      console.error('Failed to fetch payments folio:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData();
  }, [session]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'Served':
        return 'px-3 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'Pending':
        return 'px-3 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
      case 'Billed':
        return 'px-3 py-1 rounded-md text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40';
      default:
        return 'px-3 py-1 rounded-md text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'Partially-Paid':
        return 'px-4 py-1.5 rounded-full text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'Pending':
      default:
        return 'px-4 py-1.5 rounded-full text-sm font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Metrics
  const totalChargesAll = activeInvoice
    ? activeInvoice.totalCharges
    : paymentsHistory.reduce((s, p) => s + p.totalAmount, 0);

  const totalPaidAll = activeInvoice
    ? activeInvoice.advancePaid
    : paymentsHistory.reduce((s, p) => s + p.advancePayment, 0);

  const balanceDueAll = activeInvoice
    ? activeInvoice.balanceDue
    : Math.max(0, totalChargesAll - totalPaidAll);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="dashboard-card rounded-2xl p-6">
              <div className="skeleton h-6 w-36 mb-4" />
              <div className="skeleton h-10 w-48" />
            </div>
          ))}
        </div>
        <div className="dashboard-card rounded-2xl p-8 space-y-4">
          <div className="skeleton h-8 w-64 mb-4" />
          <div className="skeleton h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden border-b border-bone/10 pb-5">
        <div>
          <h2 className="font-serif text-3xl text-bone font-bold tracking-tight">Billing & Payments</h2>
          <p className="text-base text-bone/60 mt-1">
            Real-time live itemized folio for your stay, dining, and activities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchPaymentsData(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-bone/10 hover:bg-bone/20 border border-bone/15 text-bone transition-all"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-gold' : ''} />
            Refresh Folio
          </button>
          {activeInvoice && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gold hover:bg-gold/90 text-charcoal shadow-lg shadow-gold/20 transition-all"
            >
              <Printer size={16} />
              Print Invoice
            </button>
          )}
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden">
        {/* Total Charges */}
        <div className="rounded-2xl p-6 border border-gold/20 bg-gradient-to-br from-charcoal/90 to-charcoal/70 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-bone/60 font-bold uppercase tracking-wider">Total Charges</span>
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/30">
              <DollarSign size={22} className="text-gold" />
            </div>
          </div>
          <p className="text-3xl font-serif text-gold font-bold">{formatCurrency(totalChargesAll)}</p>
          <p className="text-xs text-bone/50 mt-1.5">Room + Dining + Tours</p>
        </div>

        {/* Total Advance Paid */}
        <div className="rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-charcoal/90 to-charcoal/70 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-bone/60 font-bold uppercase tracking-wider">Advance Paid</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp size={22} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-3xl font-serif text-emerald-400 font-bold">{formatCurrency(totalPaidAll)}</p>
          <p className="text-xs text-emerald-400/70 mt-1.5">Deposit Received</p>
        </div>

        {/* Balance Due */}
        <div className="rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-charcoal/90 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-bone/60 font-bold uppercase tracking-wider">Balance Due</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center border border-amber-500/30">
              <CreditCard size={22} className="text-amber-400" />
            </div>
          </div>
          <p className="text-3xl font-serif text-amber-400 font-extrabold">{formatCurrency(balanceDueAll)}</p>
          <p className="text-xs text-amber-400/80 mt-1.5">Payable at Check-out</p>
        </div>
      </div>

      {/* ════════════════════════ LIVE ITEMIZATION FOLIO ════════════════════════ */}
      {activeInvoice ? (
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-b from-charcoal/95 via-charcoal/90 to-charcoal/85 shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Folio Banner */}
          <div className="p-6 md:p-8 border-b border-gold/20 bg-gold/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                  Live Guest Folio
                </span>
                <span className="text-sm text-bone/60 font-mono font-semibold">
                  #FOLIO-{activeInvoice.bookingId.slice(-8).toUpperCase()}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-bone font-bold flex items-center gap-2">
                <User size={22} className="text-gold" />
                {activeInvoice.guestName}
              </h3>
              <div className="text-sm text-bone/60 mt-2 flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5"><Mail size={14} className="text-gold/70" /> {activeInvoice.guestEmail}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} className="text-gold/70" /> {activeInvoice.guestPhone}</span>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2 bg-charcoal/60 p-4 rounded-xl border border-bone/10">
              <div className="flex items-center gap-3">
                <span className="text-sm text-bone/60 font-medium">Payment Status:</span>
                <span className={getPaymentStatusBadge(activeInvoice.paymentStatus)}>
                  {activeInvoice.paymentStatus}
                </span>
              </div>
              <p className="text-base text-bone font-semibold mt-1">
                Room <strong className="text-gold font-bold text-lg">{activeInvoice.roomNumber}</strong> ({activeInvoice.roomType})
              </p>
              <p className="text-xs text-bone/50">
                {formatDate(activeInvoice.checkInDate)} — {formatDate(activeInvoice.checkOutDate)}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* 1. ROOM CHARGES */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-bone/15">
                <BedDouble size={22} className="text-gold" />
                <h4 className="text-lg font-bold text-bone uppercase tracking-wider">1. Room Stay Charges</h4>
              </div>
              <div className="bg-bone/5 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-bone/10">
                <div>
                  <p className="text-base text-bone font-bold">
                    Room {activeInvoice.roomNumber} • {activeInvoice.roomType}
                  </p>
                  <p className="text-sm text-bone/60 mt-1">
                    Stay Duration: {formatDate(activeInvoice.checkInDate)} to {formatDate(activeInvoice.checkOutDate)}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-xl font-serif text-gold font-bold">{formatCurrency(activeInvoice.roomCharge)}</p>
                  <span className="text-xs text-emerald-400 font-semibold">Base Room Rate Charge</span>
                </div>
              </div>
            </div>

            {/* 2. FOOD & DINING ORDERS */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-bone/15">
                <div className="flex items-center gap-2">
                  <Utensils size={22} className="text-amber-400" />
                  <h4 className="text-lg font-bold text-bone uppercase tracking-wider">2. In-Room Dining & Food Charges</h4>
                </div>
                <span className="text-base text-amber-400 font-mono font-bold">
                  Subtotal: {formatCurrency(activeInvoice.foodTotal)}
                </span>
              </div>

              {activeInvoice.foodOrders.length === 0 ? (
                <div className="bg-bone/5 rounded-xl p-6 text-center text-sm text-bone/40 italic">
                  No food orders billed to this room yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {activeInvoice.foodOrders.map((order) => (
                    <div key={order._id} className="bg-bone/5 rounded-xl p-5 border border-bone/10 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-bone/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm text-gold font-bold">Order #{order._id.slice(-6).toUpperCase()}</span>
                          <span className={getOrderStatusBadge(order.orderStatus)}>{order.orderStatus}</span>
                        </div>
                        <span className="text-xs text-bone/50">{formatDate(order.createdAt)}</span>
                      </div>

                      {/* Items list */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-bone/5 last:border-none">
                            <div className="flex items-center gap-3">
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold text-xs">
                                {item.quantity}x
                              </span>
                              <span className="text-bone font-medium text-base">{item.foodName}</span>
                              <span className="text-xs text-bone/40">({item.category})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-bone font-mono font-bold text-base">{formatCurrency(item.subTotal)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-bone/10 flex justify-end text-sm">
                        <span className="text-bone/60 mr-2 font-medium">Order Subtotal:</span>
                        <strong className="text-amber-400 font-mono font-bold text-base">{formatCurrency(order.totalBill)}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. CONFIRMED TOUR PACKAGES */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-bone/15">
                <div className="flex items-center gap-2">
                  <MapPin size={22} className="text-violet-400" />
                  <h4 className="text-lg font-bold text-bone uppercase tracking-wider">3. Confirmed Tour Packages</h4>
                </div>
                <span className="text-base text-violet-400 font-mono font-bold">
                  Subtotal: {formatCurrency(activeInvoice.tourTotal)}
                </span>
              </div>

              {activeInvoice.tours.length === 0 ? (
                <div className="bg-bone/5 rounded-xl p-6 text-center text-sm text-bone/40 italic">
                  No confirmed tour package charges for this stay.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeInvoice.tours.map((tour) => (
                    <div key={tour._id} className="bg-violet-950/25 border border-violet-500/25 rounded-xl p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-base text-bone font-bold">{tour.tourName}</p>
                        <p className="text-xs text-bone/60 mt-1">
                          Date: {formatDate(tour.bookingDate)} • {tour.numberOfPeople} guest(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-serif text-violet-400 font-bold">{formatCurrency(tour.totalCost)}</p>
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {tour.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 🧾 FINAL GRAND SUMMARY */}
            <div className="pt-6 border-t border-gold/20">
              <div className="bg-gradient-to-br from-gold/15 via-charcoal to-charcoal border border-gold/30 rounded-2xl p-6 md:p-8 space-y-4">
                <div className="flex justify-between text-sm text-bone/70">
                  <span>1. Room Stay Subtotal:</span>
                  <span className="font-mono text-bone font-semibold">{formatCurrency(activeInvoice.roomCharge)}</span>
                </div>
                <div className="flex justify-between text-sm text-bone/70">
                  <span>2. In-Room Dining Orders Subtotal:</span>
                  <span className="font-mono text-bone font-semibold">{formatCurrency(activeInvoice.foodTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-bone/70">
                  <span>3. Confirmed Tour Packages Subtotal:</span>
                  <span className="font-mono text-bone font-semibold">{formatCurrency(activeInvoice.tourTotal)}</span>
                </div>

                <div className="pt-4 border-t border-bone/15 flex justify-between text-base text-bone font-bold">
                  <span>Total Incurred Bill:</span>
                  <span className="font-mono text-gold text-lg">{formatCurrency(activeInvoice.totalCharges)}</span>
                </div>

                <div className="flex justify-between text-sm text-emerald-400 font-semibold">
                  <span>Less Advance Deposit Received:</span>
                  <span className="font-mono">-{formatCurrency(activeInvoice.advancePaid)}</span>
                </div>

                <div className="pt-4 border-t border-gold/30 flex items-center justify-between text-xl">
                  <span className="font-serif text-bone font-bold">Net Balance Payable:</span>
                  <span className="font-serif text-amber-400 font-extrabold text-2xl drop-shadow-md">
                    {formatCurrency(activeInvoice.balanceDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card rounded-2xl p-12 text-center">
          <FileText size={48} className="mx-auto text-gold/25 mb-4" />
          <h3 className="font-serif text-xl text-bone font-bold mb-2">No Active In-House Stay</h3>
          <p className="text-base text-bone/50 max-w-lg mx-auto">
            You do not currently have an active checked-in room stay. Once checked-in, your live folio and room charges will appear here in real time.
          </p>
        </div>
      )}

      {/* ════════════════════════ PAST PAYMENT HISTORY ════════════════════════ */}
      {paymentsHistory.length > 0 && (
        <div className="dashboard-card rounded-2xl overflow-hidden print:hidden border border-bone/10">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-bone/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock size={22} className="text-gold" />
              <div>
                <h3 className="font-serif text-lg text-bone font-bold">Past Stays & Payment History</h3>
                <p className="text-xs text-bone/50">{paymentsHistory.length} previous record(s)</p>
              </div>
            </div>
            {showHistory ? <ChevronUp size={20} className="text-bone/50" /> : <ChevronDown size={20} className="text-bone/50" />}
          </button>

          {showHistory && (
            <div className="divide-y divide-bone/10 border-t border-bone/10">
              {paymentsHistory.map((p) => (
                <div key={p.bookingId} className="p-6 hover:bg-bone/5 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-base text-bone font-bold">
                        {p.roomType} • Room {p.roomNumber}
                      </p>
                      <p className="text-xs text-bone/50 mt-1">
                        {formatDate(p.checkInDate)} — {formatDate(p.checkOutDate)}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="md:text-right">
                        <p className="text-base font-serif text-gold font-bold">{formatCurrency(p.totalAmount)}</p>
                        <p className="text-xs text-emerald-400">Paid: {formatCurrency(p.advancePayment)}</p>
                      </div>
                      <span className={getPaymentStatusBadge(p.paymentStatus)}>{p.paymentStatus}</span>
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
