'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Utensils, X } from 'lucide-react';
import type { CartItem } from './MenuCard';

interface CartPanelProps {
  cart: CartItem[];
  cartTotal: number;
  isSubmitting: boolean;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onPlaceOrder: () => void;
  onClose: () => void;
  show: boolean;
}

export default function CartPanel({
  cart, cartTotal, isSubmitting,
  onUpdateQty, onRemove, onPlaceOrder, onClose, show,
}: CartPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          className="hidden xl:block"
        >
          <div
            className="sticky top-24 rounded-2xl border border-gold/20 overflow-hidden"
            style={{ background: 'rgba(26,26,26,0.85)', backdropFilter: 'blur(20px)' }}
          >
            {/* Header */}
            <div className="p-5 border-b border-bone/10 flex items-center justify-between">
              <h2 className="text-lg font-serif text-gold flex items-center gap-2">
                <ShoppingCart size={18} /> Your Order
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer text-bone/30 hover:text-bone transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 px-6">
                <ShoppingCart className="mx-auto text-bone/15 mb-3" size={32} />
                <p className="text-bone/35 text-sm">Your cart is empty.</p>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="max-h-[42vh] overflow-y-auto dashboard-scroll p-4 space-y-3">
                  {cart.map((c) => (
                    <div
                      key={c.foodItem._id}
                      className="flex gap-3 items-center p-3 rounded-xl bg-bone/5 border border-bone/[0.08]"
                    >
                      {c.foodItem.image ? (
                        <img
                          src={c.foodItem.image}
                          alt={c.foodItem.name}
                          className="w-11 h-11 rounded-lg object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-bone/10 flex items-center justify-center shrink-0">
                          <Utensils size={14} className="text-bone/30" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-bone text-sm font-medium truncate">{c.foodItem.name}</p>
                        <p className="text-gold/80 text-xs">
                          ${c.foodItem.prices.normal.toFixed(2)} × {c.quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onUpdateQty(c.foodItem._id, -1)}
                          className="cursor-pointer w-6 h-6 rounded-full bg-bone/10 text-bone/60 hover:text-bone flex items-center justify-center transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-bone text-xs w-4 text-center font-medium">
                          {c.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(c.foodItem._id, 1)}
                          className="cursor-pointer w-6 h-6 rounded-full bg-bone/10 text-bone/60 hover:text-bone flex items-center justify-center transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => onRemove(c.foodItem._id)}
                          className="cursor-pointer w-6 h-6 rounded-full bg-red-500/10 text-red-400/60 hover:text-red-400 flex items-center justify-center transition-colors ml-1"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-bone/10 space-y-3">
                  <div className="flex justify-between text-sm text-bone/70">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-bone/40">
                    <span>Room Delivery</span>
                    <span>Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-gold border-t border-bone/10 pt-3">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={onPlaceOrder}
                    disabled={isSubmitting}
                    className="cursor-pointer w-full py-3 bg-gold text-charcoal rounded-xl font-semibold tracking-wide text-sm uppercase hover:shadow-[0_0_24px_rgba(197,160,89,0.4)] transition-all disabled:opacity-50 mt-1"
                  >
                    {isSubmitting ? 'Placing...' : 'Place Order'}
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
