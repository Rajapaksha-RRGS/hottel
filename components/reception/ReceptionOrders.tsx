'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CheckCircle, Clock, RefreshCcw, Loader2, BedDouble, Grid3x3, XCircle, AlertTriangle } from 'lucide-react';
import { calculateAveragePrepTime } from '@/lib/prepTimeParser';

export default function ReceptionOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'serve' | 'cancel' | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
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
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: 'Served' | 'Cancelled') => {
    const type = status === 'Served' ? 'serve' : 'cancel';
    setActionId(orderId);
    setActionType(type);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        setConfirmCancel(null);
      } else {
        alert(`Error: ${json.message || 'Failed to update order'}`);
      }
    } catch (err) {
      console.error(`Error updating order:`, err);
      alert('Failed to update order. Please try again.');
    } finally {
      setActionId(null);
      setActionType(null);
    }
  };

  const getUrgency = (prepTime: number) => {
    if (prepTime >= 25) return { border: 'rgba(239,68,68,0.4)', badge: 'bg-red-500/15 text-red-400', dot: 'bg-red-500' };
    if (prepTime >= 15) return { border: 'rgba(251,191,36,0.3)', badge: 'bg-amber-500/15 text-amber-400', dot: 'bg-amber-500' };
    return { border: 'rgba(255,255,255,0.06)', badge: 'bg-emerald-500/15 text-emerald-400', dot: 'bg-emerald-500' };
  };

  if (loading && orders.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-60 rounded-2xl animate-pulse" style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.06)' }} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Kitchen Orders</h2>
          <p className="text-sm text-white/35 mt-1">
            {orders.length === 0 ? 'All caught up — no pending orders' : `${orders.length} order${orders.length === 1 ? '' : 's'} waiting`}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Order Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.length === 0 ? (
          <div className="col-span-full py-20 text-center rounded-2xl" style={{ background: '#151515', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Coffee className="w-12 h-12 mx-auto mb-4 text-white/15" />
            <p className="text-white/35 font-medium text-base">No pending orders at the moment.</p>
            <p className="text-white/20 text-sm mt-1">New orders will appear here automatically.</p>
          </div>
        ) : (
          orders.map((order: any, idx: number) => {
            const avgPrepTime = calculateAveragePrepTime(order.items.map((item: any) => item.foodItem) || []);
            const urgency = getUrgency(avgPrepTime);
            const isRoom = !!order.roomBookingId;
            const isActioning = actionId === order._id;
            const isCancelConfirm = confirmCancel === order._id;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="relative rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: '#151515',
                  border: `1px solid ${urgency.border}`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                }}
              >
                {/* Ticket header */}
                <div className="flex items-start justify-between p-5 pb-4" style={{ borderBottom: '1px dashed rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {isRoom ? (
                        <BedDouble className="w-5 h-5 text-sky-400" />
                      ) : (
                        <Grid3x3 className="w-5 h-5 text-violet-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-[16px] leading-tight">
                        {isRoom ? `Room ${order.roomBookingId?.room?.roomNumber || 'N/A'}` : `Table ${order.tableNumber || 'N/A'}`}
                      </h3>
                      <p className="text-sm text-white/35 mt-0.5 font-medium">
                        {isRoom ? (order.roomBookingId?.guestName || 'Guest') : 'Dine-in'}
                      </p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg ${urgency.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot} animate-pulse`} />
                    Pending
                  </span>
                </div>

                {/* Prep time */}
                {avgPrepTime > 0 && (
                  <div className="mx-5 mt-4 px-3.5 py-2.5 rounded-xl flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <Clock className="w-4 h-4 text-white/30" />
                    <span className="text-sm font-semibold text-white/50">~{avgPrepTime} min prep</span>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 px-5 py-4 space-y-2">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/60 font-medium">
                        <span className="text-white font-bold">{item.quantity}×</span> {item.foodItem?.name || 'Unknown Item'}
                      </span>
                      <span className="text-white/35 font-semibold">${item.subTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-5 pt-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-sm font-medium">Order Total</span>
                    <span className="text-emerald-400 font-bold text-xl">${order.totalBill.toFixed(2)}</span>
                  </div>

                  {/* Cancel confirmation */}
                  <AnimatePresence>
                    {isCancelConfirm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium"
                        style={{ border: '1px solid rgba(239,68,68,0.2)' }}
                      >
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span className="flex-1">Cancel this order?</span>
                        <button
                          onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                          disabled={isActioning}
                          className="cursor-pointer px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all"
                        >
                          {isActioning && actionType === 'cancel' ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setConfirmCancel(null)}
                          className="cursor-pointer px-3 py-1.5 rounded-lg text-white/40 text-xs font-bold hover:text-white transition-all"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          No
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  {!isCancelConfirm && (
                    <div className="flex gap-2.5">
                      {/* Cancel */}
                      <button
                        onClick={() => setConfirmCancel(order._id)}
                        disabled={isActioning}
                        className="cursor-pointer flex items-center justify-center gap-2 flex-1 py-3 rounded-xl text-sm font-bold text-red-400/70 hover:text-red-400 transition-all active:scale-95 disabled:opacity-50"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>

                      {/* Mark Served */}
                      <button
                        onClick={() => updateOrderStatus(order._id, 'Served')}
                        disabled={isActioning}
                        className="cursor-pointer flex items-center justify-center gap-2 flex-[2] py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                        style={{
                          background: isActioning && actionType === 'serve' ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)',
                          boxShadow: isActioning ? 'none' : '0 4px 16px rgba(16,185,129,0.3)',
                        }}
                      >
                        {isActioning && actionType === 'serve' ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Marking...</>
                        ) : (
                          <><CheckCircle className="w-4 h-4" /> Mark Served</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
