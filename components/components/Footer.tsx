'use client';

import React from 'react';
import { 
  Globe, 
  MessageCircle, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] border-t border-white/10 pt-20 pb-32 lg:pb-8 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-3xl text-purple-500 mb-4 tracking-tighter">VITAMIN SEA</h3>
            <p className="text-gray-400 mb-6">
              A sanctuary of refined elegance where every moment is crafted for
              extraordinary experiences in the heart of Trincomalee.
            </p>
            <div className="flex gap-4">
              {[Globe, MessageCircle, Heart].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:border-purple-500 transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Our Rooms",
                "Dining",
                "Spa & Wellness",
                "Events",
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-purple-500 mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  Nilaveli Road, Trincomalee, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-purple-500 flex-shrink-0" />
                <a
                  href="tel:+94123456789"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  +94 (77) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-purple-500 flex-shrink-0" />
                <a
                  href="mailto:reservations@vitaminsea.com"
                  className="text-gray-400 hover:text-purple-500 transition-colors"
                >
                  reservations@vitaminsea.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors rounded-l-md"
              />
              <button className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-r-md">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Vitamin Sea Hotel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;