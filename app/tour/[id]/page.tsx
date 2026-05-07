'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '../../../components/components/Herder';
import Footer from '../../../components/components/Footer';

const dummyTours = [
  { id: 1, name: "Ambewela Dairy Farm Visit", location: "Ella to Ambewela", duration: "1 Day", price: 15000, rating: 5, category: "Cultural", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000", capacity: 20, description: "Experience the serene beauty of Ambewela Dairy Farm, nestled in the misty hills of Sri Lanka. Learn about traditional dairy farming and enjoy fresh local produce." },
  { id: 2, name: "Ambewela - Nuwara Eliya - Ella Scenic Tour", location: "Ambewela to Ella", duration: "1 Day", price: 20000, rating: 4.8, category: "Adventure", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1000", capacity: 10, description: "Embark on a breathtaking journey through Sri Lanka's hill country, visiting Ambewela, Nuwara Eliya, and Ella. Discover tea plantations, waterfalls, and stunning landscapes." },
  { id: 3, name: "Badulla Waterfall & Nature Hike", location: "Ella to Badulla", duration: "1 Day", price: 1200, rating: 4.5, category: "Wildlife", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000", capacity: 15, description: "Explore the majestic Badulla waterfalls and surrounding nature trails. This adventure combines hiking, photography, and immersion in Sri Lanka's natural wonders." },
];

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string);
  const tour = dummyTours.find(t => t.id === id);

  if (!tour) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <Link href="/tour" className="text-amber-500 hover:text-amber-600">Back to Tours</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={tour.image} 
          className="absolute inset-0 w-full h-full object-cover"
          alt={tour.name}
        />
        
        <div className="relative z-20 text-center px-6">
          <Link href="/tour" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft size={16} />
            Back to Tours
          </Link>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">
            {tour.name}
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/90">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{tour.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{tour.duration}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tour Overview</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {tour.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Users size={20} className="text-amber-500" />
                  <span className="font-semibold text-gray-800">Capacity</span>
                </div>
                <p className="text-gray-600">Up to {tour.capacity} people</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Star size={20} className="text-amber-500" />
                  <span className="font-semibold text-gray-800">Rating</span>
                </div>
                <p className="text-gray-600">{tour.rating} stars</p>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  Rs. {tour.price.toLocaleString()}
                </div>
                <p className="text-gray-500">per person</p>
              </div>
              
              <button 
                onClick={() => router.push('/tour/' + id + '/booking')}
                className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors mb-4">
                Book This Tour
              </button>
              
              <div className="text-xs text-gray-500 text-center">
                Free cancellation up to 24 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}