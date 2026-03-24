import React from "react";
import { ShoppingCart, Heart } from "lucide-react";

interface Product {
  _id: string;
  productId: string;
  productName: string;
  description: string;
  price: number;
  labelPrice?: number;
  stock: number;
  isAvailable: boolean;
  img?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.labelPrice
    ? Math.round(((product.labelPrice - product.price) / product.labelPrice) * 100)
    : 0;

  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <img
          src={product.img?.[0] || "https://via.placeholder.com/300x200"}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Stock Badge */}
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold ${
            product.isAvailable
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {product.isAvailable ? "In Stock" : "Out of Stock"}
        </div>

        {/* Wishlist Button */}
        <button
          aria-label="Add to wishlist"
          className="absolute bottom-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md"
        >
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
          {product.productName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-blue-600">
            {product.price}
          </span>
          {product.labelPrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.labelPrice}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <p className="text-xs text-gray-500 mb-4">
          Stock: <span className="font-semibold">{product.stock}</span> units
        </p>

        {/* Add to Cart Button */}
        <button
          disabled={!product.isAvailable}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          aria-label={`Add ${product.productName} to cart`}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
