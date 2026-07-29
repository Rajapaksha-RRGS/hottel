'use client';

import { motion } from 'framer-motion';
import { Star, Eye } from 'lucide-react';

export interface Room {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  gallery: string[];
  sqft: number;
  bedType: string;
  viewType: string;
  amenities: string[];
  description: string;
  maxGuests: number;
  available?: boolean;
}

interface RoomCardProps {
  room: Room;
  onQuickView: (room: Room) => void;
  index: number;
}

export default function RoomCard({ room, onQuickView, index }: RoomCardProps) {
  const isAvailable = room.available !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.02 }}
      className="relative group overflow-hidden glass-light rounded-2xl h-[440px] flex flex-col justify-end transition-all duration-300 shadow-xl hover:shadow-2xl"
    >
      {/* Background Image with Hover Zoom */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${room.image})` }}
        />
        {/* Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
      </div>

      {/* Top Left Badge: Category */}
      <div className="absolute top-4 left-4 z-10 bg-gold text-charcoal px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider shadow-md">
        {room.category}
      </div>

      {/* Top Right Badge: Availability Indicator */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 glass px-3 py-1.5 rounded-full backdrop-blur-md">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isAvailable ? "bg-green-500 availability-dot" : "bg-red-500"
          }`}
        />
        <span className="text-xs text-bone/90 font-medium">
          {isAvailable ? "Available" : "Booked"}
        </span>
      </div>

      {/* Card Content at Bottom */}
      <div className="relative z-10 p-6 flex flex-col justify-end">
        {/* 5-Star Rating */}
        <div className="mb-2 flex items-center gap-1 text-gold">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl md:text-3xl text-bone mb-1 group-hover:text-gold transition-colors duration-300">
          {room.name}
        </h3>

        {/* Room Attributes */}
        <p className="text-bone/70 text-sm mb-4">
          {room.sqft} sqft • {room.bedType} • {room.viewType}
        </p>

        {/* Price & Action Button */}
        <div className="flex items-end justify-between border-t border-bone/10 pt-4">
          <div>
            <span className="text-gold text-2xl font-serif font-bold">
              ${room.price}
            </span>
            <span className="text-bone/60 text-xs"> / night</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickView(room)}
            className="px-4 py-2.5 bg-gold/20 border border-gold/50 text-gold hover:bg-gold hover:text-charcoal text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
