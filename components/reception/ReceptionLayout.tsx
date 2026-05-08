'use client';

import ReceptionOverview from './ReceptionOverview';
import ReceptionOrders from './ReceptionOrders';
import ReceptionNewOrder from './ReceptionNewOrder';
import ReceptionBookings from './ReceptionBookings';
import ReceptionGuests from './ReceptionGuests';
import ReceptionRooms from './ReceptionRooms';
import InvoiceManagement from './InvoiceManagement';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BedDouble,
  Users,
  CalendarDays,
  Coffee,
  ChevronLeft,
  Search,
  LogOut,
  Bell,
  ClipboardPlus,
  DollarSign,
} from 'lucide-react';




type MenuItem = {
  id: string;
  label: string;
  icon: any;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Top Dashboard', icon: LayoutDashboard },
  { id: 'neworder', label: 'New Order', icon: ClipboardPlus },
  { id: 'orders', label: 'Orders', icon: Coffee },
  { id: 'invoices', label: 'Invoices', icon: DollarSign },
  { id: 'bookings', label: 'Bookings', icon: CalendarDays },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
];

const menuTitles: Record<string, string> = {
  dashboard: 'Reception Dashboard',
  neworder: 'Place New Order',
  orders: 'Food & Beverage Orders',
  invoices: 'Invoice Management',
  bookings: 'Booking Management',
  guests: 'Guest Directory',
  rooms: 'Room Status',
};

export default function ReceptionLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <ReceptionOverview />;
      case 'neworder':
        return <ReceptionNewOrder />;
      case 'orders':
        return <ReceptionOrders />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'bookings':
        return <ReceptionBookings />;
      case 'guests':
        return <ReceptionGuests />;
      case 'rooms':
        return <ReceptionRooms />;
      default:
        return <ReceptionOverview />;
    }
  };

  const unreadNotifications = 2; // Mock data for reception

  return (
    <div className="flex h-screen bg-luxury-dark overflow-hidden">
      {/* ─── Sidebar ─── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col bg-luxury-card h-full z-20"
        style={{ boxShadow: '2px 0 12px rgba(0, 0, 0, 0.3)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[72px] flex-shrink-0" style={{ boxShadow: 'inset 0 -1px 3px rgba(0, 0, 0, 0.2)' }}>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Reception<span className="text-luxury-gold">Desk</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-[80px] w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 z-30"
          style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''
              }`}
          />
        </button>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-light-accentBlue/20 text-white shadow-[0_0_20px_rgba(0,80,179,0.08)]'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'
                    }`}
                />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 space-y-1" style={{ boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)' }}>
          <button onClick={() => { router.push('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
            <LogOut className="w-5 h-5 flex-shrink-0 text-slate-500" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-luxury-card backdrop-blur-xl flex items-center justify-between px-8 flex-shrink-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
          <div>
            <h2 className="text-xl font-bold text-white">{menuTitles[activeMenu] || 'Dashboard'}</h2>
            <p className="text-xs text-slate-400">{currentDate}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-luxury-dark border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all duration-200 w-64"
                style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}
              />
            </div>

            {/* Notifications Bell */}
            <button className="relative p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-all duration-200" style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4" style={{ boxShadow: 'inset -1px 0 2px rgba(255, 255, 255, 0.05)' }}>
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                RD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">Reception Desk</p>
                <p className="text-[11px] text-slate-500">Staff</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-luxury-dark">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
