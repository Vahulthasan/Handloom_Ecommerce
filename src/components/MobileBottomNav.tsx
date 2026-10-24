'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, Compass, PackageCheck, ShoppingCart } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop') || pathname.startsWith('/product');
  const isTrack = pathname.startsWith('/track');
  const isCart = pathname.startsWith('/cart') || pathname.startsWith('/checkout');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#122e25]/95 dark:bg-[#0c1a14]/95 backdrop-blur-md border-t border-[#1e4a3b] dark:border-[#1a382d] shadow-2xl md:hidden pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isHome ? 'text-[#e5a439]' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        {/* 2. Shop / Catalog */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isShop ? 'text-[#e5a439]' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Shop</span>
        </Link>

        {/* 3. Track Orders */}
        <Link
          href="/track"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isTrack ? 'text-[#e5a439]' : 'text-gray-300 hover:text-white'
          }`}
        >
          <PackageCheck className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Track</span>
        </Link>

        {/* 4. Cart Drawer Opener */}
        <button
          type="button"
          onClick={openDrawer}
          className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isCart ? 'text-[#e5a439]' : 'text-gray-300 hover:text-white'
          }`}
          aria-label="Open Cart Drawer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span
              className={`absolute -top-1.5 -right-2.5 bg-[#c68a24] text-[#0d1512] font-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center shadow ${
                totalItems > 0 ? 'scale-100 ring-1 ring-white' : 'scale-90'
              }`}
            >
              {totalItems}
            </span>
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Cart</span>
        </button>
      </div>
    </nav>
  );
}
