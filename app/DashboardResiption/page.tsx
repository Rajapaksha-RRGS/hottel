/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import React, { useState } from "react";
import { Sidebar } from "../../components/components/pos/Sidebar";
import { MenuSection } from "../../components/components/pos/MenuSection";
import { ReservationSection } from "../../components/components/pos/ReservationSection";
import { OrderPanel } from "../../components/components/pos/OrderPanel";
import { Toast } from "../../components/components/pos/Toast";
import { INIT_ORDER, INIT_RESERVATIONS } from "../../components/components/constants";
import { OrderItem, Reservation } from "../../types";

export default function DashboardHome() {
  const [activeNav, setActiveNav] = useState("menu");
  const [activeCat, setActiveCat] = useState("maincourse");
  const [activeStaff, setActiveStaff] = useState(1);
  const [order, setOrder] = useState<OrderItem[]>(INIT_ORDER);
  const [reservations, _setReservations] = useState<Reservation[]>(INIT_RESERVATIONS);
  const [payMethod, setPayMethod] = useState("cash");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "danger" } | null>(null);
  const [activeTable, setActiveTable] = useState({ num: 4, guest: "Leslie K." });

  const showToast = (msg: string, type: "success" | "danger" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const addItem = (item: { id: number; name: string; price: number }) => {
    setOrder((prev) => {
      const found = prev.find((o) => o.id === item.id);
      if (found) return prev.map((o) => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.name} added`);
  };

  const changeQty = (id: number, delta: number) => {
    setOrder((prev) =>
      prev.map((o) => o.id === id ? { ...o, qty: Math.max(1, o.qty + delta) } : o)
    );
  };

  const removeItem = (id: number) => {
    setOrder((prev) => prev.filter((o) => o.id !== id));
  };

  const cancelOrder = () => {
    if (order.length === 0) return;
    if (window.confirm("Cancel entire order?")) {
      setOrder([]);
      showToast("Order cancelled", "danger");
    }
  };

  const placeOrder = () => {
    if (order.length === 0) return;
    showToast(`Order sent to kitchen! 🍽`, "success");
    setOrder([]);
  };

  const subtotal = order.reduce((s, o) => s + o.price * o.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex h-screen bg-[#1a1a1f] font-sans overflow-hidden text-[#f0ede8] relative select-none">
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        activeStaff={activeStaff}
        setActiveStaff={setActiveStaff}
      />

      <main className="flex-1 flex flex-col min-w-0 border-r border-[#2a2a34]">
        {activeNav === "menu" ? (
          <MenuSection
            search={search}
            setSearch={setSearch}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            order={order}
            addItem={addItem}
            changeQty={changeQty}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
          />
        ) : activeNav === "reservation" ? (
          <ReservationSection reservations={reservations} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50">
            <span className="text-4xl text-white">⚙️</span>
            <h2 className="mt-2.5 text-xl font-bold">Maintenance</h2>
            <p className="text-sm">This module is currently under development</p>
          </div>
        )}
      </main>

      {activeNav === "menu" && (
        <OrderPanel
          activeTable={activeTable}
          order={order}
          changeQty={changeQty}
          removeItem={removeItem}
          subtotal={subtotal}
          tax={tax}
          total={total}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          cancelOrder={cancelOrder}
          placeOrder={placeOrder}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
