'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  ShoppingCart,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Ship,
  Compass,
  Menu,
  X,
  PackageCheck,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
    if (selectedCategory !== 'All') queryParams.set('shape', selectedCategory);
    router.push(`/shop?${queryParams.toString()}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Government Approval Ribbon */}
      <div className="bg-[#0b1c16] text-gray-300 text-[11px] border-b border-[#183a30] py-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Government Seals and Approval Note */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 bg-[#122b22] px-2.5 py-0.5 rounded-full border border-[#235345] shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/gov/Seal_of_Tamil_Nadu.webp"
                alt="Government of Tamil Nadu Official Seal"
                className="h-5 sm:h-6 w-auto object-contain brightness-110"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/gov/india_centralGov_logo.webp"
                alt="Government of India Official Emblem"
                className="h-5 sm:h-6 w-auto object-contain brightness-110"
              />
              <span className="font-semibold text-white tracking-wide text-[10px] sm:text-[11px] flex items-center gap-1">
                <span className="text-[#e5a439]">Govt. of Tamil Nadu</span>
                <span className="text-gray-400">&amp;</span>
                <span className="text-[#e5a439]">Govt. of India</span>
                <span className="hidden xs:inline text-gray-200">Approved Exporter</span>
              </span>
            </div>
            <span className="hidden lg:inline text-gray-500">•</span>
            <span className="hidden lg:inline text-gray-300 text-[11px]">
              Direct Indian Artisan Handloom &amp; Bamboo Export Portal to Europe
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] flex-shrink-0">
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Sea Freight Active: Nhava Sheva &rarr; Rotterdam/Hamburg
            </span>
            <span className="text-gray-400 hidden xs:inline">Direct EUR (€) Billing</span>
          </div>
        </div>
      </div>

      {/* Primary Amazon-Style Dark Forest Bar */}
      <div className="bg-[#173f34] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* Brand Logo & Top Corner Government Approval Badges */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2.5 p-1 rounded hover:ring-1 hover:ring-[#c68a24] transition-all flex-shrink-0"
                title="Vintage Collections — Indian Handloom Maker-Exporter"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c68a24] to-[#e5a439] flex items-center justify-center font-bold text-[#0d1512] shadow-sm text-lg">
                  VC
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight leading-none text-white">
                    Vintage Collections
                  </span>
                  <span className="text-[10px] text-[#e5a439] font-medium tracking-wider uppercase mt-0.5 flex items-center gap-1">
                    <span>Indian Maker-Exporter</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-[#e5a439]"></span>
                    <span>EU Direct</span>
                  </span>
                </div>
              </Link>

              {/* Official Government Approval Badges (Top Corner) */}
              <div
                className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-[#245749] py-0.5"
                title="Government of Tamil Nadu & Government of India Approved Handloom Exporter"
              >
                <div className="flex items-center gap-1.5 bg-[#0e2720] hover:bg-[#153a30] px-2 py-1 rounded-md border border-[#255b4c] transition-colors">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/gov/Seal_of_Tamil_Nadu.webp"
                    alt="Govt. of Tamil Nadu Seal"
                    className="h-7 sm:h-8 w-auto object-contain drop-shadow"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/gov/india_centralGov_logo.webp"
                    alt="Govt. of India Emblem"
                    className="h-7 sm:h-8 w-auto object-contain drop-shadow"
                  />
                  <div className="hidden sm:flex flex-col text-left leading-none">
                    <span className="text-[9px] font-extrabold text-[#e5a439] tracking-wider uppercase">
                      Govt. Approved
                    </span>
                    <span className="text-[8px] text-gray-300 font-medium mt-0.5">
                      TN &amp; Central India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliver To Europe Badge */}
            <div className="hidden lg:flex items-center gap-1.5 p-1.5 rounded hover:ring-1 hover:ring-[#c68a24] cursor-pointer text-xs text-gray-200">
              <MapPin className="w-4 h-4 text-[#e5a439] flex-shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] text-gray-300">Deliver to</span>
                <span className="font-bold text-white flex items-center gap-1">
                  Europe (EU Pooled)
                </span>
              </div>
            </div>

            {/* Amazon-Style Universal Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 max-w-2xl hidden md:flex items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#c68a24]"
            >
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-100 text-gray-700 text-xs px-3 h-full border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer transition-colors"
                aria-label="Filter category"
              >
                <option value="All">All Shapes</option>
                <option value="Round Globe">Round Globe</option>
                <option value="Four-Point Star">Four-Point Star</option>
                <option value="Sphere">Sphere</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search handmade bamboo pendant shades (e.g. dome, star, 40cm)..."
                className="flex-1 px-3 py-2 text-sm text-gray-900 outline-none placeholder-gray-400"
              />

              <button
                type="submit"
                className="bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] px-4 h-full flex items-center justify-center transition-colors"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Right Action Icons & Badges */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Currency Badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded hover:ring-1 hover:ring-[#c68a24] text-xs">
                <span className="text-[#e5a439] font-bold">€ EUR</span>
              </div>

              {/* Returns & Orders (Track Order) */}
              <Link
                href="/track"
                className="flex flex-col p-1.5 rounded hover:ring-1 hover:ring-[#c68a24] text-xs leading-tight transition-all"
              >
                <span className="text-gray-300 text-[11px]">Track</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <span>Orders</span>
                  <PackageCheck className="w-3.5 h-3.5 text-[#e5a439]" />
                </span>
              </Link>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[#1f4f42] text-gray-200 hover:text-[#e5a439] transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Amazon-Style Cart Badge */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-1.5 p-1.5 rounded hover:ring-1 hover:ring-[#c68a24] transition-all"
                aria-label="Open cart drawer"
              >
                <div className="relative">
                  <ShoppingCart className="w-7 h-7 text-white" />
                  <span
                    className={`absolute -top-1.5 -right-2 bg-[#c68a24] text-[#0d1512] font-black text-xs min-w-[20px] h-[20px] rounded-full flex items-center justify-center shadow transition-transform ${
                      totalItems > 0 ? 'scale-105' : 'scale-90'
                    }`}
                  >
                    {totalItems}
                  </span>
                </div>
                <span className="hidden md:inline font-bold text-sm text-white">Cart</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 text-gray-200 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Row */}
          <div className="pb-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="flex items-center h-9 rounded bg-white overflow-hidden shadow-inner">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bamboo shades..."
                className="flex-1 px-3 text-xs text-gray-900 outline-none"
              />
              <button
                type="submit"
                className="bg-[#c68a24] text-[#0d1512] px-3 h-full flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sub-Header Navigation Bar */}
      <div className="bg-[#123129] border-t border-[#1b483c] text-xs text-gray-200 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2 gap-4 scrollbar-none">
          <div className="flex items-center gap-5 whitespace-nowrap">
            <Link href="/shop" className="hover:text-[#e5a439] flex items-center gap-1 transition-colors">
              <Compass className="w-3.5 h-3.5 text-[#e5a439]" />
              <span>All Handmade Shades</span>
            </Link>
            <Link href="/shop?tag=Artisan+Best+Seller" className="hover:text-[#e5a439] transition-colors">
              Best Sellers
            </Link>
            <Link href="/track" className="hover:text-[#e5a439] flex items-center gap-1 transition-colors">
              <Ship className="w-3.5 h-3.5 text-[#e5a439]" />
              <span>Container Pooling Schedule</span>
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#e5a439] transition-colors">
              How Ordering Works
            </Link>
            <Link href="/policies/shipping" className="hover:text-[#e5a439] transition-colors">
              Sea Freight & Transit
            </Link>
            <Link href="/policies/contact" className="hover:text-[#e5a439] transition-colors">
              Artisan Export Inquiries
            </Link>
          </div>

          <div className="flex items-center gap-3 text-gray-300 whitespace-nowrap">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#e5a439]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Artisan Pricing
            </span>
            <Link
              href="/admin"
              className="text-[11px] px-2 py-0.5 rounded bg-[#1f4f42] hover:bg-[#286353] text-[#e5a439] border border-[#2e6f5d] font-semibold transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#123129] text-white border-t border-[#1b483c] px-4 py-4 space-y-3">
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#e5a439]"
          >
            All Handmade Shades
          </Link>
          <Link
            href="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#e5a439]"
          >
            Track Order & Container Status
          </Link>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#e5a439]"
          >
            How Container Pooling Works
          </Link>
          <Link
            href="/policies/shipping"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#e5a439]"
          >
            Shipping & Container Timeline
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-block mt-2 px-3 py-1 bg-[#1f4f42] text-[#e5a439] rounded text-xs"
          >
            Admin Management Portal
          </Link>
          <div className="pt-3 border-t border-[#1b483c] flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gov/Seal_of_Tamil_Nadu.webp"
              alt="Government of Tamil Nadu"
              className="h-6 w-auto object-contain"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gov/india_centralGov_logo.webp"
              alt="Government of India"
              className="h-6 w-auto object-contain"
            />
            <span className="text-[10px] text-gray-300">
              Approved by Govt. of Tamil Nadu &amp; Govt. of India
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
