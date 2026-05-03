'use client';
import React, { useState } from 'react';
import { MapPin } from 'lucide-react';  
import { Search } from 'lucide-react';  
import Footer from '../../components/components/Footer';
import Navigation from '../../components/components/Herder';

import TourCard from '../../components/components/toureCard';

const categories = ["All Tours", "Cultural", "Wildlife", "Adventure"];

export default function ToursPage() {
  const [activeCategory, setActiveCategory] = useState("All Tours");

  // මේවා පසුව API එකෙන් fetch කරන්න පුළුවන්
  const dummyTours = [
    { name: "Ambewela Dairy Farm Visit", location: "Ella to Ambewela", duration: "1 Day", price: 15000, rating: 5, category: "Cultural", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000", capacity: 20 },
    { name: "Ambewela - Nuwara Eliya - Ella Scenic Tour", location: "Ambewela to Ella", duration: "1 Day", price: 20000, rating: 4.8, category: "Adventure", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000", capacity: 10 },
    { name: "Badulla Waterfall & Nature Hike", location: "Ella to Badulla", duration: "1 Day", price: 1200, rating: 4.5, category: "Wildlife", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000", capacity: 15 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Navigation />
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1588613274291-768233f523c0?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Sri Lanka Heritage"
        />
        
        <div className="relative z-20 text-center px-6">
          <span className="bg-amber-400 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded mb-4 inline-block">Unforgettable Journeys</span>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-8">
            Discover the Soul of <br />
            <span className="text-amber-400 italic font-medium">Sri Lanka</span>
          </h1>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-2xl flex items-center">
            <div className="flex-1 flex items-center px-4 gap-2">
              <MapPin size={18} className="text-amber-500" />
              <input 
                type="text" 
                placeholder="Search destinations (e.g. Ella, Sigiriya)..." 
                className="w-full text-sm outline-none text-gray-700"
              />
            </div>
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-all">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Tours List Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Experiences</h2>
            <p className="text-gray-500 text-sm">Found <span className="font-bold text-gray-900">21</span> curated tours</p>
          </div>
          
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                  ? "bg-black text-white border-black" 
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyTours.map((tour, idx) => (
            <TourCard key={idx} tour={tour} />
          ))}
        </div>
      </section>
          
      {/* Footer */}
      <Footer />
    </main>
  );
}