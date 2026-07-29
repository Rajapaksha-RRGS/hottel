'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, ShoppingCart, CheckCircle2, Info } from 'lucide-react';

import MenuCard, { type FoodItem, type CartItem } from '@/components/guest/dining/MenuCard';
import CategoryFilter from '@/components/guest/dining/CategoryFilter';
import CartPanel from '@/components/guest/dining/CartPanel';
import CartFAB from '@/components/guest/dining/CartFAB';
import OrderHistory, { type Order } from '@/components/guest/dining/OrderHistory';

export default function GuestDiningPage() {
  const { data: session } = useSession();

  // ── State ──────────────────────────────────────────────────
  const [menuItems, setMenuItems]       = useState<FoodItem[]>([]);
  const [pastOrders, setPastOrders]     = useState<Order[]>([]);
  const [categories, setCategories]     = useState<string[]>(['All']);
  const [activeCategory, setActive]     = useState('All');
  const [cart, setCart]                 = useState<CartItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [successMsg, setSuccessMsg]     = useState<string | null>(null);
  const [showCart, setShowCart]         = useState(false);
  const [expandedOrder, setExpanded]    = useState<string | null>(null);
  const [mainTab, setMainTab]           = useState<'menu' | 'history'>('menu');

  // ── Data fetching ──────────────────────────────────────────
  useEffect(() => {
    fetchMenu();
    if (session?.user?.email) fetchPastOrders();
  }, [session]);

  async function fetchMenu() {
    try {
      const res  = await fetch('/api/admin/menu?category=All');
      const data = await res.json();
      if (Array.isArray(data)) {
        const available = data.filter((i) => i.isAvailable);
        setMenuItems(available);
        const cats = Array.from(new Set(available.map((i: FoodItem) => i.category)));
        setCategories(['All', ...cats]);
      }
    } catch {
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPastOrders() {
    try {
      const name = session?.user?.name ? `&name=${encodeURIComponent(session.user.name)}` : '';
      const res  = await fetch(`/api/guest/orders?email=${encodeURIComponent(session!.user!.email!)}${name}`);
      const data = await res.json();
      if (data.ok) setPastOrders(data.orders);
    } catch { /* silent */ }
  }

  // ── Derived values ─────────────────────────────────────────
  const filteredMenu = useMemo(() =>
    activeCategory === 'All' ? menuItems : menuItems.filter((i) => i.category === activeCategory),
  [menuItems, activeCategory]);

  const cartTotal = useMemo(() =>
    cart.reduce((t, c) => t + c.foodItem.prices.normal * c.quantity, 0), [cart]);

  const cartCount = cart.reduce((a, b) => a + b.quantity, 0);

  // ── Cart helpers ───────────────────────────────────────────
  function addToCart(item: FoodItem) {
    setCart((prev) => {
      const ex = prev.find((c) => c.foodItem._id === item._id);
      if (ex) return prev.map((c) => c.foodItem._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { foodItem: item, quantity: 1 }];
    });
    setSuccessMsg(null);
    setError(null);
  }

  function updateQty(id: string, delta: number) {
    setCart((prev) =>
      prev.map((c) =>
        c.foodItem._id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c,
      ),
    );
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.foodItem._id !== id));
  }

  // ── Order placement ────────────────────────────────────────
  async function placeOrder() {
    if (!cart.length || !session?.user?.email) return setError('Please log in to order.');
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/guest/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session.user.email,
          name:  session.user.name,
          items: cart.map((c) => ({ foodItemId: c.foodItem._id, quantity: c.quantity })),
          totalBill: cartTotal,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccessMsg(data.message);
        setCart([]);
        setShowCart(false);
        fetchPastOrders();
      } else {
        setError(data.message || 'Order failed.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="relative pb-24 lg:pb-0">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-8 pb-7 border-b border-bone/10">
        <div>
          <span className="text-gold text-[13px] uppercase tracking-[0.2em] font-semibold">
            Hotel Restaurant
          </span>
          <h1 className="mt-1.5 text-4xl font-serif text-bone tracking-wide flex items-center gap-3">
            <Utensils className="text-gold" size={30} />
            In-Room Dining
          </h1>
          <p className="text-bone/55 mt-2 text-base">
            Curated flavours, delivered to your door.
          </p>
        </div>

        <button
          onClick={() => setShowCart(!showCart)}
          className="cursor-pointer relative flex items-center gap-2.5 px-5 py-3 rounded-xl border border-bone/15 hover:border-gold/40 bg-bone/5 hover:bg-gold/10 transition-all duration-300 active:scale-95"
        >
          <ShoppingCart size={18} className="text-gold" />
          <span className="text-bone text-base font-semibold">
            {showCart ? 'Hide Cart' : 'View Cart'}
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-7 p-1.5 rounded-xl bg-bone/5 border border-bone/10 w-fit">
        {(['menu', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`cursor-pointer px-6 py-2.5 rounded-lg text-base font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 active:scale-95 ${
              mainTab === tab
                ? 'bg-gold text-charcoal shadow-[0_0_12px_rgba(197,160,89,0.3)]'
                : 'text-bone/50 hover:text-bone'
            }`}
          >
            {tab === 'menu' ? 'Live Menu' : 'Order History'}
            {tab === 'history' && pastOrders.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${mainTab === tab ? 'bg-charcoal/20 text-charcoal' : 'bg-bone/10 text-bone'}`}>
                {pastOrders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Alert banners ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
          >
            <Info className="text-red-400 shrink-0 mt-0.5" size={16} />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mb-4 p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3"
          >
            <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={16} />
            <p className="text-green-400 text-sm">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      {mainTab === 'menu' ? (
        <div className={`grid gap-6 ${showCart ? 'xl:grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>

          {/* Menu column */}
          <div className="min-w-0 space-y-6">
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onChange={setActive}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-64" />)}
              </div>
            ) : filteredMenu.length === 0 ? (
              <div
                className="text-center py-20 rounded-2xl border border-bone/5"
                style={{ background: 'rgba(26,26,26,0.5)' }}
              >
                <Utensils className="mx-auto text-bone/15 mb-4" size={44} />
                <p className="text-bone/40">No items in this category.</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${showCart ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-5`}>
                {filteredMenu.map((item, idx) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    idx={idx}
                    cartItem={cart.find((c) => c.foodItem._id === item._id)}
                    onAdd={addToCart}
                    onUpdateQty={updateQty}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart sidebar */}
          <CartPanel
            show={showCart}
            cart={cart}
            cartTotal={cartTotal}
            isSubmitting={isSubmitting}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onPlaceOrder={placeOrder}
            onClose={() => setShowCart(false)}
          />
        </div>
      ) : (
        /* Order History */
        <div className="space-y-4">
          <h2 className="text-xl font-serif text-bone mb-2">Your Order History</h2>
          <OrderHistory
            orders={pastOrders}
            expandedId={expandedOrder}
            onToggle={(id) => setExpanded((prev) => (prev === id ? null : id))}
          />
        </div>
      )}

      {/* Mobile floating cart button */}
      <CartFAB
        cartCount={cartCount}
        cartTotal={cartTotal}
        onClick={() => setShowCart(true)}
      />
    </div>
  );
}
