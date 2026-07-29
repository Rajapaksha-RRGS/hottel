'use client';

import { ShoppingCart } from 'lucide-react';

interface CartFABProps {
  cartCount: number;
  cartTotal: number;
  onClick: () => void;
}

export default function CartFAB({ cartCount, cartTotal, onClick }: CartFABProps) {
  if (cartCount === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 xl:hidden z-50">
      <button
        onClick={onClick}
        className="cursor-pointer flex items-center gap-2 px-5 py-3 bg-gold text-charcoal rounded-full font-semibold shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:shadow-[0_0_40px_rgba(197,160,89,0.7)] transition-all"
      >
        <ShoppingCart size={18} />
        <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
        <span className="font-bold">${cartTotal.toFixed(2)}</span>
      </button>
    </div>
  );
}
