'use client';

import { Suspense } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRooms } from "@/features/services/hooks/useRooms";
import FilterBar from "@/features/services/components/FilterBar";
import RoomCard from "@/features/services/components/RoomCard";
import QuickViewModal from "@/features/services/components/QuickViewModal";
import Navigation from "@/components/components/Herder";
import Footer from "@/components/components/Footer";

function RoomPageContent() {
  const {
    filteredRooms,
    loading,
    error,
    activeCheckIn,
    activeCheckOut,
    filters,
    selectedRoom,
    setSelectedRoom,
    formatDate,
    handleFilterChange,
    handleClearSearch,
  } = useRooms();

  return (
    <div className="min-h-screen bg-charcoal text-bone">
      {/* Hero Section */}
      <Navigation />
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
              backgroundAttachment: "fixed",
            }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />
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
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gold uppercase text-sm font-light tracking-widest mb-4"
          >
            Luxury Accommodation
          </motion.p>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-bone mb-6 leading-tight"
          >
            Our Sanctuary
          </motion.h1>

          {/* Gold Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8 }}
            className="h-1 w-20 bg-gold mx-auto mb-6"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-bone/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed"
          >
            Experience unparalleled luxury and comfort in our exquisitely
            designed rooms and suites, each offering breathtaking views and
            world-class amenities.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-10"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(197, 160, 89, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gold text-charcoal rounded-full font-semibold uppercase tracking-widest hover:bg-gold-light transition-all"
            >
              Explore Suites
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 z-10 text-bone/70 text-center"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-widest font-light">
              Scroll to explore
            </p>
            <svg
              className="w-5 h-5 text-gold animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Date Filter Feedback */}
      {activeCheckIn && activeCheckOut && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-gold border-y border-gold/20 px-6 py-4"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-gold rounded-full availability-dot" />
              <p className="text-bone/90 font-medium text-sm md:text-base">
                Showing available rooms for{" "}
                <span className="text-gold font-semibold">
                  {formatDate(activeCheckIn)} — {formatDate(activeCheckOut)}
                </span>
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearSearch}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all text-xs font-semibold uppercase tracking-wider"
            >
              <X size={16} />
              <span>Clear</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Filter Bar */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* Rooms Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold uppercase text-xs tracking-[0.25em] mb-2 font-light">
            Curated Living
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-bone mb-4">
            {filters.category
              ? `Our ${filters.category}s`
              : "All Rooms & Suites"}
          </h2>
          <div className="h-0.5 w-16 bg-gold mx-auto mb-4" />
          <p className="text-bone/60 text-base">
            {loading
              ? "Loading rooms..."
              : `${filteredRooms.length} luxurious options available`}
          </p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </motion.div>

        {/* Rooms Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gold text-lg">Loading available rooms...</p>
          </motion.div>
        ) : filteredRooms.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
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
            className="text-center py-20 glass-light rounded-2xl p-8 max-w-xl mx-auto"
          >
            <p className="text-bone/80 text-lg mb-6">
              {activeCheckIn && activeCheckOut
                ? "No rooms available for these dates. Try different dates or clear filters."
                : "No rooms available. Please select dates to search."}
            </p>
            <button
              onClick={handleClearSearch}
              className="px-6 py-3 bg-gold text-charcoal rounded-full font-semibold uppercase tracking-wider hover:bg-gold-light transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-charcoal via-charcoal/90 to-charcoal py-20 border-t border-bone/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-gold uppercase text-xs tracking-[0.2em] mb-2">
              Unrivaled Quality
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-bone">
              Premium Amenities
            </h2>
            <div className="h-0.5 w-12 bg-gold mx-auto mt-3" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Luxury Bedding",
              "Spa Access",
              "Ocean Views",
              "Fine Dining",
              "24/7 Room Service",
              "Concierge",
              "Fitness Center",
              "Beach Access",
            ].map((amenity, index) => (
              <motion.div
                key={amenity}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="glass-light rounded-xl p-6 text-center hover:border-gold/40 transition-all duration-300 group"
              >
                <p className="text-bone font-medium group-hover:text-gold transition-colors">
                  {amenity}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
        checkIn={activeCheckIn}
        checkOut={activeCheckOut}
      />
      <Footer />
    </div>
  );
}

export default function RoomPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-charcoal text-gold flex items-center justify-center">
          Loading rooms sanctuary...
        </div>
      }
    >
      <RoomPageContent />
    </Suspense>
  );
}
