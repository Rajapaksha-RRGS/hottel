'use client';

import { motion } from 'framer-motion';
import { Eye, Wifi, Wind, Waves, Eye as EyeIcon, Dumbbell } from 'lucide-react';
import { Room } from '@/app/lib/roomsData';

interface RoomCardProps {
  room: Room;
  onQuickView: (room: Room) => void;
  index: number;
}

const amenityIcons = {
  Wifi: <Wifi className="w-4 h-4" />,
  AC: <Wind className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  SeaView: <EyeIcon className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  Spa: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m0 2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>,
  Sauna: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4V4zm2 6h12v10H6V10zm2 2v6h8v-6H8z" /></svg>,
};

export default function RoomCard({ room, onQuickView, index }: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ y: -8 }}
      className="group relative h-full overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden bg-gray-200">
        <motion.img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          {room.category}
        </motion.div>

        {/* Floating Price Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-xl"
        >
          <p className="text-xs text-gray-600">From</p>
          <p className="text-2xl font-bold text-purple-600">${room.price}</p>
          <p className="text-xs text-gray-600">per night</p>
        </motion.div>

        {/* Glassmorphism Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm z-20"
        >
          {/* Room Details on Hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 flex flex-col justify-end p-4 text-white z-30"
          >
            <div className="space-y-3">
              {/* Details Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
                  <p className="text-gray-300">Size</p>
                  <p className="font-semibold">{room.sqft} sqft</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
                  <p className="text-gray-300">Bed</p>
                  <p className="font-semibold text-xs">{room.bedType.split(' ')[0]}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2 text-center">
                  <p className="text-gray-300">View</p>
                  <p className="font-semibold text-xs">{room.viewType.split(' ')[0]}</p>
                </div>
              </div>

              {/* Quick View Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onQuickView(room)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-2 rounded-lg font-semibold flex gap-2 items-center justify-center transition-all"
              >
                <Eye className="w-4 h-4" />
                Quick View
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-lg font-serif text-gray-900 group-hover:text-purple-600 transition">
            {room.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2">
          {room.amenities.slice(0, 4).map((amenity) => (
            <motion.div
              key={amenity}
              whileHover={{ scale: 1.1 }}
              className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition"
              title={amenity}
            >
              <span className="text-purple-600">
                {amenityIcons[amenity as keyof typeof amenityIcons]}
              </span>
              <span className="text-xs font-medium">{amenity}</span>
            </motion.div>
          ))}
        </div>

        {/* Guests */}
        <p className="text-xs text-gray-500">
          ⭐ Perfect for up to {room.maxGuests} {room.maxGuests === 1 ? 'guest' : 'guests'}
        </p>
      </div>
    </motion.div>
  );
}
