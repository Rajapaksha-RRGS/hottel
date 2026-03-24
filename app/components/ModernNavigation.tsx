'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Search, User } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
} from './Navi'

export default function ModernNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white shadow-md"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
              aria-label="HottelHub - Home"
            >
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="hidden sm:inline text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                HottelHub
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Accommodations */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 focus:text-blue-600">
                    Accommodations
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-96 p-4 space-y-3">
                    <NavigationMenuLink
                      href="/hotels"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">Hotels</div>
                      <p className="text-sm text-gray-600">
                        Browse our luxury hotel collection
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/resorts"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">Resorts</div>
                      <p className="text-sm text-gray-600">
                        All-inclusive resort experiences
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/vacation-rentals"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">
                        Vacation Rentals
                      </div>
                      <p className="text-sm text-gray-600">
                        Unique stays and private homes
                      </p>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Experiences */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-700 hover:text-blue-600 focus:text-blue-600">
                    Experiences
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-96 p-4 space-y-3">
                    <NavigationMenuLink
                      href="/tours"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">Tours</div>
                      <p className="text-sm text-gray-600">
                        Guided tours and adventures
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/dining"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">Dining</div>
                      <p className="text-sm text-gray-600">
                        Restaurant reservations and recommendations
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="/activities"
                      className="block p-3 rounded-lg hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <div className="font-semibold text-gray-900">
                        Activities
                      </div>
                      <p className="text-sm text-gray-600">
                        Local attractions and activities
                      </p>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* About */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/about"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded transition-colors"
                  >
                    About
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Contact */}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    href="/contact"
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 focus:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded transition-colors"
                  >
                    Contact
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex items-center">
              <button
                aria-label="Search hotels and experiences"
                className="p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <Search size={20} />
              </button>
            </div>

            {/* User Account */}
            <button
              aria-label="User account menu"
              className="hidden sm:flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <User size={20} />
              <span className="hidden md:inline text-sm">Account</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="lg:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden bg-gray-50 border-t border-gray-200 py-4 space-y-2"
          >
            <Link
              href="/hotels"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hotels
            </Link>
            <Link
              href="/resorts"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resorts
            </Link>
            <Link
              href="/vacation-rentals"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vacation Rentals
            </Link>
            <Link
              href="/tours"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tours
            </Link>
            <Link
              href="/dining"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dining
            </Link>
            <Link
              href="/activities"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Activities
            </Link>
            <hr className="my-2" />
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
