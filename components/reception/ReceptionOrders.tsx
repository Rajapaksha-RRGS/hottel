'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Utensils, CheckCircle, Clock, RefreshCcw, Loader, BedDouble, Grid3x3 } from 'lucide-react';
import { mockReceptionOrdersData } from '@/lib/mocks/receptionOrdersMock';
import { calculateAveragePrepTime } from '@/lib/prepTimeParser';

export default function ReceptionOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30s — a kitchen board should never look stale
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reception/stats');
      const json = await res.json();
      if (json.success && json.data.pendingFoodOrders?.length > 0) {
        setOrders(json.data.pendingFoodOrders);
      } else {
        setOrders(mockReceptionOrdersData.data?.pendingFoodOrders || []);
      }
    } catch (err) {
      console.error(err);
      setOrders(mockReceptionOrdersData.data?.pendingFoodOrders || []);
    }
    setLoading(false);
  };

  const markAsServed = async (orderId: string) => {
    setMarking(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: 'Served' }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        console.log('✅ Order marked as served:', orderId);
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        const errorMsg = json.message || 'Failed to update order';
        console.error('❌ Error:', errorMsg);
        alert(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('❌ Error marking order as served:', err);
      alert('Failed to mark order as served. Please try again.');
    } finally {
      setMarking(null);
    }
  };

  // Urgency color coding — the longer an order waits, the louder the card gets.
  // This is the core scanability trick real KDS boards use.
  const getUrgency = (prepTime: number) => {
    if (prepTime >= 25) return { border: 'border-red-500', badge: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500' };
    if (prepTime >= 15) return { border: 'border-amber-500', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-500' };
    return { border: 'border-slate-800', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500' };
  };

  if (loading && orders.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-56 bg-slate-900 border-2 border-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Kitchen Orders</h2>
          <p className="text-sm text-slate-400 mt-1">
            {orders.length === 0 ? 'All caught up' : `${orders.length} order${orders.length === 1 ? '' : 's'} waiting`}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-bold border-2 border-slate-800 active:scale-95"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Order Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.length === 0 ? (
          <div className="col-span-full p-14 text-center bg-slate-900 rounded-2xl border-2 border-slate-800">
            <Coffee className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 font-medium">No pending orders at the moment.</p>
          </div>
        ) : (
          orders.map((order: any, idx: number) => {
            const avgPrepTime = calculateAveragePrepTime(order.items.map((item: any) => item.foodItem) || []);
            const urgency = getUrgency(avgPrepTime);
            const isRoom = !!order.roomBookingId;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`relative bg-slate-900 rounded-2xl overflow-hidden border-2 ${urgency.border} flex flex-col`}
              >
                {/* Ticket header — table/room + live urgency badge */}
                <div className="flex items-start justify-between p-4 pb-3 border-b-2 border-dashed border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {isRoom ? (
                        <BedDouble className="w-5 h-5 text-sky-400" />
                      ) : (
                        <Grid3x3 className="w-5 h-5 text-violet-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-extrabold text-base leading-tight">
                        {isRoom ? `Room ${order.roomBookingId?.room?.roomNumber || 'N/A'}` : `Table ${order.tableNumber || 'N/A'}`}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {isRoom ? (order.roomBookingId?.guestName || 'Guest') : 'Dine-in'}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1.5 rounded-lg border ${urgency.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot} animate-pulse`} />
                    Pending
                  </span>
                </div>

                {/* Prep time */}
                {avgPrepTime > 0 && (
                  <div className="mx-4 mt-3 px-3 py-2 bg-slate-800/70 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-300">~{avgPrepTime} min prep</span>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 px-4 py-3 space-y-1.5">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-300 font-medium">
                        <span className="text-white font-extrabold">{item.quantity}×</span> {item.foodItem?.name || 'Unknown Item'}
                      </span>
                      <span className="text-slate-400 font-semibold">${item.subTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer — big total + big action button */}
                <div className="flex items-center justify-between gap-3 p-4 pt-3 border-t-2 border-slate-800 bg-slate-800/30">
                  <span className="text-emerald-400 font-extrabold text-xl">${order.totalBill.toFixed(2)}</span>
                  <button
                    onClick={() => markAsServed(order._id)}
                    disabled={marking === order._id}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl transition-all text-sm font-extrabold active:scale-95"
                  >
                    {marking === order._id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {marking === order._id ? 'Marking...' : 'Mark Served'}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
