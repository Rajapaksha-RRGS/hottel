'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

interface FoodItem {
  _id: string;
  name: string;
  category: string;
  prices: { normal: number; full?: number };
  image: string;
  prepTime?: string;
  allergens?: string[];
  spiceLevel?: number;
  isAvailable: boolean;
  description?: string;
}

interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

interface Order {
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

// Categories will be derived dynamically

export default function GuestDiningPage() {
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<'menu' | 'history'>('menu');

  useEffect(() => {
    fetchMenu();
    if (session?.user?.email) {
      fetchPastOrders();
    }
  }, [session]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/admin/menu?category=All');
      const data = await res.json();
      if (Array.isArray(data)) {
        const availableItems = data.filter(item => item.isAvailable);
        setMenuItems(availableItems);
        
        // Dynamically derive categories
        const uniqueCategories = Array.from(new Set(availableItems.map(item => item.category)));
        setCategories(['All', ...uniqueCategories]);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPastOrders = async () => {
    try {
      const nameParam = session?.user?.name ? `&name=${encodeURIComponent(session.user.name)}` : '';
      const res = await fetch(`/api/guest/orders?email=${encodeURIComponent(session!.user!.email!)}${nameParam}`);
      const data = await res.json();
      if (data.ok) {
        setPastOrders(data.orders);
      }
    } catch (err) {
      console.error('Error fetching past orders:', err);
    }
  };

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter(item => item.category === activeCategory);
  }, [menuItems, activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.foodItem.prices.normal * item.quantity), 0);
  }, [cart]);

  const addToCart = (foodItem: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.foodItem._id === foodItem._id);
      if (existing) {
        return prev.map(item => 
          item.foodItem._id === foodItem._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { foodItem, quantity: 1 }];
    });
    setSuccessMsg(null);
    setError(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.foodItem._id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.foodItem._id !== id));
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    if (!session?.user?.email) {
      setError('You must be logged in to order.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      email: session.user.email,
      name: session.user.name,
      items: cart.map(c => ({
        foodItemId: c.foodItem._id,
        quantity: c.quantity,
      })),
      totalBill: cartTotal
    };

    try {
      const res = await fetch('/api/guest/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.ok) {
        setSuccessMsg(data.message);
        setCart([]);
        setShowCart(false);
        fetchPastOrders(); // refresh order history
      } else {
        setError(data.message || 'Failed to place order.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-bone/10 pb-6">
        <div>
          <h1 className="text-3xl font-serif text-bone tracking-wide flex items-center gap-3">
            <Utensils className="text-gold" size={28} />
            In-Room Dining
          </h1>
          <p className="text-bone/60 mt-2 text-sm tracking-wide">
            Explore our curated menu and have it delivered directly to your room.
          </p>
        </div>
        <button 
          onClick={() => setShowCart(!showCart)}
          className="cursor-pointer glass-button px-4 py-2 flex items-center gap-2 rounded-lg relative"
        >
          <ShoppingCart size={18} className="text-gold" />
          <span className="text-bone text-sm font-medium">View Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-4 border-b border-bone/10 pb-4">
        <button
          onClick={() => setMainTab('menu')}
          className={`cursor-pointer pb-2 px-2 border-b-2 font-medium tracking-wide transition-all duration-300 ${
            mainTab === 'menu' ? 'border-gold text-gold' : 'border-transparent text-bone/50 hover:text-bone'
          }`}
        >
          Live Menu
        </button>
        <button
          onClick={() => setMainTab('history')}
          className={`cursor-pointer pb-2 px-2 border-b-2 font-medium tracking-wide transition-all duration-300 flex items-center gap-2 ${
            mainTab === 'history' ? 'border-gold text-gold' : 'border-transparent text-bone/50 hover:text-bone'
          }`}
        >
          Order History
          {pastOrders.length > 0 && (
            <span className="bg-bone/10 text-bone px-2 py-0.5 rounded-full text-[10px]">
              {pastOrders.length}
            </span>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <Info className="text-red-400 shrink-0 mt-0.5" size={18} />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
          <p className="text-green-400 text-sm">{successMsg}</p>
        </div>
      )}

      {mainTab === 'menu' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Menu Section */}
        <div className={`space-y-6 transition-all duration-300 ${showCart ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
          
          {/* Categories */}
          <div className="flex overflow-x-auto dashboard-scroll pb-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-gold text-charcoal shadow-[0_0_15px_rgba(197,160,89,0.3)]' 
                    : 'bg-bone/5 text-bone/60 hover:text-gold hover:bg-bone/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
            </div>
          ) : filteredMenu.length === 0 ? (
            <div className="glass text-center py-16 rounded-2xl border border-bone/5">
              <Utensils className="mx-auto text-bone/20 mb-4" size={48} />
              <p className="text-bone/60">No items available in this category.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${showCart ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
              {filteredMenu.map((item, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item._id}
                  className="glass rounded-2xl overflow-hidden border border-bone/10 group flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-black/20">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Utensils className="text-bone/20" size={40} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-bone/10">
                      <p className="text-[10px] text-gold uppercase tracking-wider">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-serif text-bone leading-tight pr-4">{item.name}</h3>
                      <p className="text-gold font-semibold">${item.prices.normal}</p>
                    </div>
                    
                    {item.description && (
                      <p className="text-bone/50 text-xs leading-relaxed mb-4 line-clamp-2 flex-grow">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-bone/5">
                      <div className="flex items-center gap-2 text-bone/40 text-[10px] uppercase tracking-wider">
                        {item.prepTime && (
                          <span className="flex items-center gap-1"><Clock size={12}/> {item.prepTime}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => addToCart(item)}
                        className="cursor-pointer w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="xl:col-span-1"
            >
              <div className="glass rounded-2xl p-6 border border-gold/20 sticky top-24">
                <h2 className="text-xl font-serif text-gold mb-6 flex items-center gap-2">
                  <ShoppingCart size={20} /> Your Order
                </h2>
                
                {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingCart className="mx-auto text-bone/20 mb-3" size={32} />
                    <p className="text-bone/40 text-sm">Your cart is empty.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto dashboard-scroll pr-2 mb-6">
                      {cart.map(item => (
                        <div key={item.foodItem._id} className="flex gap-3 items-center p-3 rounded-xl bg-bone/5 border border-bone/10">
                          {item.foodItem.image ? (
                            <img src={item.foodItem.image} alt={item.foodItem.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-black/20 flex items-center justify-center">
                              <Utensils size={16} className="text-bone/30"/>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-bone truncate">{item.foodItem.name}</p>
                            <p className="text-xs text-gold">${item.foodItem.prices.normal} x {item.quantity}</p>
                          </div>
                          
                          <div className="flex flex-col items-center gap-2 ml-2">
                            <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                              <button onClick={() => updateQuantity(item.foodItem._id, -1)} className="cursor-pointer text-bone/60 hover:text-bone"><Minus size={14} /></button>
                              <span className="text-xs text-bone w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.foodItem._id, 1)} className="cursor-pointer text-bone/60 hover:text-bone"><Plus size={14} /></button>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.foodItem._id)} className="cursor-pointer text-red-400/60 hover:text-red-400 p-1">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-bone/10 pt-4 space-y-4">
                      <div className="flex justify-between text-sm text-bone">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-bone/60">
                        <span>Delivery Fee</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-serif text-gold pt-2 border-t border-bone/5">
                        <span>Total to Room</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={placeOrder}
                        disabled={isSubmitting}
                        className="cursor-pointer w-full py-3 bg-gold text-charcoal rounded-xl font-medium tracking-wide uppercase text-sm hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? 'Placing Order...' : 'Place Order'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      ) : (
        /* Past Orders Section */
        <div className="mt-4">
          <h2 className="text-2xl font-serif text-bone mb-6">Your Past Orders</h2>
          {pastOrders.length === 0 ? (
            <div className="glass text-center py-16 rounded-2xl border border-bone/5">
              <Utensils className="mx-auto text-bone/20 mb-4" size={48} />
              <p className="text-bone/60">You have no order history.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastOrders.map(order => {
              const isExpanded = expandedOrder === order._id;
              const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
              
              const statusColors = {
                'Pending': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                'Served': 'text-green-400 bg-green-400/10 border-green-400/20',
                'Billed': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
              };
              const sColor = statusColors[order.orderStatus as keyof typeof statusColors] || statusColors['Pending'];

              return (
                <div key={order._id} className="glass rounded-xl overflow-hidden border border-bone/10 transition-all">
                  <div 
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-bone/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-bone/5 flex items-center justify-center text-gold">
                        <Utensils size={18} />
                      </div>
                      <div>
                        <p className="text-bone font-medium text-sm">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-bone/40 text-xs">{date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-3 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${sColor}`}>
                        {order.orderStatus}
                      </span>
                      <p className="text-gold font-serif text-lg">${order.totalBill.toFixed(2)}</p>
                      {isExpanded ? <ChevronUp className="text-bone/40" size={20} /> : <ChevronDown className="text-bone/40" size={20} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-bone/5"
                      >
                        <div className="p-4 bg-black/20 space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-3">
                                {item.foodItem?.image ? (
                                  <img src={item.foodItem.image} alt={item.foodItem.name} className="w-8 h-8 rounded object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-bone/10" />
                                )}
                                <div>
                                  <p className="text-bone/80">{item.foodItem?.name || 'Unknown Item'}</p>
                                  <p className="text-bone/40 text-xs">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-gold/80">${item.subTotal.toFixed(2)}</p>
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
          )}
        </div>
      )}
    </div>
  );
}
