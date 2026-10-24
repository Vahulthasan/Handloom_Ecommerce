'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  ShoppingCart,
  Moon,
  Sun,
  ShieldCheck,
  Ship,
  Compass,
  Menu,
  X,
  PackageCheck,
  ChevronRight,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const { totalItems, openDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
    if (selectedCategory !== 'All') queryParams.set('shape', selectedCategory);
    router.push(`/shop?${queryParams.toString()}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full shadow-md bg-[#173f34] text-white">
        {/* Top Government Ribbon - Compact & responsive */}
        <div className="bg-[#0b1c16] text-gray-300 text-[11px] border-b border-[#183a30] py-1 px-3 sm:px-6 w-full overflow-hidden">
          <div className="w-[min(100%-2rem,1280px)] mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <div className="flex items-center gap-1.5 bg-[#122b22] px-2 py-0.5 rounded-full border border-[#235345] shadow-xs flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/gov/Seal_of_Tamil_Nadu.webp"
                  alt="Govt. of Tamil Nadu"
                  className="h-4 sm:h-5 w-auto object-contain brightness-110"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/gov/india_centralGov_logo.webp"
                  alt="Govt. of India"
                  className="h-4 sm:h-5 w-auto object-contain brightness-110"
                />
                <span className="font-semibold text-white tracking-wide text-[10px] sm:text-[11px]">
                  <span className="text-[#e5a439]">Govt. Approved</span> Exporter
                </span>
              </div>
              <span className="hidden md:inline text-gray-400 text-[11px] truncate">
                Direct Indian Artisan Handloom &amp; Bamboo Export to Europe
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] flex-shrink-0">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">Sea Freight Active: Nhava Sheva ➔ Rotterdam</span>
                <span className="sm:hidden">Sea Freight Active</span>
              </span>
              <span className="text-gray-400 hidden xs:inline">• EUR (€)</span>
            </div>
          </div>
        </div>

        {/* Primary Header Bar */}
        <div className="w-full">
          <div className="w-[min(100%-2rem,1280px)] mx-auto">
            {/* ROW 1:
                - Mobile (<768px): Logo on left | Cart + Theme + Hamburger on right
                - Tablet/Laptop (768px+): Logo | Search (flex: 1, max-w 600px) | Track Orders (icon + text) | Theme | Cart
                - Desktop (1024px+): Govt. badges beside logo + full tagline "INDIAN MAKER-EXPORTER • EU DIRECT"
            */}
            <div className="flex items-center justify-between h-14 md:h-16 gap-3 sm:gap-6">
              
              {/* Logo + Desktop Tagline & Govt Seals */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-2 p-1 rounded hover:ring-1 hover:ring-[#c68a24] transition-all min-w-0"
                  title="Vintage Collections — Indian Handloom Maker-Exporter"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#c68a24] to-[#e5a439] flex items-center justify-center font-bold text-[#0d1512] shadow-sm text-base sm:text-lg flex-shrink-0">
                    VC
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight leading-none text-white whitespace-nowrap">
                      Vintage Collections
                    </span>
                    {/* Full tagline visible on 1024px+ (Desktop) */}
                    <span className="hidden lg:flex text-[9px] text-[#e5a439] font-medium tracking-wider uppercase mt-0.5 items-center gap-1 whitespace-nowrap">
                      <span>INDIAN MAKER-EXPORTER</span>
                      <span className="inline-block w-1 h-1 rounded-full bg-[#e5a439]"></span>
                      <span>EU DIRECT</span>
                    </span>
                  </div>
                </Link>

                {/* Desktop (1024px+): Govt. of Tamil Nadu & Govt. of India Seals Beside Logo */}
                <div
                  className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#245749] py-0.5 flex-shrink-0"
                  title="Government of Tamil Nadu & Government of India Approved Handloom Exporter"
                >
                  <div className="flex items-center gap-1.5 bg-[#0e2720] hover:bg-[#153a30] px-2 py-1 rounded-md border border-[#255b4c] transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/gov/Seal_of_Tamil_Nadu.webp"
                      alt="Govt. of Tamil Nadu Seal"
                      className="h-7 w-auto object-contain drop-shadow"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/gov/india_centralGov_logo.webp"
                      alt="Govt. of India Emblem"
                      className="h-7 w-auto object-contain drop-shadow"
                    />
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[9px] font-extrabold text-[#e5a439] tracking-wider uppercase">
                        Govt. Approved
                      </span>
                      <span className="text-[8px] text-gray-300 font-medium mt-0.5">
                        TN &amp; India IEC
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet & Desktop (768px+): Inline Search Bar (flex: 1, max-width 600px) */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex flex-1 max-w-[600px] items-center h-10 rounded-md overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#c68a24]"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-100 text-gray-700 text-xs px-2.5 h-full border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer transition-colors"
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
                  placeholder="Search handmade bamboo shades..."
                  className="flex-1 px-3 py-2 text-sm text-gray-900 outline-none placeholder-gray-400"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] px-3.5 h-full flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Right Action Cluster */}
              <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
                {/* Track Orders (icon + text on 768px+, hidden on mobile where it lives in hamburger menu per spec) */}
                <Link
                  href="/track"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:ring-1 hover:ring-[#c68a24] text-xs leading-tight transition-all font-medium text-gray-200 hover:text-white"
                  title="Track Container Orders"
                >
                  <PackageCheck className="w-4 h-4 text-[#e5a439] flex-shrink-0" />
                  <span>Track Orders</span>
                </Link>

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[#1f4f42] text-gray-200 hover:text-[#e5a439] transition-colors"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Cart Badge */}
                <button
                  onClick={openDrawer}
                  className="relative flex items-center gap-1.5 p-2 min-h-[44px] min-w-[44px] rounded hover:ring-1 hover:ring-[#c68a24] transition-all"
                  aria-label="Open cart drawer"
                >
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6 text-white" />
                    <span
                      className={`absolute -top-1.5 -right-2 bg-[#c68a24] text-[#0d1512] font-black text-[11px] min-w-[19px] h-[19px] rounded-full flex items-center justify-center shadow transition-transform ${
                        totalItems > 0 ? 'scale-105 ring-1 ring-white' : 'scale-90'
                      }`}
                    >
                      {totalItems}
                    </span>
                  </div>
                  <span className="hidden md:inline font-bold text-xs text-white">Cart</span>
                </button>

                {/* Mobile Hamburger Button (Disappears on 768px+ per spec) */}
                <button
                  onClick={() => setMobileDrawerOpen(true)}
                  className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-gray-200 hover:text-white hover:bg-[#1f4f42] transition-colors"
                  aria-label="Open Navigation Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Mobile ROW 2: Full-Width Search Bar (<768px only) */}
            <div className="pb-3 md:hidden w-full">
              <form onSubmit={handleSearchSubmit} className="flex items-center h-11 rounded-md bg-white overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-[#c68a24]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search handmade bamboo shades..."
                  className="flex-1 px-3 text-sm text-gray-900 outline-none placeholder-gray-500 min-h-[44px]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] px-4 h-full flex items-center justify-center transition-colors flex-shrink-0 min-h-[44px]"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Section 4: Category Nav
            - Mobile (<1024px): Horizontally scrollable pill row (overflow-x: auto; scroll-snap-type: x proximity; hidden scrollbar; fade on the right edge).
            - 1024px+: Pills wrap or sit in a centered row with no scrolling needed.
        */}
        <div className="bg-[#0f2720] border-t border-[#193a30] text-xs text-gray-200 font-medium w-full">
          <div className="w-[min(100%-2rem,1280px)] mx-auto relative">
            <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth [scroll-snap-type:x_proximity] category-nav-fade lg:flex-wrap lg:justify-center">
              <Link
                href="/shop"
                className="scroll-snap-align-start flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#173f34] text-[#e5a439] text-xs font-bold border border-[#235849] whitespace-nowrap flex-shrink-0"
              >
                <Compass className="w-3.5 h-3.5 text-[#e5a439]" />
                <span>All Shades</span>
              </Link>
              <Link
                href="/shop?tag=Artisan+Best+Seller"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                Artisan Best Sellers
              </Link>
              <Link
                href="/shop?shape=Round+Globe"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                Round Globe
              </Link>
              <Link
                href="/shop?shape=Four-Point+Star"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                Four-Point Star
              </Link>
              <Link
                href="/track"
                className="scroll-snap-align-start flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                <Ship className="w-3.5 h-3.5 text-[#e5a439]" />
                <span>Container Pooling Schedule</span>
              </Link>
              <Link
                href="/#how-it-works"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/policies/shipping"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full hover:bg-[#173f34] text-gray-200 hover:text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 transition-colors"
              >
                Sea Freight &amp; Transit
              </Link>
              <Link
                href="/admin"
                className="scroll-snap-align-start px-3 py-1.5 rounded-full bg-[#1b4337] text-[#e5a439] text-xs whitespace-nowrap flex-shrink-0 font-semibold border border-[#285e4e]"
              >
                Admin Desk
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hamburger Drawer Menu (Mobile <768px): Contains Track Orders & Govt Emblem Badge per Section 3 */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-[84vw] max-w-sm bg-[#122b22] text-white shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 bg-[#0a1a14] border-b border-[#1b3d30] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#c68a24] to-[#e5a439] flex items-center justify-center font-bold text-[#0d1512] shadow-sm text-sm">
                  VC
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-white">
                    Vintage Collections
                  </h3>
                  <p className="text-[10px] text-[#e5a439]">Direct Maker-Exporter to Europe</p>
                </div>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-[#173f34]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1b3d30] text-xs">
              {/* Official Govt. of Tamil Nadu & Govt. of India Emblem Badge (Inside Hamburger per Spec) */}
              <div className="p-4 bg-[#0e241c] space-y-2">
                <div className="flex items-center gap-2 bg-[#122b22] p-2.5 rounded-lg border border-[#235345]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/gov/Seal_of_Tamil_Nadu.webp"
                    alt="Govt of Tamil Nadu"
                    className="h-8 w-auto object-contain"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/gov/india_centralGov_logo.webp"
                    alt="Govt of India"
                    className="h-8 w-auto object-contain"
                  />
                  <div className="text-[11px] text-gray-200 leading-tight">
                    <strong className="text-[#e5a439] block font-bold">Govt. Approved Exporter</strong>
                    <span className="text-[10px] text-gray-400">Govt. of Tamil Nadu &amp; Govt. of India</span>
                  </div>
                </div>
              </div>

              {/* Track Orders Link (Inside Hamburger per Spec) */}
              <div className="p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                  Order Management
                </div>
                <Link
                  href="/track"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-3 px-3 rounded-lg bg-[#183d31] hover:bg-[#204e3f] text-white font-semibold transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <PackageCheck className="w-4 h-4 text-[#e5a439]" />
                    <span>Track Orders &amp; Container Status</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#e5a439]" />
                </Link>
              </div>

              {/* Shop Categories */}
              <div className="p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                  Shop Handcrafted Lighting
                </div>
                <Link
                  href="/shop"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#193a2f] text-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Compass className="w-4 h-4 text-[#e5a439]" />
                    <span>All Handwoven Lamp Shades</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/shop?tag=Artisan+Best+Seller"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#193a2f] text-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Sparkles className="w-4 h-4 text-[#e5a439]" />
                    <span>Artisan Best Sellers</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/shop?shape=Round+Globe"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#193a2f] text-gray-300 transition-colors ml-4"
                >
                  <span>• Round Globe Shades</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
                <Link
                  href="/shop?shape=Four-Point+Star"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[#193a2f] text-gray-300 transition-colors ml-4"
                >
                  <span>• Four-Point Star Geometric</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>

              {/* Sea Freight & Policies */}
              <div className="p-4 space-y-1">
                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
                  Sea Freight &amp; Help
                </div>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#193a2f] text-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Info className="w-4 h-4 text-[#e5a439]" />
                    <span>How Container Pooling Works</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/policies/shipping"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[#193a2f] text-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#e5a439]" />
                    <span>Sea Freight Shipping Policy</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/policies/returns"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-[#193a2f] text-gray-300"
                >
                  Returns &amp; Cancellations
                </Link>
                <Link
                  href="/policies/contact"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="block py-2 px-3 rounded-lg hover:bg-[#193a2f] text-gray-300"
                >
                  Artisan Export Inquiries
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#193d31] text-[#e5a439] font-semibold border border-[#235848] mt-2"
                >
                  <span>Admin Management Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
