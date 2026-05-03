'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  User,
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function UserProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="relative">
      {/* Not logged in - Show Login Button */}
      {status === "unauthenticated" ? (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-gold text-charcoal font-medium text-sm tracking-wide uppercase hover:bg-gold-light transition-all duration-300"
        >
          Login
        </button>
      ) : status === "authenticated" ? (
        /* Logged in - Show User Card with Dropdown */
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group flex items-center gap-3 p-1.5 pr-4 transition-all duration-300 rounded-full focus:outline-none
              glass hover:border-gold/30"
          >
            {/* Profile Image */}
            <div className="relative">
              <img
                src={session?.user?.image || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-gold/50"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-charcoal availability-dot"></span>
            </div>

            {/* User Info (Desktop) */}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-bone group-hover:text-gold transition-colors">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] font-medium text-gold/70 uppercase tracking-widest">
                {session?.user?.role || "Guest"}
              </p>
            </div>

            {/* Dropdown Arrow */}
            <ChevronDown
              size={16}
              className={`text-bone/50 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 glass rounded-lg overflow-hidden z-50 border border-bone/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-bone/10 bg-gold/10">
                <p className="font-serif text-lg text-bone">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-bone/50 mt-1">
                  {session?.user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-bone/80 hover:text-gold hover:bg-bone/5 transition-all duration-200"
                >
                  <User size={18} className="text-gold/70" />
                  <span className="text-sm">My Profile</span>
                </Link>

                <Link
                  href="/bookings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-bone/80 hover:text-gold hover:bg-bone/5 transition-all duration-200"
                >
                  <Calendar size={18} className="text-gold/70" />
                  <span className="text-sm">My Bookings</span>
                </Link>

                <Link
                  href="/invoices"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-6 py-3 text-bone/80 hover:text-gold hover:bg-bone/5 transition-all duration-200"
                >
                  <FileText size={18} className="text-gold/70" />
                  <span className="text-sm">My Invoices</span>
                </Link>

                {/* Admin Menu - Show only for Admin users */}
                {session?.user?.role === "Admin" && (
                  <>
                    <div className="border-t border-bone/10 my-2 mx-4"></div>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 text-gold hover:bg-gold/10 transition-all duration-200"
                    >
                      <LayoutDashboard size={18} />
                      <span className="text-sm font-medium">
                        Admin Dashboard
                      </span>
                    </Link>
                  </>
                )}

                <div className="border-t border-bone/10 my-2 mx-4"></div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Loading state
        <div className="px-6 py-2 glass text-bone/50 text-sm rounded-full animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
}
