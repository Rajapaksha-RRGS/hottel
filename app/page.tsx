"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/components/Herder";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import Footer from "../components/components/Footer";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Menu,
  X,
  Calendar,
  Users,
  ChevronDown,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Wifi,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Sparkles,
  Globe,
  MessageCircle,
  Heart,
} from "lucide-react";

import UserProfile from "../components/components/UseProfile";

// Navigation Component


// Hero Section Component
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background Placeholder */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center" />
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-gold tracking-[0.4em] uppercase text-sm md:text-base mb-6"
        >
          Welcome to Luxury
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-bone mb-6 leading-tight"
        >
          Where Elegance
          <br />
          <span className="text-gold-gradient">Meets Serenity</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-bone/70 text-lg md:text-xl max-w-2xl mb-10"
        >
          Discover an unparalleled experience of refined comfort and timeless
          sophistication
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#rooms"
            className="px-8 py-4 bg-gold text-charcoal font-medium tracking-wide uppercase hover:bg-gold-light transition-all duration-300 flex items-center gap-2 group"
          >
            Explore Rooms
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#experiences"
            className="px-8 py-4 border border-bone/30 text-bone font-medium tracking-wide uppercase hover:border-gold hover:text-gold transition-all duration-300"
          >
            Our Story
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-bone/50 text-xs tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border border-bone/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Room Card Component
interface RoomCardProps {
  title: string;
  price: string;
  image: string;
  size: string;
  available: boolean;
  featured?: boolean;
  className?: string;
}

const RoomCard = ({
  title,
  price,
  image,
  size,
  available,
  featured,
  className,
}: RoomCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={`relative group overflow-hidden glass-light rounded-lg ${className}`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
      </div>

      {/* Availability Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 glass px-3 py-1.5 rounded-full">
        <span
          className={`w-2 h-2 rounded-full ${
            available ? "bg-green-500 availability-dot" : "bg-red-500"
          }`}
        />
        <span className="text-xs text-bone/80">
          {available ? "Available" : "Booked"}
        </span>
      </div>

      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 bg-gold text-charcoal px-3 py-1 text-xs font-medium uppercase tracking-wider">
          Featured
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        <div className="mb-2 flex items-center gap-1 text-gold">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill="currentColor" />
          ))}
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-bone mb-2">
          {title}
        </h3>
        <p className="text-bone/60 text-sm mb-4">{size}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-gold text-2xl font-serif">${price}</span>
            <span className="text-bone/50 text-sm"> / night</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gold/20 border border-gold/50 text-gold text-sm uppercase tracking-wide hover:bg-gold hover:text-charcoal transition-all duration-300"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Rooms Section with Bento Grid
const RoomsSection = () => {
  const rooms = [
    {
      title: "Presidential Suite",
      price: "1,299",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      size: "250 m² • King Bed • Ocean View",
      available: true,
      featured: true,
    },
    {
      title: "Presidential Suite",
      price: "1,299",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      size: "250 m² • King Bed • Ocean View",
      available: true,
      featured: true,
    },
    {
      title: "Grand Deluxe",
      price: "599",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
      size: "120 m² • Queen Bed • City View",
      available: true,
      featured: false,
    },
    {
      title: "Ocean Villa",
      price: "899",
      image:
        "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80",
      size: "180 m² • King Bed • Private Pool",
      available: false,
      featured: false,
    },
    {
      title: "Garden Suite",
      price: "449",
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      size: "95 m² • Twin Beds • Garden View",
      available: true,
      featured: false,
    },
    {
      title: "Royal Penthouse",
      price: "2,499",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      size: "400 m² • Master Suite • 360° View",
      available: true,
      featured: true,
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="rooms" className="py-24 px-6 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            Accommodations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bone mb-6">
            Our Rooms & Suites
          </h2>
          <p className="text-bone/60 max-w-2xl mx-auto">
            Each room is a sanctuary of comfort, designed with meticulous
            attention to detail and an unwavering commitment to luxury.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          <RoomCard
            {...rooms[0]}
            className="md:col-span-2 md:row-span-2 min-h-[400px] lg:min-h-[620px]"
          />
          <RoomCard {...rooms[1]} className="min-h-[300px]" />
          <RoomCard {...rooms[2]} className="min-h-[300px]" />
          <RoomCard {...rooms[3]} className="min-h-[300px]" />
          <RoomCard
            {...rooms[4]}
            className="md:col-span-2 min-h-[300px] lg:min-h-[400px]"
          />
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href="/rooms"
            className="inline-flex items-center gap-2 text-gold border-b border-gold/50 pb-1 hover:border-gold transition-colors group"
          >
            View All Accommodations
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Amenities Section
const AmenitiesSection = () => {
  const amenities = [
    { icon: Wifi, name: "High-Speed WiFi", desc: "Complimentary throughout" },
    { icon: Car, name: "Valet Parking", desc: "24/7 service available" },
    {
      icon: UtensilsCrossed,
      name: "Fine Dining",
      desc: "Michelin-starred restaurant",
    },
    {
      icon: Dumbbell,
      name: "Fitness Center",
      desc: "State-of-the-art equipment",
    },
    { icon: Waves, name: "Infinity Pool", desc: "Rooftop ocean views" },
    { icon: Sparkles, name: "Spa & Wellness", desc: "Rejuvenating treatments" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-charcoal to-charcoal/95">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-4">
            World-Class
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-bone">
            Amenities & Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {amenities.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-light p-6 rounded-lg text-center group cursor-pointer"
            >
              <item.icon
                size={32}
                className="mx-auto mb-4 text-gold group-hover:scale-110 transition-transform"
              />
              <h3 className="text-bone font-medium mb-1">{item.name}</h3>
              <p className="text-bone/50 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Booking Bar Component
const BookingBar = () => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2 Adults");
  const [error, setError] = useState("");
  const { setSearchData } = useSearch();

  const handleCheckAvailability = () => {
    setError("");

    // Validate dates
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }

    // Validate that checkout is after checkin
    if (new Date(checkIn) >= new Date(checkOut)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    // Navigate to /rooms with URL query parameters
    setSearchData({ checkIn, checkOut, guests });
    router.push(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:relative lg:bottom-auto">
      <div className="glass border-t border-bone/10 lg:border lg:rounded-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 lg:py-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Check In */}
            <div className="flex-1 flex items-center gap-3 p-3 bg-bone/5 rounded-lg">
              <Calendar size={20} className="text-gold" />
              <div className="flex-1">
                <label className="text-bone/50 text-xs uppercase tracking-wider">
                  Check In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-transparent text-bone outline-none mt-1"
                />
              </div>
            </div>

            {/* Check Out */}
            <div className="flex-1 flex items-center gap-3 p-3 bg-bone/5 rounded-lg">
              <Calendar size={20} className="text-gold" />
              <div className="flex-1">
                <label className="text-bone/50 text-xs uppercase tracking-wider">
                  Check Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => {
                    setCheckOut(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-transparent text-bone outline-none mt-1"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex-1 flex items-center gap-3 p-3 bg-bone/5 rounded-lg">
              <Users size={20} className="text-gold" />
              <div className="flex-1">
                <label className="text-bone/50 text-xs uppercase tracking-wider">
                  Guests
                </label>
                <div className="relative">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-transparent text-bone outline-none mt-1 appearance-none cursor-pointer"
                  >
                    <option value="1 Adult">1 Adult</option>
                    <option value="2 Adults">2 Adults</option>
                    <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                    <option value="2 Adults, 2 Children">
                      2 Adults, 2 Children
                    </option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-bone/50 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Book Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckAvailability}
              className="lg:flex-shrink-0 px-8 py-4 bg-gold text-charcoal font-medium uppercase tracking-wider hover:bg-gold-light transition-colors"
            >
              Check Availability
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component


// Main Page Component
export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />

      {/* Booking Bar - Desktop Position */}
      <section
        id="booking"
        className="hidden lg:block -mt-12 relative z-20 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <BookingBar />
        </div>
      </section>

      <RoomsSection />
      <AmenitiesSection />
      <Footer />

      {/* Mobile Booking Bar */}
      <div className="lg:hidden">
        <BookingBar />
      </div>
    </main>
  );
}
