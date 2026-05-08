'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Clock, Users, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Navigation from '../../../components/components/Herder';
import Footer from '../../../components/components/Footer';

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
  description: string;
  status?: string;
}

export default function TourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/tours');
      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      const tours = data.tours || [];

      // Find tour by _id (id is now the MongoDB _id)
      const foundTour = tours.find((tour: any) => tour._id === id);

      if (!foundTour) {
        setError('Tour not found');
        setTour(null);
      } else {
        setTour(foundTour);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tour details');
      setTour(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-600">Loading tour details...</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This tour is no longer available'}</p>
          <Link href="/tour" className="text-amber-500 hover:text-amber-600 font-semibold">Back to Tours</Link>
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
          src={tour.image || "/api/placeholder/1200/600"}
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
          <div className="flex items-center justify-center gap-6 text-white/90 flex-wrap">
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
              {tour.description || 'Experience an unforgettable journey through Sri Lanka\'s most beautiful destinations.'}
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
                onClick={() => router.push(`/tour/${id}/booking`)}
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
