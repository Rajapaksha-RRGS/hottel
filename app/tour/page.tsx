'use client';

import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Search } from 'lucide-react';
import Footer from '../../components/components/Footer';
import Navigation from '../../components/components/Herder';
import TourCard from '../../components/components/toureCard';

const categories = ["All Tours", "Cultural", "Wildlife", "Adventure"];

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
}

export default function ToursPage() {
  const [activeCategory, setActiveCategory] = useState("All Tours");
  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tours');

      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      const toursData = data.tours || [];

      // Add category field based on name for filtering
      const categorizedTours: Tour[] = toursData.map((tour: any) => ({
        ...tour,
        category: getCategoryFromName(tour.name),
      }));

      setTours(categorizedTours);
      setFilteredTours(categorizedTours);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tours');
      console.error('Error fetching tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromName = (name: string): string => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('farm') || nameLower.includes('cultural') || nameLower.includes('heritage')) {
      return 'Cultural';
    } else if (nameLower.includes('waterfall') || nameLower.includes('wildlife') || nameLower.includes('nature')) {
      return 'Wildlife';
    } else if (nameLower.includes('scenic') || nameLower.includes('adventure') || nameLower.includes('hike')) {
      return 'Adventure';
    }
    return 'Cultural';
  };

  useEffect(() => {
    let filtered = tours;

    // Filter by category
    if (activeCategory !== "All Tours") {
      filtered = filtered.filter(tour => tour.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tour =>
        tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTours(filtered);
  }, [activeCategory, searchTerm, tours]);

  const handleSearch = () => {
    // Search is already handled by useEffect
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Navigation />
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://res.cloudinary.com/djvxlhojn/image/upload/v1778144650/tourshero_q63mvv.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Sri Lanka Heritage"
          suppressHydrationWarning
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm outline-none text-gray-700"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-bold transition-all"
            >
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
            <p className="text-gray-500 text-sm">Found <span className="font-bold text-gray-900">{filteredTours.length}</span> {activeCategory !== "All Tours" ? `${activeCategory.toLowerCase()} ` : ''}tours</p>
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading tours...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchTours}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTours.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">No tours found. Try adjusting your filters or search.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filteredTours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}