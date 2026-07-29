'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Minus, Plus, ShoppingCart, Send, X, Utensils,
  Coffee, IceCream, Salad, Martini, Zap, Loader, BedDouble, Grid3x3, Check,
} from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  prices: { normal: number; full?: number };
  image?: string;
  isAvailable: boolean;
}

type CartItem = {
  foodItem: string;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
};

const TABLES = Array.from({ length: 12 }, (_, i) => `Table ${String(i + 1).padStart(2, '0')}`);

// Solid, high-contrast category colors — staff scan these tiles fast, so
// each category gets one unmistakable color instead of a subtle gradient.
const CATEGORIES = [
  { id: 'Appetizer', label: 'Appetizer', icon: Salad, solid: 'bg-emerald-600', ring: 'ring-emerald-400', soft: 'bg-emerald-500/10', text: 'text-emerald-400' },
  { id: 'Main', label: 'Main Course', icon: Utensils, solid: 'bg-amber-600', ring: 'ring-amber-400', soft: 'bg-amber-500/10', text: 'text-amber-400' },
  { id: 'Dessert', label: 'Desserts', icon: IceCream, solid: 'bg-pink-600', ring: 'ring-pink-400', soft: 'bg-pink-500/10', text: 'text-pink-400' },
  { id: 'Beverage', label: 'Drinks', icon: Coffee, solid: 'bg-sky-600', ring: 'ring-sky-400', soft: 'bg-sky-500/10', text: 'text-sky-400' },
  { id: 'Cocktail', label: 'Cocktails', icon: Martini, solid: 'bg-violet-600', ring: 'ring-violet-400', soft: 'bg-violet-500/10', text: 'text-violet-400' },
  { id: 'Shot', label: 'Shots', icon: Zap, solid: 'bg-red-600', ring: 'ring-red-400', soft: 'bg-red-500/10', text: 'text-red-400' },
];

export default function ReceptionNewOrder() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Appetizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectionMode, setSelectionMode] = useState<'table' | 'room'>('table');
  const [bookings, setBookings] = useState<any[]>([]);
  const [placing, setPlacing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch menu items from MongoDB
  useEffect(() => {
    (async () => {
      try {
        setLoadingMenu(true);
        const res = await fetch('/api/admin/menu');
        const items = await res.json();
        setMenuItems(Array.isArray(items) ? items : []);
        console.log('✅ Menu items loaded:', items.length);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setMenuItems([]);
      } finally {
        setLoadingMenu(false);
      }
    })();
  }, []);

  // Fetch checked-in bookings for table/room selection
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/reception/stats');
        const json = await res.json();
        if (json.success) {
          const checkedIn = (json.data.allBookings || []).filter(
            (b: any) => b.status === 'Checked-In'
          );
          setBookings(checkedIn);
          if (checkedIn.length === 0) {
            console.warn('No checked-in bookings found. Room picker will show "No active bookings".');
          }
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      }
    })();
  }, []);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchCategory = item.category === activeCategory;
    const matchSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCategory && matchSearch && item.isAvailable;
  });

  // Cart helpers
  const addToCart = (item: MenuItem) => {
    const price = item.prices.normal;
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem === item._id);
      if (existing) {
        return prev.map((c) =>
          c.foodItem === item._id
            ? { ...c, quantity: c.quantity + 1, subTotal: (c.quantity + 1) * price }
            : c
        );
      }
      return [...prev, { foodItem: item._id, name: item.name, price, quantity: 1, subTotal: price }];
    });
  };

  const removeFromCart = (foodItemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem === foodItemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter((c) => c.foodItem !== foodItemId);
      return prev.map((c) =>
        c.foodItem === foodItemId
          ? { ...c, quantity: c.quantity - 1, subTotal: (c.quantity - 1) * c.price }
          : c
      );
    });
  };

  const getQty = (id: string) => cart.find((c) => c.foodItem === id)?.quantity || 0;
  const itemCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const subtotal = cart.reduce((sum, c) => sum + c.subTotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const getSelectionInfo = () => {
    if (!selectedTable) return null;
    if (selectionMode === 'room') {
      const booking = bookings.find((b) => b._id === selectedTable);
      if (booking) {
        return {
          type: 'room' as const,
          display: `Room ${booking.room?.roomNumber || 'Pending Room'}`,
          guestName: booking.guestName || 'Guest',
          roomNumber: booking.room?.roomNumber || 'Pending Room',
        };
      }
      return null;
    }
    return { type: 'table' as const, display: selectedTable, guestName: null, roomNumber: null };
  };

  // Place order
  const placeOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    setPlacing(true);
    try {
      const selection = getSelectionInfo();
      const payload: any = {
        items: cart.map((c) => ({ foodItem: c.foodItem, quantity: c.quantity, subTotal: c.subTotal })),
        totalBill: total,
        orderStatus: 'Pending',
      };

      if (selection?.type === 'room') {
        payload.roomBookingId = selectedTable;
        payload.orderType = 'Room';
      } else {
        payload.tableNumber = selectedTable;
        payload.orderType = 'Table';
      }

      console.log('📦 Sending order payload:', payload);

      const res = await fetch('/api/reception/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        const errorMsg = json.message || json.error || 'Failed to place order';
        console.error('❌ Order failed (HTTP ' + res.status + '):', errorMsg);
        if (res.status === 401) {
          alert('Session expired. Please refresh and login again.');
        } else if (res.status === 403) {
          alert('You do not have permission to place orders.');
        } else {
          alert(`Error: ${errorMsg}`);
        }
      } else if (json.success) {
        console.log('✅ Order placed successfully:', json.data);
        setSuccessMsg('Order sent to kitchen!');
        setCart([]);
        setSelectedTable('');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        const errorMsg = json.message || 'Failed to place order';
        console.error('❌ Order failed:', errorMsg);
        alert(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  const selection = getSelectionInfo();
  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-144px)]">
      {/* ═══ Left: Menu Area ═══ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food or drinks..."
            className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Tabs — large, solid, POS-style segmented control */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = menuItems.filter((i) => i.category === cat.id && i.isAvailable).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-150 active:scale-95 ${
                  isActive
                    ? `${cat.solid} text-white shadow-lg`
                    : 'bg-slate-900 text-slate-400 border-2 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{cat.label}</span>
                <span
                  className={`text-xs font-semibold rounded-full px-1.5 py-0.5 min-w-[22px] text-center ${
                    isActive ? 'bg-white/20' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Food Items Grid — whole tile is tappable, like a POS register button */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-0">
          {loadingMenu ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Loading menu items...</p>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Utensils className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No items available in this category</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredItems.map((item) => {
                const qty = getQty(item._id);
                const inCart = qty > 0;
                return (
                  <button
                    key={item._id}
                    onClick={() => addToCart(item)}
                    className={`relative text-left rounded-xl p-4 pt-3 transition-all duration-150 active:scale-[0.97] border-2 ${
                      inCart
                        ? `${activeCat.soft} ${activeCat.ring.replace('ring-', 'border-')}`
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Category accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${activeCat.solid}`} />

                    {inCart && (
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full ${activeCat.solid} flex items-center justify-center`}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    <h4 className="text-white font-bold text-base leading-snug mb-1 pr-6">{item.name}</h4>
                    <p className={`font-extrabold text-lg mb-3 ${activeCat.text}`}>${item.prices.normal.toFixed(2)}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">
                        Tap to add
                      </span>
                      {inCart && (
                        <div
                          className="flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => removeFromCart(item._id)}
                            aria-label={`Remove one ${item.name}`}
                            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white active:scale-90 transition-transform"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white font-extrabold text-base min-w-[20px] text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(item)}
                            aria-label={`Add one more ${item.name}`}
                            className={`w-8 h-8 rounded-lg ${activeCat.solid} flex items-center justify-center text-white active:scale-90 transition-transform`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Right: Order Sidebar ═══ */}
      <div className="w-full lg:w-[360px] flex-shrink-0 bg-slate-900 rounded-2xl flex flex-col overflow-hidden border-2 border-slate-800">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b-2 border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-extrabold text-base">Current Order</h3>
            <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full">
              <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">{itemCount}</span>
            </div>
          </div>

          {/* Table / Room mode toggle — big segmented buttons, not a dropdown */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => { setSelectionMode('table'); setSelectedTable(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                selectionMode === 'table' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Grid3x3 className="w-4 h-4" /> Table
            </button>
            <button
              onClick={() => { setSelectionMode('room'); setSelectedTable(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                selectionMode === 'room' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <BedDouble className="w-4 h-4" /> Room
            </button>
          </div>

          {/* Picker grid */}
          <div className="max-h-32 overflow-y-auto grid grid-cols-3 gap-2">
            {selectionMode === 'table'
              ? TABLES.map((table) => (
                  <button
                    key={table}
                    onClick={() => setSelectedTable(table)}
                    className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                      selectedTable === table
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {table.replace('Table ', 'T')}
                  </button>
                ))
              : bookings.length === 0
              ? (
                <p className="col-span-3 text-xs text-slate-500 text-center py-3">No active bookings</p>
              ) : (
                bookings.map((b: any) => (
                  <button
                    key={b._id}
                    onClick={() => setSelectedTable(b._id)}
                    className={`col-span-3 flex items-center justify-between py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                      selectedTable === b._id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Room {b.room?.roomNumber || 'Pending'}</span>
                    <span className="font-medium opacity-80 truncate max-w-[110px]">{b.guestName || 'Guest'}</span>
                  </button>
                ))
              )}
          </div>

          {selection && (
            <p className="text-xs text-slate-400 mt-3 bg-slate-800/60 rounded-lg px-3 py-2">
              {selection.type === 'room'
                ? <>Sending to <span className="text-white font-semibold">Room {selection.roomNumber}</span> — {selection.guestName}</>
                : <>Sending to <span className="text-white font-semibold">{selection.display}</span></>}
            </p>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[120px]">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Utensils className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p className="text-xs text-slate-500">No items added yet</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.foodItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-800"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-700 text-white text-xs font-extrabold flex items-center justify-center">
                      {item.quantity}
                    </span>
                    <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-emerald-400 font-extrabold text-sm">${item.subTotal.toFixed(2)}</span>
                    <button
                      onClick={() => setCart((prev) => prev.filter((c) => c.foodItem !== item.foodItem))}
                      aria-label={`Remove ${item.name} from order`}
                      className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 active:scale-90 transition-transform"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Totals & Actions — sticky bottom bar, big and unmissable */}
        <div className="p-5 pt-4 border-t-2 border-slate-800 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-300 font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax 10%</span>
              <span className="text-slate-300 font-medium">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-800 rounded-xl px-4 py-3">
            <span className="text-white font-bold">Total</span>
            <span className="text-emerald-400 font-extrabold text-2xl">${total.toFixed(2)}</span>
          </div>

          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-emerald-300 text-sm font-bold bg-emerald-500/20 rounded-xl py-2.5"
              >
                ✓ {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            <button
              onClick={() => { setCart([]); setSelectedTable(''); }}
              disabled={cart.length === 0}
              className="flex-1 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-2 border-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={placeOrder}
              disabled={cart.length === 0 || !selectedTable || placing}
              className="flex-[2] py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              {placing ? 'Sending...' : 'Send to Kitchen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
