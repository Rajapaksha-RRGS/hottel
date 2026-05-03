/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";


interface SidebarProps {
  activeNav: string;
  setActiveNav: (id: string) => void;
  activeStaff: number;
  setActiveStaff: (id: number) => void;
}
export const NAV = [
  { id: "reservation", label: "Reservation", icon: "📅" },
  { id: "table", label: "Table services", icon: "🍽️" },
  { id: "menu", label: "Menu", icon: "🍱" },
  { id: "delivery", label: "Delivery", icon: "🚚" },
  { id: "accounting", label: "Accounting", icon: "📊" },
];

export const STAFF = [
  { id: 1, name: "Leslie K.", initial: "L", color: "#8b5cf6" }, // Purple
  { id: 2, name: "Cameron W.", initial: "C", color: "#10b981" }, // Green
  { id: 3, name: "Jacob J.", initial: "J", color: "#f59e0b" },   // Orange
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  setActiveNav,
  activeStaff,
  setActiveStaff,
}) => {
  return (
    <aside className="w-[190px] bg-[#111116] border-r border-[#2a2a34] flex flex-col shrink-0 h-screen">
      <div className="flex items-center gap-2.5 p-[20px_18px_16px] border-b border-[#1e1e28]">
        <div className="w-8 h-5.5 flex items-center justify-center text-[#f0ede8] text-base">
          <span>☰</span>
        </div>
        <span className="text-[17px] font-bold tracking-tight text-[#f0ede8]">CosyPOS</span>
      </div>

      <nav className="flex-1 pt-3">
        {NAV.map((n) => (
          <div
            key={n.id}
            className={`p-[16px_20px] text-[13.5px] cursor-pointer transition-all duration-200 flex items-center gap-3 mr-2.5 rounded-r-xl ${
              activeNav === n.id
                ? "bg-[#232330] text-[#f0ede8] font-bold border-l-4 border-[#f0ede8] shadow-lg"
                : "text-[#6a6a7a] font-medium hover:text-[#f0ede8]"
            }`}
            onClick={() => setActiveNav(n.id)}
          >
            <span className="text-lg">{n.icon}</span>
            {n.label}
          </div>
        ))}
      </nav>

      <div className="p-[12px_12px_8px] border-t border-[#1e1e28] flex flex-col gap-1.5">
        {STAFF.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 p-[7px_8px] rounded-[20px] cursor-pointer transition-all duration-150 ${
              activeStaff === s.id ? "bg-[#232330]" : "hover:bg-[#1a1a24]"
            }`}
            onClick={() => setActiveStaff(s.id)}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
              style={{ background: s.color }}
            >
              {s.initial}
            </div>
            <span className="text-xs text-[#c0c0d0] font-medium">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-[#3a3a4a] p-[8px_14px_12px] text-center">
        © 2022 CosyPOS App
      </div>
    </aside>
  );
};
