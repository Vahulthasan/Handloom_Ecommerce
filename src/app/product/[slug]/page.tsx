import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getOpenContainer } from '@/lib/data';
import ImageZoom from '@/components/ImageZoom';
import ProductBuyBox from '@/components/ProductBuyBox';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import { Star, ShieldCheck, ChevronRight, Sparkles, Check, HeartHandshake } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const openContainer = await getOpenContainer();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 py-1 overflow-x-auto">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/shop" className="hover:text-gray-900 dark:hover:text-white transition-colors">
          Handmade Shades
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-500">{product.shape}</span>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout: 3 Columns (Gallery / Details / Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Col 1 & 2: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <ImageZoom images={product.images} productName={product.name} />
          
          <div className="mt-4 p-3 bg-white dark:bg-[#16221d] rounded-lg border border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-[#c68a24]" />
              Natural unbleached bamboo cane
            </span>
            <span>Photos showing front & artisan scale</span>
          </div>
        </div>

        {/* Col 2: Product Overview & Specifications (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            {/* Tag / Badge */}
            {product.tag && (
              <span className="inline-flex items-center gap-1 bg-[#173f34] text-[#e5a439] text-xs font-bold px-2.5 py-0.5 rounded shadow-sm mb-2">
                <Sparkles className="w-3 h-3 text-[#c68a24]" />
                {product.tag}
              </span>
            )}

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-[#c68a24] font-semibold mt-1">
              Brand: Vintage Collections (Direct Indian Artisan Maker-Exporter)
            </p>

            {/* Ratings Summary Link */}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex text-[#c68a24]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#c68a24] text-[#c68a24]'
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {product.rating}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({product.review_count} verified European reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* About This Item Bulleted List (Amazon-Style) */}
          <div className="space-y-2">
            <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
              About this item:
            </h2>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications Table (Includes HANDMADE ROW and APPROXIMATE MEASUREMENTS) */}
          <div className="space-y-2 pt-2">
            <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
              Product Specifications:
            </h2>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left divide-y divide-gray-200 dark:divide-gray-800">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  <tr className="bg-gray-50 dark:bg-[#121c17]">
                    <td className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-400 w-1/3">
                      Material
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                      {product.material}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">
                      Silhouette
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                      {product.shape}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-[#121c17]">
                    <td className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">
                      Dimensions
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">
                      {product.dimensions_note}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">
                      Fitting Compatibility
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                      European CE standard E26 / E27 lamp holders (cord & bulb not included)
                    </td>
                  </tr>
                  <tr className="bg-gray-50 dark:bg-[#121c17]">
                    <td className="px-3 py-2 font-semibold text-gray-600 dark:text-gray-400">
                      Container Space
                    </td>
                    <td className="px-3 py-2 text-gray-900 dark:text-white">
                      {product.units_per_container_slot} unit slot in sea freight container
                    </td>
                  </tr>
                  {/* MANDATORY HANDMADE RULE ROW */}
                  <tr className="bg-[#f2f7f4] dark:bg-[#172b22] border-t-2 border-[#173f34] dark:border-[#c68a24]">
                    <td className="px-3 py-2.5 font-bold text-[#173f34] dark:text-[#e5a439]">
                      Handmade Rule
                    </td>
                    <td className="px-3 py-2.5 text-[#173f34] dark:text-[#e5a439] font-medium leading-snug">
                      {product.handmade_statement}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Col 3: Sticky Buy Box (3 cols) */}
        <div className="lg:col-span-3 sticky top-24">
          <ProductBuyBox product={product} openContainer={openContainer} />
        </div>
      </div>

      {/* Frequently Bought Together / More From This Range */}
      <section className="pt-10 border-t border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-gray-900 dark:text-white">
            More From This Range (Frequently Pooled Together)
          </h2>
          <Link href="/shop" className="text-xs font-semibold text-[#173f34] dark:text-[#e5a439] hover:underline">
            View full catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <ReviewsSection rating={product.rating} reviewCount={product.review_count} />
    </div>
  );
}
