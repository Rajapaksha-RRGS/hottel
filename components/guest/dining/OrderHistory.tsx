'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ChevronDown, ChevronUp } from 'lucide-react';

export interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  totalBill: number;
  items: {
    foodItem: { name: string; category: string; image: string; _id: string };
    quantity: number;
    subTotal: number;
  }[];
}

interface OrderHistoryProps {
  orders: Order[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Served:  'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Billed:  'text-sky-400 bg-sky-400/10 border-sky-400/20',
};

export default function OrderHistory({ orders, expandedId, onToggle }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div
        className="text-center py-20 rounded-2xl border border-bone/5"
        style={{ background: 'rgba(26,26,26,0.5)' }}
      >
        <Utensils className="mx-auto text-bone/15 mb-4" size={44} />
        <p className="text-bone/40 text-sm">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isEx = expandedId === order._id;
        const date = new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        });
        const sc = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.Pending;

        return (
          <div
            key={order._id}
            className="rounded-2xl overflow-hidden border border-bone/10 transition-all"
            style={{ background: 'rgba(26,26,26,0.65)', backdropFilter: 'blur(12px)' }}
          >
            {/* Summary row */}
            <div
              onClick={() => onToggle(order._id)}
              className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-bone/5 transition-colors gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <Utensils size={16} />
                </div>
                <div>
                  <p className="text-bone font-medium text-sm">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-bone/40 text-xs">{date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sc}`}>
                  {order.orderStatus}
                </span>
                <p className="text-gold font-serif text-lg">${order.totalBill.toFixed(2)}</p>
                {isEx
                  ? <ChevronUp className="text-bone/30" size={18} />
                  : <ChevronDown className="text-bone/30" size={18} />
                }
              </div>
            </div>

            {/* Expanded items */}
            <AnimatePresence>
              {isEx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-bone/5 overflow-hidden"
                >
                  <div className="p-4 bg-black/20 space-y-3">
                    {order.items.map((it, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm py-1.5 border-b border-bone/5 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          {it.foodItem?.image ? (
                            <img
                              src={it.foodItem.image}
                              alt={it.foodItem.name}
                              className="w-9 h-9 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-bone/10" />
                          )}
                          <div>
                            <p className="text-bone/80 text-sm">{it.foodItem?.name || 'Item'}</p>
                            <p className="text-bone/35 text-xs">Qty: {it.quantity}</p>
                          </div>
                        </div>
                        <p className="text-gold/80 font-medium">${it.subTotal.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
