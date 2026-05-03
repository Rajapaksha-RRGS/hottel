"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect , useState } from "react";
import { Category } from "@/types";
import { MenuItem } from "@/types";

// --- 1. අවශ්‍ය Types මෙතනම Define කරමු ---
interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

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

export const CATEGORIES: Category[] = [
  { id: "breakfast", label: "Breakfast", count: 13, icon: "☕", color: "#c8e6c9", iconColor: "#2e7d32" },
  { id: "soups", label: "Soups", count: 8, icon: "🍲", color: "#e1bee7", iconColor: "#6a1b9a" },
  { id: "pasta", label: "Pasta", count: 10, icon: "🍝", color: "#b3e5fc", iconColor: "#0277bd" },
  { id: "sushi", label: "Sushi", count: 15, icon: "🍣", color: "#d1c4e9", iconColor: "#4527a0" },
  { id: "maincourse", label: "Main course", count: 7, icon: "🍽", color: "#fce4ec", iconColor: "#880e4f" },
  { id: "desserts", label: "Desserts", count: 9, icon: "🧁", color: "#fff8e1", iconColor: "#e65100" },
  { id: "drinks", label: "Drinks", count: 11, icon: "☕", color: "#fce4ec", iconColor: "#880e4f" },
  { id: "alcohol", label: "Alcohol", count: 12, icon: "🍷", color: "#c8f5e1", iconColor: "#1b5e20" },
];


export const CAT_ITEMS: Record<string, MenuItem[]> = {
  breakfast: [
    { id: 101, name: "Eggs Benedict", price: 12.50 },
    { id: 102, name: "Avocado Toast", price: 9.00 },
    { id: 103, name: "French Croissant", price: 5.50 },
    { id: 104, name: "Pancake Stack", price: 10.00 },
    { id: 105, name: "Full English", price: 14.00 },
    { id: 106, name: "Granola Bowl", price: 8.00 },
    { id: 107, name: "Smoked Salmon Bagel", price: 13.00 },
    { id: 108, name: "Omelette Du Chef", price: 11.50 },
  ],
  maincourse: [
    { id: 201, name: "Fish and chips", price: 7.50 },
    { id: 202, name: "Roast chicken", price: 12.75 },
    { id: 203, name: "Fillet steak", price: 11.60 },
    { id: 204, name: "Beefsteak", price: 10.20 },
    { id: 205, name: "Roast beef", price: 10.50 },
    { id: 206, name: "Buffalo wings", price: 8.85 },
    { id: 207, name: "Lobster", price: 13.40 },
    { id: 208, name: "Red caviar", price: 12.30 },
  ],
  soups: [
    { id: 301, name: "French Onion Soup", price: 9.50 },
    { id: 302, name: "Tom Yum", price: 8.00 },
    { id: 303, name: "Lobster Bisque", price: 14.00 },
    { id: 304, name: "Minestrone", price: 7.50 },
    { id: 305, name: "Clam Chowder", price: 11.00 },
    { id: 306, name: "Borscht", price: 8.50 },
  ],
  pasta: [
    { id: 401, name: "Spaghetti Carbonara", price: 13.50 },
    { id: 402, name: "Penne Arrabiata", price: 11.00 },
    { id: 403, name: "Fettuccine Alfredo", price: 12.50 },
    { id: 404, name: "Lasagne", price: 13.00 },
    { id: 405, name: "Truffle Tagliatelle", price: 16.00 },
    { id: 406, name: "Linguine Vongole", price: 14.50 },
  ],
  sushi: [
    { id: 501, name: "Salmon Nigiri x8", price: 16.00 },
    { id: 502, name: "Dragon Roll", price: 14.50 },
    { id: 503, name: "Tuna Sashimi x6", price: 18.00 },
    { id: 504, name: "Rainbow Roll", price: 15.00 },
    { id: 505, name: "Spicy Tuna Roll", price: 13.00 },
    { id: 506, name: "Miso Soup", price: 4.00 },
  ],
  desserts: [
    { id: 601, name: "Crème Brûlée", price: 9.00 },
    { id: 602, name: "Chocolate Fondant", price: 10.00 },
    { id: 603, name: "Tiramisu", price: 9.50 },
    { id: 604, name: "Panna Cotta", price: 8.50 },
    { id: 605, name: "Cheesecake", price: 8.00 },
  ],
  drinks: [
    { id: 701, name: "Classic Lemonade", price: 5.00 },
    { id: 702, name: "Espresso", price: 3.50 },
    { id: 703, name: "Cappuccino", price: 4.50 },
    { id: 704, name: "Fresh OJ", price: 6.00 },
    { id: 705, name: "Green Tea", price: 4.00 },
  ],
  alcohol: [
    { id: 801, name: "House Red Wine", price: 12.00 },
    { id: 802, name: "Craft Beer", price: 7.50 },
    { id: 803, name: "Aperol Spritz", price: 10.00 },
    { id: 804, name: "Classic Mojito", price: 11.00 },
    { id: 805, name: "Champagne Flute", price: 14.00 },
    { id: 806, name: "Irish Cream Coffee", price: 9.00 },
  ],
};
const TABLES = [
  { num: 4, guest: "Leslie K.", items: 6, status: "process" },
  { num: 2, guest: "Jacob J.", items: 4, status: "process" },
  { num: 6, guest: "Cameron W.", items: 6, status: "process" },
];

// --- 3. Component එක ---
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

  const [mount , setmount] = useState (false);

  useEffect (()=> {
    setmount(true)
  },[])

  if(!mount) return   <div className="flex-1 bg-[#1a1a1f]"> Loding</div>

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1a1a1f]">
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
            className={`rounded-2xl p-[14px_12px_12px] cursor-pointer transition-all duration-180 min-h-[90px] flex flex-col justify-end shadow-md ${
              activeCat === c.id ? "ring-2 ring-white scale-[1.03]" : "scale-100"
            }`}
            style={{ background: c.color }}
            onClick={() => setActiveCat(c.id)}
          >
            <div className="text-[20px] mb-1">{c.icon}</div>
            <div className="text-[14px] font-bold text-[#1a1a1f] leading-tight">{c.label}</div>
            <div className="text-[11px] text-[#3a3a4a] mt-0.5">{c.count} items</div>
          </motion.div>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 p-[0_14px_8px] overflow-y-auto flex-1">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const inOrder = order.find((o) => o.id === item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="border-[1.5px] p-[12px] flex flex-col gap-1 rounded-2xl transition-colors"
                style={{ background: `${catColor}15`, borderColor: `${catColor}30` }}
              >
                <div className="text-[9.5px] text-[#6a6a7a] tracking-wider uppercase">Order → Kitchen</div>
                <div className="text-[13px] font-semibold text-[#f0ede8] leading-tight h-10">{item.name}</div>
                <div className="text-[14px] font-bold text-amber-200">
                  ${item.price.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    className="w-8 h-8 rounded-lg bg-[#2e2e3a] border border-[#3a3a4a] text-[#f0ede8] flex items-center justify-center cursor-pointer hover:bg-[#3a3a4a] disabled:opacity-30"
                    onClick={() => inOrder && changeQty(item.id, -1)}
                    disabled={!inOrder}
                  >
                    −
                  </button>
                  <span className="text-sm font-bold min-w-[20px] text-center text-white">
                    {inOrder ? inOrder.qty : 0}
                  </span>
                  <button
                    className="w-8 h-8 rounded-lg bg-amber-200 text-black font-bold flex items-center justify-center cursor-pointer hover:bg-amber-300"
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
      <footer className="flex gap-2 p-[8px_14px_10px] border-t border-[#2a2a34] shrink-0 overflow-x-auto no-scrollbar">
        {TABLES.map((t, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl min-w-[180px] cursor-pointer transition-all border-[1.5px] ${
              t.num === activeTable.num && t.guest === activeTable.guest
                ? "bg-[#2a2a36] border-white"
                : "bg-[#22222a] border-[#2e2e3a] opacity-60"
            }`}
            onClick={() => setActiveTable({ num: t.num, guest: t.guest })}
          >
            <div className="w-8 h-8 bg-[#32324a] rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0">T{t.num}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#f0ede8] truncate">{t.guest}</div>
              <div className="text-[10px] text-[#6a6a7a] mt-0.5">{t.items} items • Kitchen</div>
            </div>
            {t.status === "process" && (
              <div className="bg-[#1d9e7522] text-[#1d9e75] text-[9px] font-bold px-[7px] py-[2px] rounded-lg border border-[#1d9e7544] shrink-0 animate-pulse">In process</div>
            )}
          </div>
        ))}
      </footer>
    </div>
  );
};