"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=600&fit=crop',
      location: 'Trincomalee, Sri Lanka',
      title: 'VITAMIN SEA BEACH',
      subtitle: 'HOTEL & Tour Organize',
      description: 'Experience luxury private cabanas and pristine beaches on the eastern tip of Paradise Island in our idyllic retreat',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=600&fit=crop',
      location: 'Maldives',
      title: 'TROPICAL PARADISE',
      subtitle: 'RESORT & Wellness',
      description: 'Discover the ultimate tropical getaway with world-class amenities and breathtaking ocean views',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop',
      location: 'Bali, Indonesia',
      title: 'BEACH ESCAPE',
      subtitle: 'VILLA & Adventure',
      description: 'Immerse yourself in paradise with our exclusive beachfront villas and thrilling activities',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ checkIn, checkOut, guests });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden mt-16">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        {/* Location Badge */}
        <div className="mb-8 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
          </svg>
          <span className="text-sm font-medium">{slides[currentSlide].location}</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-2 drop-shadow-lg">
          {slides[currentSlide].title}
        </h1>

        {/* Subtitle */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 drop-shadow-lg">
          {slides[currentSlide].subtitle}
        </h2>

        {/* Description */}
        <p className="text-center max-w-2xl mb-12 text-lg drop-shadow-md">
          {slides[currentSlide].description}
        </p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl px-6">
          {/* Check In */}
          <div className="bg-white rounded-lg px-4 py-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Check in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-transparent text-gray-900 font-medium outline-none"
            />
          </div>

          {/* Check Out */}
          <div className="bg-white rounded-lg px-4 py-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Check out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-transparent text-gray-900 font-medium outline-none"
            />
          </div>

          {/* Guests */}
          <div className="bg-white rounded-lg px-4 py-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Guests</label>
            <input
              type="number"
              placeholder="Add guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-gray-900 font-medium outline-none"
            />
          </div>

          {/* Check Availability Button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-6 py-3 flex items-center justify-center space-x-2 transition-colors w-full md:w-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Check Availability</span>
          </button>
        </form>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-colors z-20"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
