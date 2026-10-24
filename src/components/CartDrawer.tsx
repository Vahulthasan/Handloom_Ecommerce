'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, Ship, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalContainerUnits,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-full sm:w-[420px] max-w-full bg-white dark:bg-[#16221d] text-gray-900 dark:text-gray-100 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-[#173f34] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#c68a24]" />
              <h2 className="font-heading font-bold text-lg">Your Cart & Container Slot</h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1 rounded-full text-gray-300 hover:text-white hover:bg-[#1f4f42] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Container Pooling Impact Banner */}
          {items.length > 0 && (
            <div className="bg-[#f2f7f4] dark:bg-[#121c17] px-6 py-3 border-b border-[#d2dbd4] dark:border-[#24362d] flex items-center gap-3">
              <div className="p-2 rounded-full bg-[#173f34] text-[#e5a439] flex-shrink-0">
                <Ship className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#173f34] dark:text-[#e5a439]">
                  Sea Container Pooling Reserved
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Your order occupies <strong>{totalContainerUnits} unit{totalContainerUnits !== 1 ? 's' : ''}</strong> in the current European sea container.
                </p>
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-200 dark:divide-gray-800">
            {items.length === 0 ? (
              <div className="py-16 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="font-heading font-semibold text-gray-600 dark:text-gray-300 text-lg mb-2">
                  Your cart is empty
                </p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                  Explore our handcrafted bamboo pendant shades made in India and delivered directly to Europe.
                </p>
                <button
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#173f34] text-white rounded-md text-xs font-semibold hover:bg-[#1f4f42] transition-colors"
                >
                  <Link href="/shop" onClick={closeDrawer}>
                    Browse Handmade Shades
                  </Link>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {item.product_name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.selected_size}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="font-bold text-sm text-[#173f34] dark:text-[#e5a439]">
                        €{(item.unit_price * item.qty).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        (€{item.unit_price.toFixed(2)} each)
                      </span>
                    </div>

                    {/* Stepper & Remove */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.qty - 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.qty + 1)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-gray-50 dark:bg-[#121c17] border-t border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-heading font-bold text-xl text-gray-900 dark:text-white">
                  €{subtotal.toFixed(2)}
                </span>
              </div>

              <p className="text-[11px] text-gray-500">
                EU shipping rate calculated during checkout based on destination country.
              </p>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-bold text-sm rounded shadow-md transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-white dark:bg-[#1a2923] hover:bg-gray-100 dark:hover:bg-[#233830] text-gray-800 dark:text-gray-200 text-xs font-semibold rounded border border-gray-300 dark:border-gray-700 transition-colors"
                >
                  View Full Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
