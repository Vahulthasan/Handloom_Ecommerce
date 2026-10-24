'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, Search, X, Ship, Check } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialShape = searchParams.get('shape') || 'All';
  const initialTag = searchParams.get('tag') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedShape, setSelectedShape] = useState(initialShape);
  const [selectedSize, setSelectedSize] = useState('All');
  const [maxPrice, setMaxPrice] = useState(150);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  // Sync URL search params
  useEffect(() => {
    if (initialQuery) setSearchQuery(initialQuery);
    if (initialShape && initialShape !== 'All') setSelectedShape(initialShape);
  }, [initialQuery, initialShape]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.active) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesShape = p.shape.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesShape) return false;
        }

        // Shape filter
        if (selectedShape !== 'All' && p.shape !== selectedShape) {
          return false;
        }

        // Size filter
        if (selectedSize !== 'All') {
          if (!p.size_approx.includes(selectedSize)) return false;
        }

        // Price filter
        if (p.price_eur > maxPrice) {
          return false;
        }

        // Tag filter
        if (initialTag !== 'All' && !p.tag.includes(initialTag)) {
          return false;
        }

        // In Stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price_eur - b.price_eur;
        if (sortBy === 'price-high') return b.price_eur - a.price_eur;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'slots') return a.units_per_container_slot - b.units_per_container_slot;
        return 0; // featured default
      });
  }, [products, searchQuery, selectedShape, selectedSize, maxPrice, inStockOnly, sortBy, initialTag]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedShape('All');
    setSelectedSize('All');
    setMaxPrice(150);
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedShape !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (maxPrice < 150 ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Section 5: Hero / Title Card
          - Mobile (<1024px): Stacked layout; Filters button and sort dropdown side by side at 50% each.
          - Laptop and up (1024px+): Title on the left, Filters + sort aligned to the right on the same row.
      */}
      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-4 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title & Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#c68a24] uppercase tracking-wider mb-0.5">
            <Ship className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Pooled Sea Freight Direct to Europe</span>
          </div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white leading-tight">
            All Handwoven Bamboo Lamp Shades
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Handcrafted in Assam &amp; Bengal. Showing {filteredProducts.length} of {products.length} shades.
          </p>
        </div>

        {/* Controls Container:
            - Mobile (<1024px): 50% Filters button + 50% Sort dropdown side by side
            - 1024px+: Sort dropdown aligned to the right
        */}
        <div className="flex items-center gap-2 w-full lg:w-auto flex-shrink-0">
          {/* Mobile Filter Trigger (50% width on <1024px, hidden on 1024px+ per spec) */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden w-1/2 flex-1 min-h-[44px] h-11 flex items-center justify-center gap-2 px-3 py-2 bg-[#173f34] hover:bg-[#1f4f42] active:bg-[#122b22] text-white rounded-md text-xs font-semibold shadow-sm transition-all"
            aria-label="Open filter options"
          >
            <Filter className="w-4 h-4 text-[#e5a439]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#c68a24] text-[#0d1512] font-black text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown (50% width on <1024px, auto on 1024px+) */}
          <div className="w-1/2 flex-1 lg:w-auto lg:flex-initial flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full lg:w-auto min-h-[44px] h-11 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] text-gray-900 dark:text-gray-100 text-xs font-medium outline-none focus:ring-1 focus:ring-[#c68a24]"
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="slots">Container Efficient</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Dismissible Pills */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 p-3 bg-gray-100 dark:bg-[#16221d] rounded-lg text-xs overflow-x-auto no-scrollbar">
          <span className="text-gray-500 font-medium text-[11px] whitespace-nowrap">Filtered by:</span>
          {searchQuery && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1 whitespace-nowrap text-[11px]">
              &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery('')} className="p-0.5 hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedShape !== 'All' && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1 whitespace-nowrap text-[11px]">
              {selectedShape}
              <button onClick={() => setSelectedShape('All')} className="p-0.5 hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedSize !== 'All' && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1 whitespace-nowrap text-[11px]">
              {selectedSize}
              <button onClick={() => setSelectedSize('All')} className="p-0.5 hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}
          {maxPrice < 150 && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1 whitespace-nowrap text-[11px]">
              &le; €{maxPrice}
              <button onClick={() => setMaxPrice(150)} className="p-0.5 hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}
          {inStockOnly && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1 whitespace-nowrap text-[11px]">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="p-0.5 hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[11px] text-[#c68a24] font-bold hover:underline whitespace-nowrap ml-auto pl-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar Layout
          - Section 7: 1024px+ persistent left sidebar (grid-template-columns: 260px 1fr)
      */}
      <div className="grid grid-cols-1 lg:[grid-template-columns:260px_1fr] gap-6 items-start w-full">
        
        {/* Left Sidebar Filters - Persistent on 1024px+ (Desktop) */}
        <aside className="hidden lg:block w-[260px] bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-5 shadow-sm space-y-6 flex-shrink-0">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-gray-900 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-[#c68a24]" />
              <span>Refine Selection</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#c68a24] hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 pl-8 text-xs rounded border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none min-h-[44px]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Shape Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Shade Silhouette
            </label>
            <div className="space-y-1 text-xs">
              {['All', 'Round Globe', 'Four-Point Star', 'Sphere', 'Flared Bell', 'Cylinder', 'Teardrop'].map((shape) => (
                <label key={shape} className="flex items-center gap-2 cursor-pointer py-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <input
                    type="radio"
                    name="shapeFilterDesktop"
                    checked={selectedShape === shape}
                    onChange={() => setSelectedShape(shape)}
                    className="accent-[#173f34] w-4 h-4"
                  />
                  <span>{shape}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Handmade Size Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Size (Approximate)
              </label>
              <span className="text-[10px] text-gray-400 italic">±2 cm rule</span>
            </div>
            <div className="space-y-1 text-xs">
              {[
                { label: 'All Dimensions', val: 'All' },
                { label: 'approx. 35 cm (±2 cm)', val: '35 cm' },
                { label: 'approx. 40 cm (±2 cm)', val: '40 cm' },
                { label: 'approx. 45 cm (±2 cm)', val: '45 cm' },
                { label: 'approx. 50 cm (±2 cm)', val: '50 cm' },
              ].map((sz) => (
                <label key={sz.val} className="flex items-center gap-2 cursor-pointer py-1 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
                  <input
                    type="radio"
                    name="sizeFilterDesktop"
                    checked={selectedSize === sz.val}
                    onChange={() => setSelectedSize(sz.val)}
                    className="accent-[#173f34] w-4 h-4"
                  />
                  <span>{sz.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700 dark:text-gray-300">Max Price:</span>
              <span className="font-bold text-[#173f34] dark:text-[#e5a439]">
                €{maxPrice}.00
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="150"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#c68a24] cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>€70</span>
              <span>€150</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <label className="flex items-center gap-2 text-xs cursor-pointer py-1">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#173f34] w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                In Stock in India Only
              </span>
            </label>
          </div>
        </aside>

        {/* Right Product Grid Area:
            - Section 6: product-auto-grid: repeat(auto-fill, minmax(min(100%, 240px), 1fr))
        */}
        <main className="w-full min-w-0 space-y-4">
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#173f34] border-t-[#c68a24] rounded-full animate-spin" />
              <p className="text-xs text-gray-500 mt-3">Loading authentic Indian bamboo shades...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-[#16221d] rounded-xl border p-8 sm:p-12 text-center space-y-3">
              <Search className="w-10 h-10 mx-auto text-gray-400" />
              <h3 className="font-heading font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                No matching handmade shades found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your search terms or resetting the shape and approximate size filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 min-h-[44px] bg-[#173f34] text-white rounded text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="product-auto-grid w-full">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Section 7: Mobile Filter Bottom Sheet / Slide-in Modal (<1024px) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-Up Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-white dark:bg-[#14231c] rounded-t-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Sheet Header */}
            <div className="px-4 py-3.5 bg-[#173f34] text-white flex items-center justify-between border-b border-[#235848]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#e5a439]" />
                <h3 className="font-heading font-bold text-sm">Filter &amp; Refine Shades</h3>
              </div>
              <div className="flex items-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#e5a439] font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-gray-300 hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Options */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              {/* Silhouette */}
              <div>
                <label className="font-heading font-bold text-gray-900 dark:text-white block mb-2 text-xs uppercase tracking-wider text-[#c68a24]">
                  Shade Silhouette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Round Globe', 'Four-Point Star', 'Sphere', 'Flared Bell', 'Cylinder', 'Teardrop'].map((shape) => (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setSelectedShape(shape)}
                      className={`min-h-[44px] px-3 py-2 rounded-lg text-left font-medium border flex items-center justify-between transition-colors ${
                        selectedShape === shape
                          ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f0f5f2] dark:bg-[#1a2d24] text-[#173f34] dark:text-[#e5a439] font-bold'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{shape}</span>
                      {selectedShape === shape && <Check className="w-3.5 h-3.5 text-[#c68a24]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approximate Size */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-heading font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider text-[#c68a24]">
                    Handmade Size
                  </label>
                  <span className="text-[10px] text-gray-400 italic">±2 cm rule</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Dimensions', val: 'All' },
                    { label: 'approx. 35 cm (±2 cm)', val: '35 cm' },
                    { label: 'approx. 40 cm (±2 cm)', val: '40 cm' },
                    { label: 'approx. 45 cm (±2 cm)', val: '45 cm' },
                    { label: 'approx. 50 cm (±2 cm)', val: '50 cm' },
                  ].map((sz) => (
                    <button
                      key={sz.val}
                      type="button"
                      onClick={() => setSelectedSize(sz.val)}
                      className={`w-full min-h-[44px] px-3 py-2 rounded-lg text-left font-medium border flex items-center justify-between transition-colors ${
                        selectedSize === sz.val
                          ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f0f5f2] dark:bg-[#1a2d24] text-[#173f34] dark:text-[#e5a439] font-bold'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span>{sz.label}</span>
                      {selectedSize === sz.val && <Check className="w-3.5 h-3.5 text-[#c68a24]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider text-[#c68a24]">
                    Max Price
                  </span>
                  <span className="font-bold text-[#173f34] dark:text-[#e5a439] text-sm">
                    €{maxPrice}.00
                  </span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="150"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#c68a24] cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg min-h-[44px]"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>€70</span>
                  <span>€150</span>
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer min-h-[44px]">
                  <span className="font-medium text-gray-900 dark:text-gray-200">
                    In Stock in India Only
                  </span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-5 h-5 accent-[#173f34]"
                  />
                </label>
              </div>
            </div>

            {/* Bottom Apply Action Button */}
            <div className="p-3 bg-gray-50 dark:bg-[#0f1b15] border-t border-gray-200 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full min-h-[44px] h-11 px-4 rounded-lg bg-[#c68a24] hover:bg-[#e5a439] active:bg-[#b0781c] text-[#0d1512] font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Show {filteredProducts.length} Matching Shades</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
