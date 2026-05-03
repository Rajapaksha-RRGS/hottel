/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CATEGORIES, CAT_ITEMS, TABLES } from "../constants";
import { OrderItem } from "../types";

interface MenuSectionProps {
  search: string;
  setSearch: (val: string) => void;
  activeCat: string;
  setActiveCat: (id: string) => void;
  order: OrderItem[];
  addItem: (item: any) => void;
  changeQty: (id: number, delta: number) => void;
  activeTable: { num: number; guest: string };
  setActiveTable: (t: any) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  search,
  setSearch,
  activeCat,
  setActiveCat,
  order,
  addItem,
  changeQty,
  activeTable,
  setActiveTable,
}) => {
  const filteredItems = (CAT_ITEMS[activeCat] || []).filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCategoryData = CATEGORIES.find((c) => c.id === activeCat);
  const catColor = activeCategoryData?.color || "#fce4ec";

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search Header */}
      <div className="p-[14px_16px_10px] shrink-0">
        <div className="flex items-center gap-2 bg-[#22222a] border border-[#2e2e3a] rounded-xl p-[8px_14px]">
          <span className="text-[13px] opacity-50">🔍</span>
          <input
            className="bg-transparent border-none outline-none text-[#f0ede8] text-[13px] flex-1 font-sans"
            placeholder="Search for food or drinks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-4 gap-2.5 p-[0_14px_10px] shrink-0">
        {CATEGORIES.map((c) => (
          <motion.div
            key={c.id}
            whileTap={{ scale: 0.95 }}
            className={`rounded-2xl p-[14px_12px_12px] cursor-pointer transition-all duration-180 min-h-[90px] flex flex-col justify-end transition-transform shadow-md ${
              activeCat === c.id ? "outline-[2.5px] outline-[#fff] scale-[1.03]" : "outline-[2.5px] outline-transparent scale-100"
            }`}
            style={{ background: c.color }}
            onClick={() => setActiveCat(c.id)}
          >
            <div className="text-[20px] mb-1" style={{ color: c.iconColor }}>{c.icon}</div>
            <div className="text-[14px] font-bold text-[#1a1a1f] leading-tight">{c.label}</div>
            <div className="text-[11px] text-[#3a3a4a] mt-0.5">{c.count} items</div>
          </motion.div>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-3 xl:grid-cols-4 gap-2 p-[0_14px_8px] overflow-y-auto flex-1">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const inOrder = order.find((o) => o.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="border-[1.5px] rounded-linear p-[10px_10px_8px] flex flex-col gap-1 rounded-2xl"
                style={{ background: `${catColor}22`, borderColor: `${catColor}44` }}
              >
                <div className="text-[9.5px] text-[#6a6a7a] tracking-wider uppercase">Signature → Kitchen</div>
                <div className="text-[13px] font-semibold text-[#f0ede8] leading-tight flex-1">{item.name}</div>
                <div className={`text-[13px] font-bold ${catColor === "#c8f5e1" || catColor === "#c8e6c9" ? "text-[#2e7d32]" : "text-[#d4537e]"}`}>
                  ${item.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    className="w-8 h-8 rounded-lg bg-[#2e2e3a] border border-[#3a3a4a] text-[#f0ede8] text-lg flex items-center justify-center cursor-pointer transition-all hover:bg-[#3a3a4a]"
                    onClick={() => inOrder ? changeQty(item.id, -1) : null}
                  >
                    −
                  </button>
                  <span className="text-sm font-bold min-w-[18px] text-center">{inOrder ? inOrder.qty : 0}</span>
                  <button
                    className="w-8 h-8 rounded-lg bg-[#3a3a4a] border border-[#555] text-[#f0ede8] text-lg flex items-center justify-center cursor-pointer transition-all hover:brightness-110"
                    onClick={() => addItem(item)}
                  >
                    +
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Bottom Table Chips */}
      <footer className="flex gap-2 p-[8px_14px_10px] border-t border-[#2a2a34] shrink-0 overflow-x-auto">
        {TABLES.map((t, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl min-w-[180px] cursor-pointer transition-all border-[1.5px] ${
              t.num === activeTable.num && t.guest === activeTable.guest
                ? "bg-[#2a2a36] border-[#f0ede8]"
                : "bg-[#22222a] border-[#2e2e3a] opacity-60"
            }`}
            onClick={() => setActiveTable({ num: t.num, guest: t.guest })}
          >
            <div className="w-8 h-8 bg-[#32324a] rounded-lg flex items-center justify-center font-bold text-xs shrink-0">T{t.num}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#f0ede8]">{t.guest}</div>
              <div className="text-[10px] text-[#6a6a7a] mt-0.5">{t.items} items • Kitchen</div>
            </div>
            {t.status === "process" && (
              <div className="bg-[#1d9e7522] text-[#1d9e75] text-[9px] font-bold px-[7px] py-[2px] rounded-lg border border-[#1d9e7544] shrink-0">In process</div>
            )}
          </div>
        ))}
      </footer>
    </div>
  );
};
