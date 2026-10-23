'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Star, ShoppingCart, Check, Ship, Sparkles } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [addedRecently, setAddedRecently] = useState(false);

  const primaryImage = product.images[0] || '/images/round-shade.jpg';
  const secondaryImage = product.images[1] || product.images[0] || '/images/hand-held-shade.jpg';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 2000);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="product-card-hover group relative flex flex-col bg-white dark:bg-[#16221d] rounded-lg border border-[#d2dbd4] dark:border-[#273b33] overflow-hidden transition-all duration-200"
    >
      {/* Product Tag / Amazon Badge */}
      {product.tag && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center gap-1 bg-[#173f34] text-[#e5a439] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            <Sparkles className="w-3 h-3 text-[#c68a24]" />
            {product.tag}
          </span>
        </div>
      )}

      {/* Container Slot Badge */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded">
          <Ship className="w-3 h-3 text-[#c68a24]" />
          <span>{product.units_per_container_slot} slot{product.units_per_container_slot !== 1 ? 's' : ''}</span>
        </span>
      </div>

      {/* Image Area with Second-Angle Cross-fade */}
      <Link href={`/product/${product.slug}`} className="block relative w-full aspect-square bg-[#f5f7f5] dark:bg-[#111915] overflow-hidden">
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-opacity duration-300 ease-in-out ${
            isHovered && secondaryImage ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Second-angle photo (cross-fades on hover) */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} - second angle`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-opacity duration-300 ease-in-out absolute inset-0 ${
              isHovered ? 'opacity-100 scale-105 transition-transform duration-500' : 'opacity-0'
            }`}
          />
        )}
      </Link>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Shape & Size Pill */}
          <div className="flex items-center gap-2 text-[11px] text-[#576861] dark:text-[#9bb0a5] mb-1.5">
            <span className="font-semibold">{product.shape}</span>
            <span>•</span>
            <span className="italic">{product.size_approx}</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-[#c68a24] transition-colors">
            <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Star Ratings Summary (Amazon-Style) */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-[#c68a24]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#c68a24] text-[#c68a24]'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {product.rating}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              ({product.review_count})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">€</span>
            <span className="font-heading font-extrabold text-xl text-[#173f34] dark:text-[#e5a439]">
              {product.price_eur.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-500 ml-1">
              (VAT/customs to be confirmed)
            </span>
          </div>

          {/* Stock / Container Notice */}
          <p className="mt-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
            <span>In Stock ({product.stock} available in India)</span>
          </p>
        </div>

        {/* Quick Add To Cart Button */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2 px-3 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              addedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512]'
            }`}
          >
            {addedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Container!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
