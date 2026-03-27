"use client";
import Link from 'next/link';
import { useState } from 'react';
import UserProfile from "./UseProfile";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 top-0 bg-white backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider text-gray-800">
            Vitamin Sea
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Beach Hotel
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-purple-600">
            Home
          </Link>
          <Link href="/menu" className="hover:text-purple-600">
            Menu
          </Link>
          <Link
            href="/rooms"
            className="hover:text-purple-600 font-semibold border-b-2 border-purple-600"
          >
            Rooms
          </Link>
          <Link href="/tour" className="hover:text-purple-600">
            Tour
          </Link>
          <Link href="/about" className="hover:text-purple-600">
            About
          </Link>
          <Link href="/contact" className="hover:text-purple-600">
            Contact
          </Link>
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <UserProfile />
        </div>
      </div>
    </header>
  );
};

export default Header;
