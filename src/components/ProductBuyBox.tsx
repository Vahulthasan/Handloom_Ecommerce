'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Container } from '@/types';
import { useCart } from '@/context/CartContext';
import {
  ShieldCheck,
  Ship,
  Lock,
  Calendar,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

interface ProductBuyBoxProps {
  product: Product;
  openContainer: Container;
}

export default function ProductBuyBox({ product, openContainer }: ProductBuyBoxProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState('Natural Honey Cane');
  const [selectedSize, setSelectedSize] = useState(product.size_approx);
  const [isAdding, setIsAdding] = useState(false);

  const containerFillPct = Math.round((openContainer.used_units / openContainer.capacity_units) * 100);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedSize, selectedFinish);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedFinish);
    router.push('/checkout');
  };

  return (
    <div className="w-full space-y-5">
      {/* Finish & Size Selection Chips */}
      <div className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center justify-between mb-1.5">
            <span>Size (Handmade Approximate):</span>
            <span className="text-[11px] text-gray-500 font-normal italic">
              ±2 cm artisan allowance
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {[product.size_approx, 'approx. 48 cm (±2 cm)'].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSelectedSize(sz)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  selectedSize === sz
                    ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f0f4f2] dark:bg-[#1a2c24] text-[#173f34] dark:text-[#e5a439] ring-1 ring-[#173f34]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
            Natural Weave Finish:
          </label>
          <div className="flex flex-wrap gap-2">
            {['Natural Honey Cane', 'Aged Smoke Patina'].map((finish) => (
              <button
                key={finish}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  selectedFinish === finish
                    ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f0f4f2] dark:bg-[#1a2c24] text-[#173f34] dark:text-[#e5a439] ring-1 ring-[#173f34]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-700 dark:text-gray-300'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AMAZON-STYLE STICKY BUY BOX CARD */}
      <div className="bg-white dark:bg-[#16221d] rounded-xl border-2 border-[#173f34]/30 dark:border-[#2a4338] p-5 shadow-lg space-y-4">
        {/* Price & Currency */}
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">€</span>
            <span className="font-heading font-black text-3xl text-[#173f34] dark:text-[#e5a439]">
              {(product.price_eur * quantity).toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              {quantity > 1 ? `(€${product.price_eur.toFixed(2)} each)` : 'EUR'}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Prices in EUR. European customs & import VAT handling: <strong className="text-gray-700 dark:text-gray-300">to be confirmed</strong> at port clearance.
          </p>
        </div>

        {/* Delivery Note from Current Open Container */}
        <div className="p-3 rounded-lg bg-[#f4f7f5] dark:bg-[#121c17] border border-[#d2dbd4] dark:border-[#273b33] space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#173f34] dark:text-[#e5a439]">
            <Ship className="w-4 h-4 text-[#c68a24]" />
            <span>Pooled Sea Container Delivery</span>
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
            Ships when the container is full.{' '}
            <strong>Current: {openContainer.label}</strong> ({containerFillPct}% full).
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5 text-[#c68a24]" />
            <span>
              Estimated ship window:{' '}
              <strong>{openContainer.estimated_ship_date || 'to be announced'}</strong>
            </span>
          </div>
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>In Stock ({product.stock} units currently ready in India)</span>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-700 dark:text-gray-300">Quantity:</span>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] font-semibold outline-none focus:ring-1 focus:ring-[#c68a24]"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'unit' : 'units'} ({num * product.units_per_container_slot} container slots)
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons (Add to Cart / Buy Now) */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full py-3 px-4 rounded-md font-bold text-sm bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAdding ? 'Adding to Slot...' : 'Add to Cart'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3 px-4 rounded-md font-bold text-sm bg-[#173f34] hover:bg-[#1f4f42] text-white shadow transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4 text-[#e5a439]" />
            <span>Buy Now (Express European Checkout)</span>
          </button>
        </div>

        {/* Amazon-Style Ships From / Sold By Table */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-[11px] space-y-1 text-gray-500">
          <div className="flex justify-between">
            <span>Ships from:</span>
            <span className="text-gray-900 dark:text-gray-300 font-medium">Vintage Collections (Nhava Sheva, India)</span>
          </div>
          <div className="flex justify-between">
            <span>Sold by:</span>
            <span className="text-gray-900 dark:text-gray-300 font-medium">Vintage Collections Indian Handloom Collective</span>
          </div>
          <div className="flex justify-between">
            <span>Container Space:</span>
            <span className="text-gray-900 dark:text-gray-300 font-medium">
              {quantity * product.units_per_container_slot} Ocean Slot Unit{quantity * product.units_per_container_slot !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Security / Guarantee */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Secure checkout • Track container online 24/7</span>
        </div>
      </div>

      {/* Container Pooling Advisory Box */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c68a24]" />
        <div>
          <strong>European Sea Freight Transparency:</strong> Unlike retail stores storing old stock in warehouses, our shades are woven to order by Indian master artisans and consolidated into ocean containers.
        </div>
      </div>

      {/* Amazon Mobile Sticky Quick Buy Bar (Thumb Friendly) */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 dark:bg-[#12231c]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#234336] p-2.5 px-4 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate">{product.shape}</span>
          <span className="font-heading font-black text-lg text-[#173f34] dark:text-[#e5a439]">
            €{(product.price_eur * quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="py-2.5 px-3.5 rounded-md font-bold text-xs bg-[#c68a24] hover:bg-[#e5a439] active:bg-[#b0781c] text-[#0d1512] shadow transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="py-2.5 px-3.5 rounded-md font-bold text-xs bg-[#173f34] text-white shadow hover:bg-[#1f4f42] active:bg-[#122b22] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
