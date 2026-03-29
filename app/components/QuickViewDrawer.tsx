'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import BookingForm from "./BookingForm";

interface QuickViewDrawerProps {
  room: any | null;
  onClose: () => void;
}

export default function QuickViewDrawer({
  room,
  onClose,
}: QuickViewDrawerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.gallery.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + room.gallery.length) % room.gallery.length,
    );
  };

  return (
    <AnimatePresence>
      {room && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 overflow-y-auto shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-6 left-6 md:right-6 md:left-auto bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Image Gallery */}
            <div className="relative h-64 md:h-80 bg-gray-200 overflow-hidden">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={room.gallery[currentImageIndex]}
                alt={room.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {room.gallery.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {room.gallery.length}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Price Tag */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif text-gray-900">
                    {room.name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{room.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-purple-600">
                    ${room.price}
                  </p>
                  <p className="text-xs text-gray-600">per night</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm leading-relaxed">
                {room.description}
              </p>

              {/* Room Details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Size
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {room.sqft} sqft
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bed
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {room.bedType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    View
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {room.viewType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Guests
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    Up to {room.maxGuests}
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <BookingForm room={room} onSuccess={onClose} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
