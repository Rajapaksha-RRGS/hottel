"use client";
import React from 'react';
import Link from 'next/link';

const PlanTrip = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 py-20">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Plan Your
            <br />
            Best Place
            <br />
            To <span className="text-blue-600">Travel</span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Discover destinations, compare tours, and build the right route across Sri Lanka.
          </p>

          {/* Search Box */}
          <div className="mb-8">
            <div className="flex items-center bg-white rounded-full shadow-lg p-2 mb-6">
              <div className="flex-1 px-4 py-2">
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none font-medium"
                />
              </div>
              <button className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-semibold transition-all flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg w-fit">
            CREATE CUSTOM TRIP
          </button>
        </div>

        {/* Right Content - Images Section */}
        <div className="relative h-96 md:h-full flex items-center justify-center">
          
          {/* Main Circular Image */}
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-60"></div>
            
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop"
                alt="Beach"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Followers Badge */}
            <div className="absolute -top-6 right-10 bg-white rounded-2xl px-6 py-3 shadow-lg">
              <p className="text-2xl font-bold text-gray-900">49.5 K++</p>
              <p className="text-gray-600 text-sm font-medium">Follower</p>
            </div>

            {/* Destination Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-3xl overflow-hidden shadow-2xl max-w-xs">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop"
                alt="Sri Lanka"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900">Sri Lanka</h3>
                <p className="text-gray-600 text-sm mt-1">Paradise Island</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanTrip;
