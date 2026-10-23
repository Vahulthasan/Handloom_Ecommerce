'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, Search, X, Ship } from 'lucide-react';

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

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedShape !== 'All' ||
    selectedSize !== 'All' ||
    maxPrice < 150 ||
    inStockOnly;

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#c68a24] uppercase tracking-wider mb-1">
            <Ship className="w-3.5 h-3.5" />
            <span>Pooled Sea Freight Direct to Europe</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white">
            All Handwoven Bamboo Pendant Shades
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Handmade in Assam & Bengal. Showing {filteredProducts.length} of {products.length} shades.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 bg-[#173f34] text-white rounded text-xs font-semibold"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] text-gray-900 dark:text-gray-100 text-xs outline-none focus:ring-1 focus:ring-[#c68a24]"
            >
              <option value="featured">Featured / Best Match</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
              <option value="slots">Most Container Efficient</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar Filters (Desktop) */}
        <aside
          className={`md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } md:col-span-1 bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-5 shadow-sm space-y-6`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 font-heading font-bold text-sm text-gray-900 dark:text-white">
              <SlidersHorizontal className="w-4 h-4 text-[#c68a24]" />
              <span>Refine Selection</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#c68a24] hover:underline"
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
                className="w-full px-3 py-1.5 pl-8 text-xs rounded border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white outline-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Shape Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Shade Silhouette
            </label>
            <div className="space-y-1 text-xs">
              {['All', 'Round Globe', 'Four-Point Star', 'Sphere', 'Flared Bell', 'Cylinder', 'Teardrop'].map((shape) => (
                <label key={shape} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="shapeFilter"
                    checked={selectedShape === shape}
                    onChange={() => setSelectedShape(shape)}
                    className="accent-[#173f34]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{shape}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Handmade Size Filter (approx. measurements rule!) */}
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
                <label key={sz.val} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="sizeFilter"
                    checked={selectedSize === sz.val}
                    onChange={() => setSelectedSize(sz.val)}
                    className="accent-[#173f34]"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{sz.label}</span>
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
              className="w-full accent-[#c68a24] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>€70</span>
              <span>€150</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#173f34]"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                In Stock in India Only
              </span>
            </label>
          </div>

          {/* Handmade Artisan Note */}
          <div className="p-3 bg-[#f7faf8] dark:bg-[#121c17] rounded border border-gray-200 dark:border-gray-800 text-[11px] text-gray-600 dark:text-gray-400 leading-snug">
            <strong>Handmade Rule:</strong> Every shade is individually split and woven by hand. Measurements are approximate (±2 cm).
          </div>
        </aside>

        {/* Right Product Grid */}
        <main className="md:col-span-3 space-y-4">
          {/* Active Filters Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 bg-gray-100 dark:bg-[#16221d] rounded-lg text-xs">
              <span className="text-gray-500 font-medium">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  Query: {searchQuery}
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedShape !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  Shape: {selectedShape}
                  <button onClick={() => setSelectedShape('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSize !== 'All' && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  Size: {selectedSize}
                  <button onClick={() => setSelectedSize('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {maxPrice < 150 && (
                <span className="px-2 py-0.5 rounded bg-white dark:bg-[#1f3028] border text-gray-700 dark:text-gray-200 flex items-center gap-1">
                  Up to €{maxPrice}
                  <button onClick={() => setMaxPrice(150)}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#c68a24] font-bold hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-[#173f34] border-t-[#c68a24] rounded-full animate-spin" />
              <p className="text-xs text-gray-500 mt-3">Loading authentic Indian bamboo shades...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-[#16221d] rounded-xl border p-12 text-center space-y-3">
              <Search className="w-12 h-12 mx-auto text-gray-400" />
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                No matching handmade shades found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your search terms or resetting the shape and approximate size filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#173f34] text-white rounded text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
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
