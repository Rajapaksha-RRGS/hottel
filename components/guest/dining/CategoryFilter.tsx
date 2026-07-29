'use client';

import { Utensils, Wine, Coffee, ChefHat, Star, UtensilsCrossed, Sparkles } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  'All':         <UtensilsCrossed size={15} />,
  'Cocktails':   <Wine size={15} />,
  'Cocktail':    <Wine size={15} />,
  'Shots':       <Sparkles size={15} />,
  'Shot':        <Sparkles size={15} />,
  'Coffee':      <Coffee size={15} />,
  'Main':        <ChefHat size={15} />,
  'Main Course': <ChefHat size={15} />,
  'Starters':    <Utensils size={15} />,
  'Appetizer':   <Utensils size={15} />,
  'Desserts':    <Star size={15} />,
  'Dessert':     <Star size={15} />,
};

interface CategoryFilterProps {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex overflow-x-auto dashboard-scroll pb-2 gap-2.5">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border active:scale-95 ${
            active === cat
              ? 'bg-gold text-charcoal border-gold shadow-[0_0_18px_rgba(197,160,89,0.4)]'
              : 'bg-bone/5 text-bone/60 border-bone/12 hover:text-gold hover:border-gold/30 hover:bg-gold/5'
          }`}
        >
          <span className="shrink-0">{ICONS[cat] || <Utensils size={15} />}</span>
          {cat}
        </button>
      ))}
    </div>
  );
}
