'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterBarProps {
  onFilterChange: (category: string | null, maxPrice: number) => void;
}

const categories = ['Suite', 'Deluxe', 'Villa'];

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(1000);

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newCategory);
    onFilterChange(newCategory, priceRange);
  };

  const handlePriceChange = (value: number) => {
    setPriceRange(value);
    onFilterChange(selectedCategory, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          {/* Category Filter */}
          <div className="flex gap-4">
            <span className="text-sm font-semibold text-gray-700 self-center uppercase tracking-wider">
              Category
            </span>
            <div className="flex gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="flex gap-4 items-center w-full md:w-auto">
            <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Max Price
            </span>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="200"
                max="1000"
                value={priceRange}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-32 md:w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <span className="text-sm font-semibold text-purple-600 min-w-[60px]">
                ${priceRange}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
