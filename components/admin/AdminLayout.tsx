'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BedDouble,
  Map,
  Users,
  CalendarDays,
  CreditCard,
  BarChart3,
  Bell,
  ChevronLeft,
  Search,
  LogOut,
  Settings,
  UserCheck,
} from 'lucide-react';

import DashboardOverview from '@/components/admin/DashboardOverview';
import RoomManagement from '@/components/admin/RoomManagement';
import TourManagement from '@/components/admin/TourManagement';
import GuestList from '@/components/admin/GuestList';
import BookingCalendar from '@/components/admin/BookingCalendar';
import PaymentsInvoices from '@/components/admin/PaymentsInvoices';
import Analytics from '@/components/admin/Analytics';
import Notifications from '@/components/admin/Notifications';
import StaffManagement from '@/components/admin/StaffManagement';

type MenuItem = {
  id: string;
  label: string;
  icon: any;
};

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'rooms', label: 'Room Management', icon: BedDouble },
  { id: 'tours', label: 'Tour Management', icon: Map },
  { id: 'staff', label: 'Staff Management', icon: UserCheck },
  { id: 'guests', label: 'Guest List', icon: Users },
  { id: 'calendar', label: 'Booking Calendar', icon: CalendarDays },
  { id: 'payments', label: 'Payment & Invoice', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

const menuTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  rooms: 'Room Management',
  staff: 'Staff Management',
  tours: 'Tour Management',
  guests: 'Guest Directory',
  calendar: 'Booking Calendar',
  payments: 'Payments & Invoices',
  analytics: 'Analytics',
  notifications: 'Notifications',
};

export default function AdminLayout() {
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
        return <DashboardOverview />;
      case 'rooms':
        return <RoomManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'tours':
        return <TourManagement />;
      case 'guests':
        return <GuestList />;
      case 'calendar':
        return <BookingCalendar />;
      case 'payments':
        return <PaymentsInvoices />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      default:
        return <DashboardOverview />;
    }
  };

  const unreadNotifications = 3;

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* ─── Sidebar ─── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative flex flex-col bg-[#0a0e17] border-r border-slate-800/50 h-full z-20"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-[72px] border-b border-slate-800/50 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)] flex-shrink-0">
            <BedDouble className="w-5 h-5 text-slate-950" />
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
                  Hotel<span className="text-amber-500">Hub</span>
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-[80px] w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 z-30"
        >
          <ChevronLeft
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              sidebarCollapsed ? 'rotate-180' : ''
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
                  ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
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
                {/* Notification badge */}
                {item.id === 'notifications' && unreadNotifications > 0 && (
                  <span className={`${sidebarCollapsed ? 'absolute top-1 right-1' : 'ml-auto'} bg-amber-500 text-slate-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center`}>
                    {unreadNotifications}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-slate-800/50 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200">
            <Settings className="w-5 h-5 flex-shrink-0 text-slate-500" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button onClick={()=>{ router.push('/');}} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
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
        <header className="h-[72px] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">{menuTitles[activeMenu] || 'Dashboard'}</h2>
            <p className="text-xs text-slate-500">{currentDate}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-slate-900/60 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200 w-64"
              />
            </div>

            {/* Notifications Bell */}
            <button
              onClick={() => setActiveMenu('notifications')}
              className="relative p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 flex items-center justify-center text-sm font-semibold text-amber-400 border border-amber-500/30">
                JW
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">John Wick</p>
                <p className="text-[11px] text-slate-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
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
