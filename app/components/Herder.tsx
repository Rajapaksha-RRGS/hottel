"use client";
import Link from 'next/link';
import { useState } from 'react';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 bg-white backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider text-gray-800">Vitamin Sea</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Beach Hotel</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          <Link href="/menu" className="hover:text-purple-600">Menu</Link>
          <Link href="/rooms" className="hover:text-purple-600 font-semibold border-b-2 border-purple-600">Rooms</Link>
          <Link href="/tour" className="hover:text-purple-600">Tour</Link>
          <Link href="/about" className="hover:text-purple-600">About</Link>
          <Link href="/contact" className="hover:text-purple-600">Contact</Link>
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
  onClick={() => setIsProfileOpen(!isProfileOpen)}
  className="group flex items-center space-x-3 p-1 pr-4 transition-all duration-500 rounded-full focus:outline-none 
             bg-white/5 backdrop-blur-sm border border-white/20 hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
>
  {/* Profile Image with Water Glow */}
  <div className="relative p-0.5">
    <img
      src="https://via.placeholder.com/40"
      alt="Profile"
      className="w-10 h-10 rounded-full object-cover border border-white/30 shadow-inner"
    />
    {/* Aqua pulse indicator */}
    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full border border-white animate-pulse"></span>
  </div>

  {/* User Info */}
  <div className="text-left hidden sm:block">
    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-wide">
      Gayan Sanjeewa
    </p>
    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
      Hotel Manager
    </p>
  </div>

  {/* Soft Water Drop Arrow */}
  <svg 
    className={`w-4 h-4 text-gray-500 transition-transform duration-500 ${isProfileOpen ? 'rotate-180 text-gray-900' : ''}`} 
    fill="none" stroke="currentColor" viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
  </svg>
</button>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-4 border-b border-gray-200">
                <p className="font-bold text-gray-900">Gayan sanjeewa</p>
                <p className="text-sm font-medium text-gray-700">Rajapaksha</p>
                <p className="text-xs text-gray-500 mt-1">gayansanjiwa0129@gmail.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/bookings"
                  className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>My Bookings</span>
                </Link>

                <Link
                  href="/chats"
                  className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>My Chats</span>
                </Link>

                <Link
                  href="/invoices"
                  className="flex items-center space-x-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>My Invoices</span>
                </Link>

                <div className="border-t border-gray-200 my-2"></div>

                <button
                  onClick={() => setIsProfileOpen(false)}
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
      </div>
    </header>
  );
};

export default Header;
