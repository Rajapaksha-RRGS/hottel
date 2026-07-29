'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterBarProps {
  onFilterChange: (category: string | null, maxPrice: number) => void;
}

const categories = [
  { name: 'Suite', icon: '🏛️' },
  { name: 'Deluxe', icon: '✨' },
  { name: 'Villa', icon: '🌴' },
];

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

  const handleClearAll = () => {
    setSelectedCategory(null);
    setPriceRange(1000);
    onFilterChange(null, 1000);
  };

  const hasActiveFilters = selectedCategory !== null || priceRange < 1000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-20 z-40 border-b border-bone/10"
      style={{
        background: 'linear-gradient(180deg, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.85) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">

          {/* Category Filter */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-gold/80">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Category
              </span>
            </div>

            <div className="flex gap-2.5">
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.name}
                  onClick={() => handleCategoryChange(cat.name)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 overflow-hidden ${
                    selectedCategory === cat.name
                      ? 'bg-gold text-charcoal shadow-[0_0_20px_rgba(197,160,89,0.35)]'
                      : 'glass-light text-bone/80 hover:text-gold hover:border-gold/30'
                  }`}
                >
                  {/* Active glow effect */}
                  {selectedCategory === cat.name && (
                    <motion.div
                      layoutId="activeCategoryGlow"
                      className="absolute inset-0 bg-gold rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.icon}</span>
                  <span className="relative z-10">{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Filter + Clear */}
          <div className="flex items-center gap-6 w-full md:w-auto">
            {/* Price Range */}
            <div className="flex items-center gap-4 flex-1 md:flex-none">
              <span className="text-xs font-semibold text-gold/80 uppercase tracking-[0.2em] whitespace-nowrap">
                Max Price
              </span>
              <div className="flex items-center gap-3">
                <div className="relative w-36 md:w-44">
                  {/* Track background */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-bone/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full"
                      animate={{ width: `${((priceRange - 200) / 800) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="1000"
                    value={priceRange}
                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                    className="relative w-full h-1.5 appearance-none cursor-pointer bg-transparent z-10
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-gold
                      [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(197,160,89,0.5)]
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-shadow
                      [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(197,160,89,0.7)]
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:bg-gold
                      [&::-moz-range-thumb]:border-0
                      [&::-moz-range-thumb]:shadow-[0_0_12px_rgba(197,160,89,0.5)]
                      [&::-moz-range-thumb]:cursor-pointer
                      [&::-moz-range-track]:bg-transparent
                      [&::-webkit-slider-runnable-track]:bg-transparent"
                  />
                </div>

                {/* Price Display */}
                <motion.div
                  key={priceRange}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="glass-gold rounded-lg px-3 py-1.5 min-w-[72px] text-center"
                >
                  <span className="text-sm font-bold text-gold">${priceRange}</span>
                </motion.div>
              </div>
            </div>

            {/* Clear All Button */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClearAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-xs font-medium uppercase tracking-wider"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
