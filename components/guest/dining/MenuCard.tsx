'use client';

import { motion } from 'framer-motion';
import {
  Plus, Minus, Utensils, Clock, Flame,
  Wine, Coffee, ChefHat, Star, UtensilsCrossed, Sparkles,
} from 'lucide-react';

export interface FoodItem {
  _id: string;
  name: string;
  category: string;
  prices: { normal: number; full?: number };
  image: string;
  prepTime?: string;
  allergens?: string[];
  spiceLevel?: number;
  isAvailable: boolean;
  description?: string;
  isFeatured?: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'All':         <UtensilsCrossed size={14} />,
  'Cocktails':   <Wine size={14} />,
  'Cocktail':    <Wine size={14} />,
  'Shots':       <Sparkles size={14} />,
  'Shot':        <Sparkles size={14} />,
  'Coffee':      <Coffee size={14} />,
  'Main':        <ChefHat size={14} />,
  'Main Course': <ChefHat size={14} />,
  'Starters':    <Utensils size={14} />,
  'Appetizer':   <Utensils size={14} />,
  'Desserts':    <Star size={14} />,
  'Dessert':     <Star size={14} />,
};

function SpiceIndicator({ level }: { level?: number }) {
  if (!level) return null;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3].map((l) => (
        <Flame
          key={l}
          size={13}
          className={l <= level ? 'text-orange-400' : 'text-bone/20'}
          fill={l <= level ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

interface MenuCardProps {
  item: FoodItem;
  idx: number;
  cartItem?: CartItem;
  onAdd: (item: FoodItem) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

export default function MenuCard({ item, idx, cartItem, onAdd, onUpdateQty }: MenuCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.04, duration: 0.35 }}
      className="group relative rounded-3xl overflow-hidden border border-bone/10 hover:border-gold/50 transition-all duration-500 flex flex-col shadow-lg hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      style={{ background: 'rgba(30,30,30,0.85)', backdropFilter: 'blur(18px)' }}
    >
      {/* ── Image ─────────────────────────────────── */}
      <div className="relative h-52 w-full overflow-hidden bg-black/40 shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="text-bone/15" size={44} />
          </div>
        )}

        {/* bottom scrim so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* Category pill — bottom-left on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-gold">{CATEGORY_ICONS[item.category] || <Utensils size={14} />}</span>
          <p className="text-xs text-gold/90 uppercase tracking-widest font-semibold">{item.category}</p>
        </div>

        {/* Chef's pick badge */}
        {item.isFeatured && (
          <div className="absolute top-3 right-3 bg-gold text-charcoal px-3 py-1 rounded-full shadow-lg">
            <p className="text-[11px] uppercase tracking-widest font-bold">Chef&apos;s Pick</p>
          </div>
        )}
      </div>

      {/* ── Content ───────────────────────────────── */}
      <div className="p-5 flex flex-col flex-grow gap-3">

        {/* Name + Price row */}
        <div className="flex justify-between items-start gap-3">
          <h3 className="text-[17px] font-serif text-bone leading-snug group-hover:text-gold transition-colors font-semibold flex-1">
            {item.name}
          </h3>
          <div className="text-right shrink-0">
            <p className="text-gold font-bold text-xl leading-none">${item.prices.normal.toFixed(2)}</p>
            {item.prices.full && (
              <p className="text-bone/30 text-xs line-through mt-0.5">${item.prices.full.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-bone/55 text-sm leading-relaxed line-clamp-2 flex-grow">
            {item.description}
          </p>
        )}

        {/* Footer: meta + action */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-auto gap-2">

          {/* Prep time + spice */}
          <div className="flex items-center gap-3 flex-wrap">
            {item.prepTime && (
              <span className="flex items-center gap-1.5 text-bone/40 text-xs font-medium">
                <Clock size={13} className="shrink-0" />{item.prepTime}
              </span>
            )}
            <SpiceIndicator level={item.spiceLevel} />
          </div>

          {/* Cart control */}
          {cartItem ? (
            /* Already in cart — show stepper */
            <div className="flex items-center gap-0 bg-gold/10 border border-gold/40 rounded-2xl overflow-hidden">
              <button
                onClick={() => onUpdateQty(item._id, -1)}
                className="cursor-pointer text-gold hover:bg-gold/20 transition-colors w-10 h-10 flex items-center justify-center active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="text-gold text-base font-bold w-8 text-center select-none">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => onAdd(item)}
                className="cursor-pointer text-gold hover:bg-gold/20 transition-colors w-10 h-10 flex items-center justify-center active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            /* Not in cart — Add button */
            <button
              onClick={() => onAdd(item)}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gold text-charcoal text-sm font-bold hover:bg-gold-light active:scale-95 transition-all duration-200 shadow-[0_0_16px_rgba(197,160,89,0.3)] hover:shadow-[0_0_24px_rgba(197,160,89,0.5)] whitespace-nowrap"
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
