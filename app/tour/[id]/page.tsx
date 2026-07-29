'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, ArrowLeft, Car, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/components/Herder';
import Footer from '@/components/components/Footer';

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

const CATEGORY_COLORS: Record<string, string> = {
  Cultural: 'bg-amber-400 text-gray-900',
  Adventure: 'bg-green-500 text-white',
  Wildlife: 'bg-emerald-600 text-white',
};

/** Google Maps search link for the location */
function buildGoogleLink(location: string): string {
  const q = encodeURIComponent(location + ' Sri Lanka');
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch('/api/tours')
      .then((r) => r.json())
      .then((data) => {
        const found = (data.tours || []).find((t: Tour) => t._id === id);
        if (found) setTour(found);
        else setError('Tour not found');
      })
      .catch(() => setError('Failed to load tour'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="inline-block w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading tour details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────
  if (error || !tour) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-5xl mx-auto px-6 py-32 text-center">
          <p className="text-5xl mb-4">🗺️</p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Tour Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'This tour is no longer available.'}</p>
          <Link href="/tour" className="inline-flex items-center gap-2 bg-amber-400 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-500 transition-colors">
            <ArrowLeft size={16} /> Back to Tours
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Parse itinerary: split on → or newlines
  const itinerarySteps = tour.itinerary
    ? tour.itinerary.split(/\n|→/).map((s) => s.trim()).filter(Boolean)
    : [];

  const highlightList = Array.isArray(tour.highlights)
    ? tour.highlights
    : typeof tour.highlights === 'string'
    ? (tour.highlights as string).split(',').map((h: string) => h.trim()).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 z-10" />
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          src={tour.image || 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1600&q=80'}
          alt={tour.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-10">
          {/* Back */}
          <Link href="/tour" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={15} /> Back to Tours
          </Link>

          {/* Category badge */}
          <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${CATEGORY_COLORS[tour.category] || 'bg-amber-400 text-gray-900'}`}>
            {tour.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-serif text-white mb-3 leading-tight drop-shadow-md">
            {tour.name}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-white/85 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={15} className="text-amber-400" />{tour.location}</span>
            <span className="flex items-center gap-1.5"><Clock size={15} className="text-amber-400" />{tour.duration}</span>
            <span className="flex items-center gap-1.5"><Users size={15} className="text-amber-400" />Up to {tour.capacity} guests</span>
            {tour.vehicle && <span className="flex items-center gap-1.5"><Car size={15} className="text-amber-400" />{tour.vehicle}</span>}
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: details ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            {tour.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <h2 className="text-xl font-bold text-gray-800 mb-3">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </motion.div>
            )}

            {/* Highlights */}
            {highlightList.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {highlightList.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                      <CheckCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Itinerary */}
            {itinerarySteps.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Day Itinerary</h2>
                <div className="relative border-l-2 border-amber-200 pl-5 space-y-4">
                  {itinerarySteps.map((step, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white shadow" />
                      <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { icon: <Clock size={18} className="text-amber-500" />, label: 'Duration', value: tour.duration },
                { icon: <Users size={18} className="text-amber-500" />, label: 'Max Guests', value: `${tour.capacity} people` },
                { icon: <Car size={18} className="text-amber-500" />, label: 'Vehicle', value: tour.vehicle || 'A/C Van' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-xs text-gray-500 uppercase font-bold tracking-wider">{s.label}</span></div>
                  <p className="text-gray-800 font-semibold text-sm">{s.value}</p>
                </div>
              ))}
            </motion.div>

            {/* ── Location Map ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={20} className="text-amber-500" />
                  Location
                </h2>
                <a
                  href={buildGoogleLink(tour.location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <MapPin size={12} />
                  Open in Google Maps
                </a>
              </div>

              {/* Location label */}
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-1.5">
                <MapPin size={13} className="text-amber-400 shrink-0" />
                {tour.location}, Sri Lanka
              </p>

              {/* Map embed */}
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                <iframe
                  title={`Map of ${tour.location}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(tour.location + ' Sri Lanka')}&t=m&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* Subtle overlay strip at top so iframe doesn't look raw */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400" />
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Map shows approximate area · Exact pickup point confirmed at booking
              </p>
            </motion.div>
          </div>

          {/* ── Right: Booking card ──────────────────────────────────── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Price header */}
              <div className="bg-amber-400 px-6 py-5 text-center">
                <p className="text-gray-700 text-xs uppercase font-bold tracking-widest mb-1">Price Per Person</p>
                <p className="text-3xl font-extrabold text-gray-900">LKR {tour.price.toLocaleString()}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.floor(tour.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">{tour.rating.toFixed(1)}</span>
                </div>

                {/* Quick info */}
                <div className="space-y-2 text-sm text-gray-600 border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between"><span>Duration</span><span className="font-semibold text-gray-800">{tour.duration}</span></div>
                  <div className="flex justify-between"><span>Group size</span><span className="font-semibold text-gray-800">Up to {tour.capacity}</span></div>
                  <div className="flex justify-between"><span>Vehicle</span><span className="font-semibold text-gray-800">{tour.vehicle || 'A/C Van'}</span></div>
                  <div className="flex justify-between"><span>Category</span><span className="font-semibold text-gray-800">{tour.category}</span></div>
                </div>

                {/* Book button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/tour/${id}/booking`)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl transition-colors text-sm tracking-wide"
                >
                  Book This Tour
                </motion.button>

                <p className="text-xs text-gray-400 text-center">
                  ✅ Free cancellation up to 24 hours before departure
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
