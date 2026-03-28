'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import FilterBar from '@/app/components/FilterBar';
import RoomCard from '@/app/components/RoomCard';
import QuickViewDrawer from '@/app/components/QuickViewDrawer';


export default function RoomPage() {

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [filters, setFilters] = useState<{ category: string | null; maxPrice: number }>({
    category: null,
    maxPrice: 1000,
  });

  interface Room {
  id: string;
  name: string;
  category: 'Suite' | 'Deluxe' | 'Villa';
  price: number;
  image: string;
  gallery: string[];
  sqft: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  description: string;
  maxGuests: number;
 }
 const roomsData: Room[] = [ {
    id: '1',
    name: 'Ocean View Suite',
    category: 'Suite',
    price: 450,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=80',
      'https://images.unsplash.com/photo-1684359432679-eac58cb4b68b?w=1000&q=80',
      'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1000&q=80',
    ],
    sqft: 450,
    bedType: 'King Bed',
    viewType: 'Ocean Front',
    amenities: ['Wifi', 'AC', 'Pool', 'Spa', 'SeaView'],
    description: 'Luxurious ocean-facing suite with private balcony and premium amenities.',
    maxGuests: 2,
  }]; 

  // Filter rooms based on selected filters
  const filteredRooms = roomsData.filter((room) => {
    const categoryMatch = !filters.category || room.category === filters.category;
    const priceMatch = room.price <= filters.maxPrice;
    return categoryMatch && priceMatch;
  });

  const handleFilterChange = (category: string | null, maxPrice: number) => {
    setFilters({ category, maxPrice });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Parallax Background */}
        <motion.div
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80")',
              backgroundAttachment: 'fixed',
            }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white uppercase text-sm font-light tracking-widest mb-4"
          >
            Luxury Accommodation
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight"
          >
            Our Sanctuary
          </motion.h1>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
            className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-6"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-white/90 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            Experience unparalleled luxury and comfort in our exquisitely designed rooms and suites,
            each offering breathtaking views and world-class amenities
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(168, 85, 247, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold uppercase tracking-widest hover:shadow-2xl transition-all"
            >
              Explore Suites
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-10 z-10 text-white text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm uppercase tracking-widest font-light">Scroll to explore</p>
            <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Rooms Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            {filters.category ? `Our ${filters.category}s` : 'All Rooms & Suites'}
          </h2>
          <p className="text-gray-600 text-lg">
            {filteredRooms.length} luxurious options available
          </p>
        </motion.div>

        {/* Rooms Grid - Bento Layout */}
        {filteredRooms.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <RoomCard
                  room={room}
                  onQuickView={setSelectedRoom}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-lg">
              No rooms match your filters. Please adjust your selection.
            </p>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-purple-900 to-pink-900 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-white text-center mb-12"
          >
            Premium Amenities
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Luxury Bedding', 'Spa Access', 'Ocean Views', 'Fine Dining', '24/7 Room Service', 'Concierge', 'Fitness Center', 'Beach Access'].map((amenity, index) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center hover:bg-white/20 transition"
              >
                <p className="text-white font-semibold">{amenity}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Drawer */}
      <QuickViewDrawer room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  );
}
