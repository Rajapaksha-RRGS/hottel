'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  User,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Utensils,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/guest/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Bookings',
    href: '/guest/dashboard/bookings',
    icon: Calendar,
  },
  {
    name: 'Dining',
    href: '/guest/dashboard/dining',
    icon: Utensils,
  },
  {
    name: 'Payments',
    href: '/guest/dashboard/payments',
    icon: CreditCard,
  },
  {
    name: 'Profile',
    href: '/guest/dashboard/profile',
    icon: User,
  },
  {
    name: 'Feedback',
    href: '/guest/dashboard/feedback',
    icon: MessageSquare,
  },
  {
    name: 'Complaints',
    href: '/guest/dashboard/complaints',
    icon: AlertCircle,
  },
];

export default function GuestSidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-charcoal/95 backdrop-blur-xl border-r border-bone/10`}
      >
        {/* Branding */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-bone/10 overflow-hidden relative">
          <Link href="/" className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? 'mx-auto' : ''}`}>
            <span className={`font-serif text-gold transition-all duration-300 whitespace-nowrap ${
              isCollapsed ? 'text-lg' : 'text-xl tracking-wider'
            }`}>
              {isCollapsed ? 'VS' : 'VITAMIN SEA'}
            </span>
          </Link>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden text-bone/60 hover:text-bone p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Guest label */}
        <div className={`py-3 border-b border-bone/5 flex items-center overflow-hidden transition-all duration-300 ${
          isCollapsed ? 'justify-center px-0' : 'px-4'
        }`}>
          <p className={`uppercase text-gold/60 font-medium transition-all duration-300 whitespace-nowrap ${
            isCollapsed ? 'text-[9px] tracking-normal' : 'text-[10px] tracking-[0.2em]'
          }`}>
            {isCollapsed ? 'GP' : 'Guest Portal'}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 dashboard-scroll overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${active
                    ? 'sidebar-link-active rounded-lg'
                    : 'sidebar-link text-bone/60 hover:text-gold'
                  }
                  ${isCollapsed ? 'justify-center px-2' : ''}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon
                  size={20}
                  className={`flex-shrink-0 transition-colors ${
                    active ? 'text-gold' : 'text-bone/40 group-hover:text-gold/80'
                  }`}
                />
                <span className={`text-sm font-medium tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                  isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-1'
                } ${active ? 'text-gold' : ''}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex items-center justify-center py-4 border-t border-bone/10">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-bone/40 hover:text-gold hover:bg-bone/5 transition-all"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}
