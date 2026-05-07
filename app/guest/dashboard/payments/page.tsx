'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CreditCard, DollarSign, TrendingUp } from 'lucide-react';

interface Payment {
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`/api/guest/payments?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        if (data.ok) setPayments(data.payments);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchPayments();
  }, [session]);

  const getPaymentClass = (s: string) => {
    const map: Record<string, string> = {
      Pending: 'status-badge payment-pending',
      'Partially-Paid': 'status-badge payment-partial',
      Paid: 'status-badge payment-paid',
    };
    return map[s] || 'status-badge';
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const totalSpent = payments.reduce((s, p) => s + p.totalAmount, 0);
  const totalPaid = payments.reduce((s, p) => s + p.advancePayment, 0);

  if (loading) return (
    <div className="space-y-4 animate-fade-in-up">
      {[...Array(3)].map((_, i) => <div key={i} className="dashboard-card rounded-xl p-5"><div className="skeleton h-5 w-48 mb-3" /><div className="skeleton h-4 w-32" /></div>)}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center"><DollarSign size={20} className="text-gold" /></div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Total Charges</p>
          </div>
          <p className="text-2xl font-serif text-bone">${totalSpent.toLocaleString()}</p>
        </div>
        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><TrendingUp size={20} className="text-green-400" /></div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Total Paid</p>
          </div>
          <p className="text-2xl font-serif text-green-400">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="dashboard-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center"><CreditCard size={20} className="text-amber-400" /></div>
            <p className="text-xs text-bone/40 uppercase tracking-wider">Balance Due</p>
          </div>
          <p className="text-2xl font-serif text-amber-400">${(totalSpent - totalPaid).toLocaleString()}</p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="dashboard-card rounded-xl p-12 text-center">
          <CreditCard size={40} className="mx-auto text-bone/15 mb-4" />
          <h3 className="font-serif text-lg text-bone mb-2">No Payment Records</h3>
          <p className="text-sm text-bone/40">Payment records will appear here once you make a booking.</p>
        </div>
      ) : (
        <div className="dashboard-card rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-bone/10"><h2 className="font-serif text-lg text-bone">Payment History</h2></div>
          <div className="divide-y divide-bone/5">
            {payments.map((p) => (
              <div key={p.bookingId} className="px-6 py-4 hover:bg-bone/5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-bone font-medium">{p.roomType} • Room {p.roomNumber}</p>
                    <p className="text-xs text-bone/40 mt-0.5">{fmt(p.checkInDate)} — {fmt(p.checkOutDate)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-serif text-gold">${p.totalAmount.toLocaleString()}</p>
                      <p className="text-[11px] text-green-400/70">Paid: ${p.advancePayment.toLocaleString()}</p>
                    </div>
                    <span className={getPaymentClass(p.paymentStatus)}>{p.paymentStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
