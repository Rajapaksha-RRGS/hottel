/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderItem } from "../../../types";

interface OrderPanelProps {
  activeTable: { num: number; guest: string };
  order: OrderItem[];
  changeQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  payMethod: string;
  setPayMethod: (m: string) => void;
  cancelOrder: () => void;
  placeOrder: () => void;
}

export const OrderPanel: React.FC<OrderPanelProps> = ({
  activeTable,
  order,
  changeQty,
  removeItem,
  subtotal,
  tax,
  total,
  payMethod,
  setPayMethod,
  cancelOrder,
  placeOrder,
}) => {
  return (
    <aside className="w-[320px] bg-[#141418] flex flex-col h-screen shrink-0 border-l border-[#2a2a34]">
      <div className="flex justify-between items-start p-[18px_16px_12px] border-b border-[#1e1e28]">
        <div>
          <div className="text-[20px] font-bold text-[#f0ede8]">Table {activeTable.num}</div>
          <div className="text-[12px] text-[#6a6a7a] mt-0.5">Customer: {activeTable.guest}</div>
        </div>
        <button className="bg-[#22222a] border border-[#2e2e3a] rounded-lg w-8 h-8 flex items-center justify-center cursor-pointer text-[#f0ede8] transition-all hover:bg-[#2a2a34]">✏</button>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5">
        <AnimatePresence mode="popLayout">
          {order.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#3a3a4a] text-[12px] py-10"
            >
              No items yet — tap menu to add
            </motion.div>
          ) : (
            order.map((o, idx) => (
              <motion.div
                key={o.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, filter: "blur(4px)" }}
                className="flex items-center gap-2 p-2 rounded-xl mb-1 bg-[#1e1e28] border border-[#2a2a34] shadow-sm"
              >
                <div className="w-6 h-6 rounded-full bg-[#2e2e42] flex items-center justify-center text-[10px] font-bold text-[#9090aa] shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#d0cdc8] leading-tight flex items-center gap-1.5 flex-wrap">
                    {o.name}
                    <span className="text-[10px] text-[#8888aa] bg-[#2a2a3a] px-1.5 py-0.5 rounded">x{o.qty}</span>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <button className="w-5 h-5 rounded-md bg-[#2e2e42] border border-[#3a3a50] text-[#c0c0d8] text-[13px] flex items-center justify-center cursor-pointer hover:bg-[#3a3a50]" onClick={() => changeQty(o.id, -1)}>−</button>
                    <button className="w-5 h-5 rounded-md bg-[#2e2e42] border border-[#3a3a50] text-[#c0c0d8] text-[13px] flex items-center justify-center cursor-pointer hover:bg-[#3a3a50]" onClick={() => changeQty(o.id, 1)}>+</button>
                  </div>
                </div>
                <div className="text-[12px] font-bold text-[#f0ede8] min-w-[46px] text-right">
                  ${(o.price * o.qty).toFixed(2)}
                </div>
                <button
                  className="bg-transparent border-none cursor-pointer text-[13px] opacity-40 hover:opacity-100 transition-opacity p-0.5"
                  onClick={() => removeItem(o.id)}
                >
                  🗑
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4 p-6 shrink-0">
        <div className="bg-[#1e1e28] p-4 rounded-2xl border border-[#2a2a38] space-y-2">
          <div className="flex justify-between text-xs text-[#6a6a7a]">
            <span>Subtotal</span>
            <span className="text-[#a0a0b8] font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#6a6a7a]">
            <span>Tax 10%</span>
            <span className="text-[#a0a0b8] font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-dashed border-[#3a3a48] flex justify-between items-center">
            <span className="text-sm font-bold text-[#f0ede8]">Total</span>
            <span className="text-2xl font-bold text-[#f0ede8]">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[["cash", "$", "Cash"], ["card", "💳", "Card"], ["wallet", "⊞", "Wallet"]].map(([m, ico, label]) => (
            <button
              key={m}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all border-[1.5px] ${
                payMethod === m 
                  ? "bg-[#f0ede8] text-[#1a1a1f] border-[#f0ede8] font-bold" 
                  : "bg-[#22222a] text-[#6a6a7a] border-[#2e2e3a] hover:bg-[#2a2a34]"
              }`}
              onClick={() => setPayMethod(m)}
            >
              <span className="text-lg">{ico}</span>
              <span className="text-[9px] uppercase tracking-tighter">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button className="w-full p-2.5 rounded-xl bg-[#2a2a34] border border-[#3a3a48] text-[#9090a8] text-[13px] font-bold cursor-pointer hover:bg-[#33333f]" onClick={cancelOrder}>Cancel Order</button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full p-4 rounded-xl bg-[#f0ede8] text-[#1a1a1f] text-sm font-bold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={placeOrder}
            disabled={order.length === 0}
          >
            Place Order • Kitchen
          </motion.button>
        </div>
      </div>
    </aside>
  );
};
