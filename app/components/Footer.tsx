'use client';

import React from 'react';
// import { 
//   Globe, 
//   MessageCircle, 
//   Heart, 
//   MapPin, 
//   Phone, 
//   Mail, 
//   ArrowRight 
// } from 'lucide-react';

// const Footer = () => {
//   return (
//     <footer className="bg-[#1a1a1a] border-t border-white/10 pt-20 pb-32 lg:pb-8 text-white">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
//           {/* Brand Section */}
//           <div className="lg:col-span-1">
//             <h3 className="font-serif text-3xl text-purple-500 mb-4 tracking-tighter">VITAMIN SEA</h3>
//             <p className="text-gray-400 mb-6">
//               A sanctuary of refined elegance where every moment is crafted for
//               extraordinary experiences in the heart of Trincomalee.
//             </p>
//             <div className="flex gap-4">
//               {[Globe, MessageCircle, Heart].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-purple-500 hover:border-purple-500 transition-colors"
//                 >
//                   <Icon size={18} />
//                 </a>
//               ))}
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
//               Quick Links
//             </h4>
//             <ul className="space-y-3">
//               {[
//                 "About Us",
//                 "Our Rooms",
//                 "Dining",
//                 "Spa & Wellness",
//                 "Events",
//               ].map((link) => (
//                 <li key={link}>
//                   <a
//                     href="#"
//                     className="text-gray-400 hover:text-purple-500 transition-colors"
//                   >
//                     {link}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact Details */}
//           <div>
//             <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
//               Contact
//             </h4>
//             <ul className="space-y-4">
//               <li className="flex items-start gap-3">
//                 <MapPin size={18} className="text-purple-500 mt-1 flex-shrink-0" />
//                 <span className="text-gray-400">
//                   Nilaveli Road, Trincomalee, Sri Lanka
//                 </span>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Phone size={18} className="text-purple-500 flex-shrink-0" />
//                 <a
//                   href="tel:+94123456789"
//                   className="text-gray-400 hover:text-purple-500 transition-colors"
//                 >
//                   +94 (77) 123-4567
//                 </a>
//               </li>
//               <li className="flex items-center gap-3">
//                 <Mail size={18} className="text-purple-500 flex-shrink-0" />
//                 <a
//                   href="mailto:reservations@vitaminsea.com"
//                   className="text-gray-400 hover:text-purple-500 transition-colors"
//                 >
//                   reservations@vitaminsea.com
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Newsletter Section */}
//           <div>
//             <h4 className="text-white font-medium mb-6 uppercase tracking-wider text-sm">
//               Newsletter
//             </h4>
//             <p className="text-gray-400 mb-4">
//               Subscribe for exclusive offers and updates.
//             </p>
//             <div className="flex">
//               <input
//                 type="email"
//                 placeholder="Your email"
//                 className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors rounded-l-md"
//               />
//               <button className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-r-md">
//                 <ArrowRight size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-gray-500 text-sm">
//             &copy; {new Date().getFullYear()} Vitamin Sea Hotel. All rights reserved.
//           </p>
//           <div className="flex gap-6 text-sm">
//             <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">
//               Privacy Policy
//             </a>
//             <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">
//               Terms of Service
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import { useState } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface NavLink {
  label: string;
  href: string;
}

interface NavColumn {
  heading: string;
  links: NavLink[];
}

// ─── Static Data ───────────────────────────────────────────────────────────────
const NAV_COLUMNS: NavColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "Fresh Vegetables", href: "/shop/vegetables" },
      { label: "Seasonal Fruits", href: "/shop/fruits" },
      { label: "Herbs & Greens", href: "/shop/herbs" },
      { label: "Weekly Boxes", href: "/shop/boxes" },
      { label: "Farmer Specials", href: "/shop/specials" },
    ],
  },
  {
    heading: "Our Farmers",
    links: [
      { label: "Meet the Families", href: "/farmers" },
      { label: "Farm Stories", href: "/farmers/stories" },
      { label: "Verified Partners", href: "/farmers/partners" },
      { label: "Become a Partner", href: "/farmers/join" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Delivery Areas", href: "/delivery" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Refund Policy", href: "/refunds" },
    ],
  },
];

const TRUST_BADGES = [
  { icon: "🌿", label: "500+ Farm Families" },
  { icon: "🚚", label: "24-Hour Delivery" },
  { icon: "✓", label: "Pesticide Checked" },
  { icon: "🏆", label: "Featured in Daily News" },
];

const LEGAL_LINKS: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

// ─── Icon Components (1px thin stroke) ────────────────────────────────────────
function IconFacebook() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconLeafFill() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 9-10 12-1.1-1.4-1-5 5-7z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook",  href: "https://facebook.com",        Icon: IconFacebook  },
  { label: "Instagram", href: "https://instagram.com",       Icon: IconInstagram },
  { label: "WhatsApp",  href: "https://wa.me/94XXXXXXXXX",   Icon: IconWhatsApp  },
];

// ─── tailwind.config.js note ───────────────────────────────────────────────────
// Add the following to your tailwind.config.js extend.fontFamily:
//   serif: ['"Playfair Display"', 'Georgia', 'serif'],
//   sans:  ['"DM Sans"', '"Helvetica Neue"', 'sans-serif'],
// And in your layout/globals, import Google Fonts:
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Thin 1px earth-tone divider with centred leaf motif */
function LeafDivider() {
  return (
    <div className="flex items-center gap-3 mb-16">
      <div className="flex-1 h-px bg-[#D9E4D0]" />
      <span className="text-[#C4A882]/60">
        <IconLeafFill />
      </span>
      <div className="flex-1 h-px bg-[#D9E4D0]" />
    </div>
  );
}

/** Rounded pill trust badge */
function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-[#E8EFE1] text-[#5C6B3A] text-[0.72rem] font-medium tracking-wide rounded-full px-3.5 py-1.5 select-none">
      <span className="text-sm leading-none">{icon}</span>
      {label}
    </span>
  );
}

/** Newsletter signup — organic rounded card */
function NewsletterCard() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setStatus("success");
  };

  return (
    <div className="bg-white rounded-[20px] border border-[#D9E4D0] p-10 flex flex-col gap-6 w-full max-w-md">

      {/* Eyebrow */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[50%_40%_50%_40%] bg-[#E8EFE1] flex items-center justify-center text-lg select-none">
          🌱
        </div>
        <span className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-[#8B6347]">
          Harvest Updates
        </span>
      </div>

      {/* Heading */}
      <div>
        <p className="font-serif text-[1.3rem] text-[#3D2B1F] leading-snug mb-2 font-normal">
          Get notified when{" "}
          <em className="text-[#5C6B3A] not-italic">fresh harvests</em> arrive
        </p>
        <p className="text-[0.8rem] text-[#9B9186] leading-relaxed">
          Weekly picks, seasonal specials and farmer stories — straight to your inbox.
        </p>
      </div>

      {/* Input or success */}
      {status === "success" ? (
        <div className="bg-[#E8EFE1] text-[#5C6B3A] text-[0.83rem] font-medium rounded-xl px-5 py-3.5">
          You&rsquo;re in! We&rsquo;ll reach you before the next harvest. 🌾
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="
              flex-1 bg-[#F4F7F0] border border-[#D9E4D0] rounded-xl
              px-4 py-3 text-[0.83rem] text-[#3D2B1F] placeholder:text-[#9B9186]
              outline-none transition-colors duration-200
              focus:border-[#C4A882]
            "
          />
          <button
            type="submit"
            className="
              bg-[#5C6B3A] hover:bg-[#3D2B1F] text-[#FDFAF5]
              rounded-xl px-5 py-3 text-[0.8rem] font-medium tracking-wide
              transition-colors duration-200 whitespace-nowrap cursor-pointer
            "
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}

/** Single nav column */
function NavColumn({ heading, links }: NavColumn) {
  return (
    <div>
      <p className="text-[0.68rem] font-semibold tracking-[0.15em] uppercase text-[#8B6347] mb-5">
        {heading}
      </p>
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className="text-[0.87rem] text-[#5A5247] hover:text-[#5C6B3A] transition-colors duration-150 leading-relaxed"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Footer Export ────────────────────────────────────────────────────────
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F4F7F0] border-t border-[#D9E4D0] font-sans">

      {/* ── 1. Brand + Newsletter ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 lg:px-10 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-5">
              <span className="font-serif text-[1.55rem] text-[#3D2B1F] tracking-tight font-semibold">
                Farm<span className="text-[#5C6B3A]">Fresh</span>
              </span>
            </Link>

            <p className="text-[0.87rem] text-[#5A5247] leading-[1.85] mb-7 max-w-xs">
              Connecting 500+ Sri Lankan farming families directly to your table —
              harvested this morning, at your door by evening.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5 mb-8">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    w-10 h-10 flex items-center justify-center rounded-full
                    bg-white border border-[#D9E4D0] text-[#8B6347]
                    hover:border-[#C4A882] hover:text-[#5C6B3A]
                    transition-colors duration-200
                  "
                >
                  <Icon />
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              {TRUST_BADGES.map((b) => (
                <TrustBadge key={b.label} {...b} />
              ))}
            </div>
          </div>

          {/* Newsletter — right-aligned on large screens */}
          <div className="lg:justify-self-end w-full">
            <NewsletterCard />
          </div>
        </div>
      </div>

      {/* ── 2. Nav Columns ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-8 lg:px-10 pb-16">
        <LeafDivider />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-16">
          {NAV_COLUMNS.map((col) => (
            <NavColumn key={col.heading} {...col} />
          ))}
        </div>
      </div>

      {/* ── 3. Delivery ribbon ────────────────────────────────────────────── */}
      <div className="border-t border-[#D9E4D0]">
        <div className="max-w-6xl mx-auto px-8 lg:px-10 py-7">
          <div className="flex flex-wrap gap-5 justify-center md:justify-between items-center">
            <div className="flex items-center gap-2.5 text-[0.8rem] text-[#8B6347]">
              <span className="text-base">🛻</span>
              <span>
                Free delivery over{" "}
                <strong className="text-[#5C6B3A] font-semibold">Rs. 2,500</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.8rem] text-[#8B6347]">
              <span className="text-base">🕗</span>
              <span>
                Order before{" "}
                <strong className="text-[#5C6B3A] font-semibold">8 PM</strong> for same-morning harvest
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.8rem] text-[#8B6347]">
              <span className="text-base">📍</span>
              <span>
                Serving{" "}
                <strong className="text-[#5C6B3A] font-semibold">Colombo, Gampaha & Kandy</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Legal bar ──────────────────────────────────────────────────── */}
      <div className="border-t border-[#D9E4D0]">
        <div className="max-w-6xl mx-auto px-8 lg:px-10 py-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">

            <p className="text-[0.75rem] text-[#9B9186] tracking-wide">
              © {year} FarmFresh Sri Lanka. All rights reserved.
            </p>

            <nav aria-label="Legal">
              <ul className="flex gap-5 flex-wrap justify-center">
                {LEGAL_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-[0.75rem] text-[#9B9186] hover:text-[#5C6B3A] transition-colors duration-150 tracking-wide"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="text-[0.72rem] text-[#C4A882] tracking-wide hidden sm:block">
              Grown with love in Sri Lanka 🌿
            </p>

          </div>
        </div>
      </div>

    </footer>
  );
}