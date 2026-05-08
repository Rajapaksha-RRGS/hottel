'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Home,
  Settings,
} from 'lucide-react';

interface TopBarProps {
  onMenuToggle: () => void;
}

const pageNames: Record<string, string> = {
  '/guest/dashboard': 'Dashboard',
  '/guest/dashboard/bookings': 'My Bookings',
  '/guest/dashboard/payments': 'Payments',
  '/guest/dashboard/profile': 'Profile',
  '/guest/dashboard/feedback': 'Feedback',
  '/guest/dashboard/complaints': 'Complaints',
};

export default function GuestTopBar({ onMenuToggle }: TopBarProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPageName = pageNames[pathname] || 'Dashboard';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-bone/10 flex items-center justify-between px-4 lg:px-6">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-bone/60 hover:text-bone rounded-lg hover:bg-bone/5 transition-colors"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="font-serif text-lg text-bone tracking-wide">
            {currentPageName}
          </h1>
          <p className="text-[11px] text-bone/40 tracking-wide hidden sm:block">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Guest'}
          </p>
        </div>
      </div>

      {/* Right: Actions + Profile */}
      <div className="flex items-center gap-3">
        {/* Back to website */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-bone/50 hover:text-gold border border-bone/10 rounded-lg hover:border-gold/30 transition-all"
        >
          <Home size={14} />
          <span>Website</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 text-bone/50 hover:text-bone rounded-lg hover:bg-bone/5 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full glass hover:border-gold/30 transition-all"
          >
            <div className="relative">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-gold/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
                  <User size={16} className="text-gold" />
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-charcoal" />
            </div>

            <span className="hidden md:block text-sm text-bone/80 font-medium max-w-[120px] truncate">
              {session?.user?.name || 'Guest'}
            </span>

            <ChevronDown
              size={14}
              className={`text-bone/40 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 glass rounded-xl overflow-hidden border border-bone/10 animate-fade-in-up">
              {/* Header */}
              <div className="px-4 py-3 border-b border-bone/10 bg-gold/5">
                <p className="font-serif text-sm text-bone truncate">
                  {session?.user?.name || 'Guest'}
                </p>
                <p className="text-[11px] text-bone/40 truncate mt-0.5">
                  {session?.user?.email}
                </p>
              </div>

              <div className="py-1.5">
                <Link
                  href="/guest/dashboard/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-bone/70 hover:text-gold hover:bg-bone/5 transition-all text-sm"
                >
                  <User size={16} className="text-gold/60" />
                  My Profile
                </Link>

                <Link
                  href="/guest/dashboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-bone/70 hover:text-gold hover:bg-bone/5 transition-all text-sm"
                >
                  <Settings size={16} className="text-gold/60" />
                  Settings
                </Link>

                <div className="border-t border-bone/10 my-1.5 mx-3" />

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
