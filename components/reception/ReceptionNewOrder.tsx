'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Minus, Plus, ShoppingCart, Send, X, Utensils,
  Coffee, Wine, IceCream, Salad, Martini, Zap,
} from 'lucide-react';

// ─── Mock Food Menu Data ───
const MOCK_MENU = [
  // Appetizer
  { _id: 'a1', name: 'Fish and chips', category: 'Appetizer', price: 7.50, isAvailable: true },
  { _id: 'a2', name: 'Spring rolls', category: 'Appetizer', price: 5.25, isAvailable: true },
  { _id: 'a3', name: 'Garlic prawns', category: 'Appetizer', price: 9.80, isAvailable: true },
  { _id: 'a4', name: 'Chicken wings', category: 'Appetizer', price: 8.50, isAvailable: true },
  // Main
  { _id: 'm1', name: 'Roast chicken', category: 'Main', price: 12.75, isAvailable: true },
  { _id: 'm2', name: 'Fillet steak', category: 'Main', price: 11.60, isAvailable: true },
  { _id: 'm3', name: 'Beefsteak', category: 'Main', price: 10.20, isAvailable: true },
  { _id: 'm4', name: 'Roast beef', category: 'Main', price: 10.50, isAvailable: true },
  { _id: 'm5', name: 'Lobster', category: 'Main', price: 13.40, isAvailable: true },
  { _id: 'm6', name: 'Grilled salmon', category: 'Main', price: 14.90, isAvailable: true },
  // Dessert
  { _id: 'd1', name: 'Chocolate cake', category: 'Dessert', price: 6.50, isAvailable: true },
  { _id: 'd2', name: 'Ice cream sundae', category: 'Dessert', price: 5.00, isAvailable: true },
  { _id: 'd3', name: 'Crème brûlée', category: 'Dessert', price: 7.20, isAvailable: true },
  // Beverage
  { _id: 'b1', name: 'Fresh juice', category: 'Beverage', price: 3.50, isAvailable: true },
  { _id: 'b2', name: 'Coffee latte', category: 'Beverage', price: 4.00, isAvailable: true },
  { _id: 'b3', name: 'Iced tea', category: 'Beverage', price: 3.00, isAvailable: true },
  { _id: 'b4', name: 'Mineral water', category: 'Beverage', price: 2.00, isAvailable: true },
  // Cocktail
  { _id: 'c1', name: 'Mojito', category: 'Cocktail', price: 8.85, isAvailable: true },
  { _id: 'c2', name: 'Piña colada', category: 'Cocktail', price: 9.50, isAvailable: true },
  { _id: 'c3', name: 'Margarita', category: 'Cocktail', price: 9.00, isAvailable: true },
  // Shot
  { _id: 's1', name: 'Red caviar', category: 'Shot', price: 12.30, isAvailable: true },
  { _id: 's2', name: 'Tequila shot', category: 'Shot', price: 6.00, isAvailable: true },
];

type CartItem = {
  foodItem: string;
  name: string;
  price: number;
  quantity: number;
  subTotal: number;
};

const TABLES = Array.from({ length: 12 }, (_, i) => `Table ${String(i + 1).padStart(2, '0')}`);

const CATEGORIES = [
  { id: 'Appetizer', label: 'Appetizer', icon: Salad, color: 'from-emerald-400/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  { id: 'Main', label: 'Main Course', icon: Utensils, color: 'from-amber-400/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  { id: 'Dessert', label: 'Desserts', icon: IceCream, color: 'from-pink-400/20 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  { id: 'Beverage', label: 'Drinks', icon: Coffee, color: 'from-sky-400/20 to-sky-600/10', border: 'border-sky-500/30', text: 'text-sky-400' },
  { id: 'Cocktail', label: 'Cocktails', icon: Martini, color: 'from-violet-400/20 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  { id: 'Shot', label: 'Shots', icon: Zap, color: 'from-red-400/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400' },
];

export default function ReceptionNewOrder() {
  const [activeCategory, setActiveCategory] = useState('Appetizer');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [placing, setPlacing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
            console.warn('No checked-in bookings found. Rooms optgroup will show "No active bookings".');
          }
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      }
    })();
  }, []);

  // Filter menu items
  const filteredItems = MOCK_MENU.filter((item) => {
    const matchCategory = item.category === activeCategory;
    const matchSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCategory && matchSearch && item.isAvailable;
  });

  // Cart helpers
  const addToCart = (item: typeof MOCK_MENU[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.foodItem === item._id);
      if (existing) {
        return prev.map((c) =>
          c.foodItem === item._id
            ? { ...c, quantity: c.quantity + 1, subTotal: (c.quantity + 1) * c.price }
            : c
        );
      }
      return [...prev, { foodItem: item._id, name: item.name, price: item.price, quantity: 1, subTotal: item.price }];
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
  const subtotal = cart.reduce((sum, c) => sum + c.subTotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const isRoomSelection = (value: string) => {
    const isRoom = bookings.some((b) => b._id === value);
    return isRoom;
  };

  const getSelectionInfo = () => {
    if (!selectedTable) return null;

    const isRoom = isRoomSelection(selectedTable);
    if (isRoom) {
      const booking = bookings.find((b) => b._id === selectedTable);
      if (booking) {
        return {
          type: 'room',
          booking,
          display: `Room ${booking.room?.roomNumber || 'Pending Room'} — ${booking.guestName || 'Guest'}`,
          guestName: booking.guestName || 'Guest',
          roomNumber: booking.room?.roomNumber || 'Pending Room',
        };
      }
    }

    return {
      type: 'table',
      booking: null,
      display: selectedTable,
      guestName: null,
      roomNumber: null,
    };
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

      if (json.success) {
        console.log('✅ Order placed successfully:', json.data);
        setSuccessMsg('Order sent to kitchen!');
        setCart([]);
        setSelectedTable('');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        console.error('❌ Order failed:', json.message);
        alert(`Error: ${json.message}`);
      }
    } catch (err) {
      console.error('❌ Error placing order:', err);
      alert('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  const selection = getSelectionInfo();

  return (
    <div className="flex gap-6 h-[calc(100vh-144px)]">
      {/* ═══ Left: Menu Area ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food or drinks..."
            className="w-full bg-luxury-card border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
          />
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = MOCK_MENU.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative p-3 rounded-lg transition-all duration-300 text-left overflow-hidden border ${
                  isActive
                    ? `bg-gradient-to-br ${cat.color} border-slate-600`
                    : 'bg-luxury-card border-slate-700'
                }`}
                style={isActive ? { boxShadow: '0 8px 24px rgba(6, 182, 212, 0.15), 0 0 20px rgba(6, 182, 212, 0.08)' } : { boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/[0.04] to-transparent rounded-bl-full" />
                )}
                <Icon className={`w-4 h-4 mb-1.5 ${isActive ? cat.text : 'text-slate-500'}`} />
                <p className={`text-xs font-semibold ${isActive ? 'text-cyan-white' : 'text-slate-400'}`}>{cat.label}</p>
                <p className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{count} items</p>
              </button>
            );
          })}
        </div>

        {/* Food Items Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item, idx) => {
              const qty = getQty(item._id);
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group relative bg-luxury-card rounded-lg p-4 overflow-hidden transition-all duration-300 hover:shadow-lg border border-slate-700"
                  style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/[0.05] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* "ORDER → KITCHEN" label */}
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold mb-3">Order → Kitchen</p>

                  <h4 className="text-white font-semibold text-sm mb-1">{item.name}</h4>
                  <p className="text-emerald-400 font-bold text-base mb-4">${item.price.toFixed(2)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      disabled={qty === 0}
                      className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 border border-slate-700"
                      style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className={`text-sm font-bold min-w-[24px] text-center ${qty > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {qty}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white hover:bg-emerald-700 transition-all duration-200"
                      style={{ boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)' }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ Right: Order Sidebar ═══ */}
      <div
        className="w-[320px] flex-shrink-0 bg-luxury-card rounded-lg flex flex-col overflow-hidden border border-slate-700"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Sidebar Header — Table Selection */}
        <div className="p-5 flex flex-col space-y-4 bg-gradient-to-b from-luxury-card to-slate-800/50" style={{ boxShadow: 'inset 0 -1px 3px rgba(0, 0, 0, 0.3)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-sm">Current Order</h3>
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
          </div>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
          >
            <option value="">Select Room / Table</option>
            <optgroup label="🛏️ Rooms">
              {bookings.length === 0 ? (
                <option disabled>No active bookings</option>
              ) : (
                bookings.map((b: any) => (
                  <option key={b._id} value={b._id}>
                    Room {b.room?.roomNumber || 'Pending Room'} — {b.guestName || 'Guest'}
                  </option>
                ))
              )}
            </optgroup>
            <optgroup label="🍽️ Tables">
              {TABLES.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </optgroup>
          </select>
          {selection && (
            <p className="text-[11px] text-slate-400 mt-2">
              {selection.type === 'room' ? (
                <>
                  🏨 Room: <span className="text-slate-300">{selection.roomNumber}</span>
                  <br />
                  👤 Guest: <span className="text-slate-300">{selection.guestName}</span>
                </>
              ) : (
                <>
                  🍽️ Table: <span className="text-slate-300">{selection.display}</span>
                </>
              )}
            </p>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Utensils className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-xs text-slate-500">No items added yet</p>
              </div>
            ) : (
              cart.map((item) => (
                <motion.div
                  key={item.foodItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                  style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)' }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">×{item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold text-sm">${item.subTotal.toFixed(2)}</span>
                    <button
                      onClick={() => setCart((prev) => prev.filter((c) => c.foodItem !== item.foodItem))}
                      className="w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Totals & Actions */}
        <div className="p-5 space-y-3" style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)' }}>
          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-slate-300">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax 10%</span>
              <span className="text-slate-300">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-700">
              <span>Total</span>
              <span className="text-emerald-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-emerald-300 text-sm font-semibold bg-emerald-500/20 rounded-lg py-2 border border-emerald-500/30"
                style={{ boxShadow: '0 2px 8px rgba(52, 211, 153, 0.15)' }}
              >
                ✓ {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cancel */}
          <button
            onClick={() => { setCart([]); setSelectedTable(''); }}
            disabled={cart.length === 0}
            className="w-full py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700"
          >
            Cancel Order
          </button>

          {/* Place Order */}
          <button
            onClick={placeOrder}
            disabled={cart.length === 0 || !selectedTable || placing}
            className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
            style={{ boxShadow: '0 2px 8px rgba(5, 150, 105, 0.2)' }}
          >
            <Send className="w-4 h-4" />
            {placing ? 'Sending...' : 'Place Order → Kitchen'}
          </button>
        </div>
      </div>
    </div>
  );
}
