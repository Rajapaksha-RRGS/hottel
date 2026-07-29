'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Users, Star, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/components/Footer';
import Navigation from '@/components/components/Herder';

// ── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'Cultural',
    label: 'Cultural',
    icon: '🏛️',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1920&q=80',
    description: 'Explore ancient temples, royal palaces and vibrant local traditions',
  },
  {
    id: 'Adventure',
    label: 'Adventure',
    icon: '🧗',
    heroImage: 'https://images.unsplash.com/photo-1546708973-b339540b5162?w=1920&q=80',
    description: 'Thrilling hikes, water sports and adrenaline-filled escapes',
  },
  {
    id: 'Wildlife',
    label: 'Wildlife',
    icon: '🐘',
    heroImage: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?w=1920&q=80',
    description: 'Safari jeep rides, elephant gatherings and rare species spotting',
  },
];

// ── Tour Interface ────────────────────────────────────────────────────────────
interface Tour {
  _id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  category: string;
  image: string;
  capacity: number;
  description?: string;
  status?: string;
  vehicle?: string;
  itinerary?: string;
  highlights?: string[];
}

// ── Landscape Tour Card ───────────────────────────────────────────────────────
function LandscapeCard({ tour, index }: { tour: Tour; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <Link href={`/tour/${tour._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
        className="group flex flex-col md:flex-row h-auto md:h-64 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      >
        {/* Image — alternating left/right */}
        <div className={`relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden shrink-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
          <img
            src={tour.image || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80'}
            alt={tour.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-amber-400 text-gray-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
            {tour.category}
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 p-6 flex flex-col justify-between ${isEven ? 'md:order-2' : 'md:order-1'}`}>
          <div>
            {/* Location */}
            <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
              <MapPin size={12} className="text-amber-500" />
              <span className="uppercase tracking-wider font-medium">{tour.location}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors leading-tight">
              {tour.name}
            </h3>

            {/* Description */}
            {tour.description && (
              <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                {tour.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Clock size={13} /> {tour.duration}</span>
              <span className="flex items-center gap-1"><Users size={13} /> Up to {tour.capacity}</span>
              {tour.vehicle && (
                <span className="flex items-center gap-1">🚐 {tour.vehicle}</span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
            {/* Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < Math.floor(tour.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
              ))}
              <span className="text-xs text-gray-400 ml-1">{tour.rating.toFixed(1)}</span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">From</p>
                <p className="text-lg font-extrabold text-gray-900">LKR {tour.price.toLocaleString()}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                View More <ArrowRight size={13} />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  // Auto-cycle hero background
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroImageIndex((p) => (p + 1) % CATEGORIES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/api/tours')
      .then((r) => r.json())
      .then((data) => setTours(data.tours || []))
      .catch(() => setError('Failed to load tours'))
      .finally(() => setLoading(false));
  }, []);

  // Helper: assign category for old DB records that lack it
  const getCategoryFallback = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('kandy') || n.includes('sigiriya') || n.includes('anuradhapura') || n.includes('temple') || n.includes('heritage') || n.includes('cultural')) return 'Cultural';
    if (n.includes('elephant') || n.includes('safari') || n.includes('whale') || n.includes('wildlife') || n.includes('yala')) return 'Wildlife';
    return 'Adventure';
  };

  const toursWithCategory = tours.map((t) => ({
    ...t,
    category: t.category || getCategoryFallback(t.name),
  }));

  const filteredTours = activeCategory
    ? toursWithCategory.filter((t) => t.category === activeCategory)
    : [];

  const selectedCat = CATEGORIES.find((c) => c.id === activeCategory);

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* ── Hero with Animated Slideshow ───────────────────────────────────── */}
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />

        <AnimatePresence mode="wait">
          <motion.img
            key={CATEGORIES[heroImageIndex].heroImage}
            src={CATEGORIES[heroImageIndex].heroImage}
            alt="Sri Lanka Tourism"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Slide Dots */}
        <div className="absolute bottom-6 right-8 z-20 flex items-center gap-2">
          {CATEGORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroImageIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${heroImageIndex === i ? 'bg-amber-400 w-8' : 'bg-white/50 w-2.5 hover:bg-white'}`}
            />
          ))}
        </div>

        {/* Hero text */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <span className="bg-amber-400 text-gray-900 text-[11px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-5 inline-block">
            Unforgettable Journeys
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-5 leading-tight drop-shadow-lg">
            Discover the Soul of{' '}
            <span className="text-amber-400 italic">Sri Lanka</span>
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
            Choose your experience below — cultural wonders, wildlife safaris and thrilling adventures await.
          </p>
        </div>
      </section>

      {/* ── Category Section ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-amber-500 uppercase text-xs tracking-[0.25em] mb-2 font-semibold">Choose Your Experience</p>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Tour Categories</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(cat.id)}
              className={`relative group overflow-hidden rounded-2xl h-64 text-left shadow-lg transition-all duration-300 ${
                activeCategory === cat.id ? 'ring-4 ring-amber-400 shadow-amber-200' : 'hover:shadow-2xl'
              }`}
            >
              {/* Background image */}
              <img
                src={cat.heroImage}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="text-3xl mb-2">{cat.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{cat.label}</h3>
                <p className="text-white/70 text-sm leading-snug mb-3">{cat.description}</p>
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all ${
                  activeCategory === cat.id
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-white/20 text-white group-hover:bg-amber-400 group-hover:text-gray-900'
                }`}>
                  View More <ChevronRight size={13} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Filtered Tour Grid ──────────────────────────────────────────────── */}
      <div ref={gridRef} />
      <AnimatePresence mode="wait">
        {activeCategory && (
          <motion.section
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto px-6 pb-20"
          >
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-amber-500 uppercase text-xs tracking-widest font-semibold mb-1">
                  {selectedCat?.icon} {activeCategory} Tours
                </p>
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900">
                  {loading ? 'Loading...' : `${filteredTours.length} tour${filteredTours.length !== 1 ? 's' : ''} available`}
                </h2>
              </div>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Clear filter
              </button>
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Cards */}
            {loading ? (
              <p className="text-gray-500 text-center py-12">Loading tours...</p>
            ) : filteredTours.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-4xl mb-4">{selectedCat?.icon}</p>
                <p className="text-gray-600 font-semibold mb-1">No {activeCategory} tours yet</p>
                <p className="text-gray-400 text-sm">Ask your admin to add {activeCategory.toLowerCase()} tours from the dashboard.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredTours.map((tour, i) => (
                  <LandscapeCard key={tour._id} tour={tour} index={i} />
                ))}
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}