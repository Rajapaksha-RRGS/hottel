'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export default function UserProfile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Navigate to login page
  const handleLogin = () => {
    router.push("/login");
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsProfileOpen(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div className="relative">
      {/* 1. Not logged in - Show Login Button */}
      {status === 'unauthenticated' ? (
        <button
          onClick={handleLogin}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md"
        >
          Login
        </button>
      ) : status === 'authenticated' ? (
        /* 2. Logged in - Show User Card with Dropdown */
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="group flex items-center space-x-3 p-1 pr-4 transition-all duration-500 rounded-full focus:outline-none 
              bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            {/* Profile Image */}
            <div className="relative p-0.5">
              <img
                src={session?.user?.image || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-white/30"
              />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white animate-pulse"></span>
            </div>

            {/* User Info (Desktop) */}
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {session?.user?.name || "User"}
              </p>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                {session?.user?.role || "User"}
              </p>
            </div>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${isProfileOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-4 border-b border-gray-200">
                <p className="font-bold text-gray-900">{session?.user?.name || "User"}</p>
                <p className="text-xs text-gray-500 mt-1">{session?.user?.email}</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* User Menu - Show for all users */}
                <Link href="/profile" className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition">
                  <span className="text-sm">My Profile</span>
                </Link>

                <Link href="/bookings" className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition">
                  <span className="text-sm">My Bookings</span>
                </Link>

                <Link href="/invoices" className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition">
                  <span className="text-sm">My Invoices</span>
                </Link>

                {/* Admin Menu - Show only for Admin users */}
                {session?.user?.role === 'Admin' && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link href="/admin/dashboard" className="flex items-center space-x-3 px-6 py-3 text-blue-600 hover:bg-blue-50 transition font-medium">
                      <span className="text-sm">Admin Dashboard</span>
                    </Link>
                  </>
                )}

                <div className="border-t border-gray-200 my-2"></div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-6 py-3 text-red-500 hover:bg-red-50 transition font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Loading state
        <div className="px-6 py-2 bg-gray-200 text-gray-600 font-semibold rounded-full">
          Loading...
        </div>
      )}
    </div>
  );
}