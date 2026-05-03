'use client';
import React from 'react';
import { Clock, Users, Star, MapPin } from 'lucide-react';

interface TourProps {
  tour: {
    name: string;
    location: string;
    duration: string;
    capacity: number;
    price: number;
    image: string;
    rating: number;
    category: string;
  };
}

export default function TourCard({ tour }: TourProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={tour.image || "/api/placeholder/400/300"} 
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-700">
          {tour.category || "Popular"}
        </div>
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-red-50 transition-colors">
          <Star size={14} className="text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-2">
          <MapPin size={12} className="text-amber-500" />
          <span className="uppercase font-medium tracking-tight">{tour.location}</span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-3 leading-tight h-12 line-clamp-2">
          {tour.name}
        </h3>

        <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} /> {tour.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} /> 2-4 Guests
          </div>
        </div>

        <div className="flex items-center gap-1 mb-5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(tour.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-400 font-medium ml-1">{tour.rating} (0)</span>
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Route Fare</p>
            <p className="text-lg font-extrabold text-gray-900">LKR {tour.price.toLocaleString()}</p>
          </div>
          <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-bold px-6 py-2.5 rounded-lg transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}