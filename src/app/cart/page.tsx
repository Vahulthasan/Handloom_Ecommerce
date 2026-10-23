'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { getSettings } from '@/lib/data';
import { StoreSettings } from '@/types';
import {
  Trash2,
  Plus,
  Minus,
  Ship,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalContainerUnits,
  } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('DE');

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const selectedCountry =
    settings?.allowed_countries.find((c) => c.code === selectedCountryCode) ||
    settings?.allowed_countries[0];

  const shippingFee = selectedCountry?.fee_eur || 14.5;
  const grandTotal = subtotal + (items.length > 0 ? shippingFee : 0);

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 dark:bg-[#16221d] rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-heading font-extrabold text-2xl text-gray-900 dark:text-white">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs text-gray-500 leading-relaxed">
          Your basket currently has no items reserved in our open European sea shipping container. Explore our handcrafted collection of authentic Indian bamboo pendant shades.
        </p>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-bold text-xs rounded-md shadow transition-colors"
          >
            <span>Explore All Handmade Shades</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white">
          Shopping Basket & Container Slot Allocation
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Review your items, manage quantities, and see ocean container space utilization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Product Details
              </span>
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-600 transition-colors"
              >
                Clear all items
              </button>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {items.map((item) => (
                <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4 items-start">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 flex-shrink-0">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <h2 className="font-heading font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                          {item.product_name}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.selected_size} • {item.selected_finish}
                        </p>
                        <p className="text-[11px] text-[#c68a24] font-medium mt-1">
                          Takes {item.units_per_slot * item.qty} slot unit{item.units_per_slot * item.qty !== 1 ? 's' : ''} in ocean container
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="font-heading font-black text-base sm:text-lg text-[#173f34] dark:text-[#e5a439]">
                          €{(item.unit_price * item.qty).toFixed(2)}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          (€{item.unit_price.toFixed(2)} each)
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-[#121c17]">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                          className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                          className="px-2.5 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Container Impact Card */}
          <div className="p-4 bg-[#f0f5f2] dark:bg-[#13221b] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#173f34] text-[#e5a439] flex-shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-[#173f34] dark:text-[#e5a439]">
                Carbon-Efficient Pooled Ocean Freight
              </span>
              <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                These items reserve <strong>{totalContainerUnits} unit{totalContainerUnits !== 1 ? 's' : ''}</strong> in our upcoming European sea container batch.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Box */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-5">
            <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Order Summary
            </h2>

            {/* Country Selector for Shipping Estimate */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Destination Country (Europe):
              </label>
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] text-xs font-medium outline-none focus:ring-1 focus:ring-[#c68a24]"
              >
                {settings?.allowed_countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} — €{c.fee_eur.toFixed(2)} ({c.estimated_transit_days})
                  </option>
                ))}
              </select>
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs pt-2 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items):</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Pooled Sea Freight ({selectedCountry?.name}):</span>
                <span>€{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Import VAT / Customs Notice:</span>
                <span className="text-gray-500 italic">to be confirmed</span>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                  Order Total:
                </span>
                <span className="font-heading font-black text-2xl text-[#173f34] dark:text-[#e5a439]">
                  €{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-bold text-sm rounded-md shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to European Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-[11px] text-gray-500 space-y-1 pt-1">
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guest checkout available — no account required</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Full transit insurance and tracking included</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
