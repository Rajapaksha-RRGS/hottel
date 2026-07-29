'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Utensils, CheckCircle, Clock, RefreshCcw, Loader } from 'lucide-react';
import { mockReceptionOrdersData } from '@/lib/mocks/receptionOrdersMock';
import { calculateAveragePrepTime } from '@/lib/prepTimeParser';

export default function ReceptionOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-52 bg-obsidian-card rounded-2xl animate-pulse" style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Food &amp; Beverage Orders</h2>
          <p className="text-sm text-slate-400 mt-1">Manage pending orders for guests</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all duration-300 text-sm font-medium border border-slate-700"
          style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
        >
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Order Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div
            className="col-span-full p-12 text-center bg-luxury-card rounded-lg relative overflow-hidden border border-slate-700"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-neon-cyan/[0.03] to-transparent rounded-bl-full" />
            <Coffee className="w-12 h-12 mx-auto mb-3 text-slate-500" />
            <p className="text-slate-400">No pending orders at the moment.</p>
          </div>
        ) : (
          orders.map((order: any, idx: number) => {
            const avgPrepTime = calculateAveragePrepTime(order.items.map((item: any) => item.foodItem) || []);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="group relative bg-luxury-card rounded-lg p-5 overflow-hidden transition-all duration-500 hover:shadow-lg border border-slate-700"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
              >
                {/* Top-right glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/[0.05] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Order Header */}
                <div className="relative flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center"
                      style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Utensils className="w-4 h-4 text-dataViz-orange" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Room {order.roomBookingId?.room?.roomNumber || 'N/A'}</h3>
                      <p className="text-xs text-slate-400">{order.roomBookingId?.guestName || 'Guest'}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                </div>

                {/* Average Prep Time Display */}
                {avgPrepTime > 0 && (
                  <div className="relative mb-3 p-2.5 bg-sky-500/10 rounded-lg border border-sky-500/20 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-semibold text-sky-300">~{avgPrepTime} min wait</span>
                  </div>
                )}

                {/* Items */}
                <div className="relative space-y-2 mb-4 pt-4 border-t border-slate-700">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-400">{item.quantity}x {item.foodItem?.name || 'Unknown Item'}</span>
                      <span className="text-slate-300 font-medium">${item.subTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="relative flex justify-between items-center pt-4 border-t border-slate-700">
                  <span className="text-white font-bold text-lg">${order.totalBill.toFixed(2)}</span>
                  <button
                    onClick={() => markAsServed(order._id)}
                    disabled={marking === order._id}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-3.5 py-1.5 rounded-lg transition-all duration-300 text-sm font-semibold"
                    style={{ boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)' }}
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
