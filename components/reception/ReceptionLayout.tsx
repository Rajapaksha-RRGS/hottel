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
  Hotel,
} from 'lucide-react';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
  badge?: string;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'neworder', label: 'New Order', icon: ClipboardPlus },
  { id: 'orders', label: 'F&B Orders', icon: Coffee },
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

const menuSubtitles: Record<string, string> = {
  dashboard: 'Today\'s hotel performance at a glance',
  neworder: 'Create a new food & beverage order for a guest',
  orders: 'Track and manage all dining orders',
  invoices: 'Generate and send guest invoices',
  bookings: 'View and manage all reservations',
  guests: 'Search and manage guest profiles',
  rooms: 'Real-time room availability & status',
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

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
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

  const unreadNotifications = 2;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0d0d' }}>
      {/* ─── Sidebar ─── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col h-full z-20 shrink-0"
        style={{
          background: 'linear-gradient(180deg, #151515 0%, #111111 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3.5 px-5 h-[80px] shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] shrink-0">
            <Hotel className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                  Reception<span className="text-emerald-400">Desk</span>
                </h1>
                <p className="text-[11px] text-white/30 mt-0.5 font-medium">Hotel Management</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3.5 top-[86px] w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all duration-200 z-30"
          style={{
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Section Label */}
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 pt-6 pb-2 text-[11px] text-white/25 uppercase tracking-[0.15em] font-semibold"
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`cursor-pointer w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 group relative
                  ${isActive
                    ? 'text-white'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                  }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.06))',
                  boxShadow: '0 0 20px rgba(16,185,129,0.06)',
                } : {}}
              >
                {isActive && (
                  <motion.div
                    layoutId="receptionActiveIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #10b981, #059669)',
                      boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-[20px] h-[20px] shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/70'
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
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => router.push('/')}
            className="cursor-pointer w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[15px] font-medium text-white/35 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
          >
            <LogOut className="w-[20px] h-[20px] shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="h-[80px] flex items-center justify-between px-8 shrink-0 z-10"
          style={{
            background: 'rgba(17,17,17,0.9)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {menuTitles[activeMenu] || 'Dashboard'}
            </h2>
            <p className="text-sm text-white/35 mt-0.5">
              {menuSubtitles[activeMenu] || currentDate}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Date/time pill */}
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/40 font-medium" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <CalendarDays size={14} className="text-white/30" />
              {currentDate} · {currentTime}
            </div>

            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                placeholder="Search guests, rooms..."
                className="rounded-xl pl-10 pr-5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all duration-200 w-72"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              />
            </div>

            {/* Notifications */}
            <button
              className="cursor-pointer relative p-2.5 rounded-xl text-white/40 hover:text-white transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-8 bg-white/6 hidden sm:block" />

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                }}
              >
                RD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">Reception Desk</p>
                <p className="text-xs text-white/30 mt-1">Front Desk Staff</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8" style={{ background: '#0d0d0d' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
