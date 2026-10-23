import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getOpenContainer } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import ContainerProgressBar from '@/components/ContainerProgressBar';
import {
  ArrowRight,
  ShieldCheck,
  Ship,
  Sparkles,
  Package,
  CheckCircle,
  Truck,
  HeartHandshake,
  Compass,
  Layers,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  const openContainer = await getOpenContainer();
  const bestSellers = products.slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* 1. DARK EVENING HERO WITH WARM AMBER GLOW & SOFTLY SWAYING SHADES */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0d1512] text-white shadow-2xl border border-[#1b2b24]">
        {/* Ambient Warm Amber Glow Pulses in Background */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#c68a24]/20 rounded-full blur-3xl pointer-events-none animate-amber-glow" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#173f34]/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173f34]/80 border border-[#23594b] text-[#e5a439] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Indian Maker-Exporter to Europe</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
              Handwoven bamboo pendant shades,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a439] via-[#c68a24] to-[#f5c66b]">
                delivered to Europe
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl font-light leading-relaxed">
              Order artisanal lighting with Amazon ease. Paid orders are pooled into dedicated sea shipping containers. When the container fills, it sails straight to European ports—slashing transport costs and freight emissions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-bold text-sm sm:text-base rounded-md shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>Shop All Handmade Shades</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/#how-it-works"
                className="px-6 py-3.5 bg-[#173f34] hover:bg-[#1f4f42] text-white border border-[#2e6e5b] text-sm sm:text-base font-semibold rounded-md transition-colors"
              >
                How Container Pooling Works
              </Link>
            </div>

            {/* Quick Live Container Alert in Hero */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-black/40 border border-[#243d33] text-xs text-gray-300">
                <Ship className="w-4 h-4 text-[#e5a439]" />
                <span>
                  Currently filling: <strong className="text-white">{openContainer.label}</strong> ({openContainer.used_units}/{openContainer.capacity_units} units reserved)
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals: Swaying Bamboo Hanging Shades */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
              
              {/* Swaying Shade 1 (Round Dome) */}
              <div className="absolute top-0 left-4 w-52 h-64 animate-sway-slow z-20">
                {/* Vintage hanging cord */}
                <div className="w-1 h-12 bg-gradient-to-b from-[#241a10] to-[#593d22] mx-auto rounded-full" />
                <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl border border-amber-600/30">
                  <Image
                    src="/images/round-shade.jpg"
                    alt="Round Handwoven Bamboo Pendant Shade hanging with warm ambient light"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Swaying Shade 2 (Four-Point Star) */}
              <div className="absolute top-8 right-2 w-56 h-72 animate-sway-alt z-10">
                {/* Vintage hanging cord */}
                <div className="w-1 h-16 bg-gradient-to-b from-[#241a10] to-[#593d22] mx-auto rounded-full" />
                <div className="relative w-52 h-52 rounded-2xl overflow-hidden shadow-2xl border border-amber-500/20">
                  <Image
                    src="/images/four-point-shade.jpg"
                    alt="Four-Point Geometric Bamboo Lamp Shade casting intricate geometric shadows"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Floating Artisan Scale Pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 bg-[#173f34]/95 backdrop-blur-md border border-[#2d735f] px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs text-white whitespace-nowrap">
                <HeartHandshake className="w-4 h-4 text-[#e5a439]" />
                <span>Generational Bamboo Split Craft from India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tiles Overlapping Hero Bottom */}
        <div className="relative z-20 bg-[#121c18]/95 border-t border-[#1e3328] px-6 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Round Dome Shades', query: 'shape=Round+Globe', count: 'Classic Globe & Spheres' },
              { title: 'Four-Point Star', query: 'shape=Four-Point+Star', count: 'Geometric Chandelier' },
              { title: 'Dining Table Clustered', query: 'tag=Artisan+Best+Seller', count: 'Statement Over Islands' },
              { title: 'All Handloom Lamps', query: '', count: 'Full European Collection' },
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={`/shop?${cat.query}`}
                className="group p-3 rounded-lg bg-[#17241e] hover:bg-[#1e3028] border border-[#23382f] hover:border-[#c68a24] transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-[#e5a439] transition-colors">
                    {cat.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#e5a439] group-hover:translate-x-0.5 transition-all" />
                </div>
                <span className="text-[11px] text-gray-400 mt-1">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP (Handwoven in India / Ships by sea container / Secure checkout / EU Compatibility) */}
      <section className="bg-white dark:bg-[#16221d] rounded-xl border border-[#d2dbd4] dark:border-[#273b33] p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#f0f4f1] dark:bg-[#121c17] text-[#173f34] dark:text-[#e5a439] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                Handwoven in India
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Each piece individually woven from seasoned natural bamboo cane by village artisans.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#f0f4f1] dark:bg-[#121c17] text-[#173f34] dark:text-[#e5a439] flex-shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                Pooled Sea Container
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Orders consolidate into ocean containers. Ships when full to minimize maritime emissions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#f0f4f1] dark:bg-[#121c17] text-[#173f34] dark:text-[#e5a439] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                Secure European Checkout
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Guest checkout with instant confirmation. No card data saved on our servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-[#f0f4f1] dark:bg-[#121c17] text-[#173f34] dark:text-[#e5a439] flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
                EU CE Fitting Standard
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Engineered collar ring fits European standard E26 / E27 bulb sockets and pendant cords.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE SEA CONTAINER STATUS STRIP */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ship className="w-5 h-5 text-[#c68a24]" />
            <h2 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Current European Ocean Container Booking
            </h2>
          </div>
          <Link href="/track" className="text-xs font-semibold text-[#173f34] dark:text-[#e5a439] hover:underline">
            Track My Order Slot →
          </Link>
        </div>

        <ContainerProgressBar container={openContainer} />
      </section>

      {/* 4. BEST SELLERS SECTION (AMAZON-STYLE CARDS WITH PHOTO CROSS-FADE ON HOVER) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-[#c68a24] text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Curated European Favorites</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
              Artisan Best Sellers
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-[#173f34] dark:text-[#e5a439] hover:underline flex items-center gap-1"
          >
            <span>See all {products.length} shades</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. "HOW ORDERING WORKS" (5-STEP DETAILED POOLED SEA CONTAINER WORKFLOW) */}
      <section id="how-it-works" className="bg-white dark:bg-[#16221d] rounded-2xl border border-[#d2dbd4] dark:border-[#273b33] p-8 sm:p-10 shadow-sm scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider">
            Pooled European Sea Freight
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
            How Ordering Works
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
            We bypass expensive air cargo by consolidating European customer orders into full 40-foot ocean shipping containers. Here is how your order journeys from Indian artisans to your room:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {[
            {
              step: '1',
              title: 'Order Online',
              desc: 'Select your preferred handmade bamboo shade on our store with guest checkout and EUR pricing.',
              icon: Package,
            },
            {
              step: '2',
              title: 'Joins Open Container',
              desc: 'Once paid, your order is allocated slots in the currently open European sea shipping container.',
              icon: CheckCircle,
            },
            {
              step: '3',
              title: 'Container Fills',
              desc: 'As pooled orders accumulate, container status reaches full capacity and the booking locks.',
              icon: Ship,
            },
            {
              step: '4',
              title: 'Ocean Sailing',
              desc: 'Container boards vessel at Nhava Sheva Port (India) sailing directly to Rotterdam / Hamburg (EU).',
              icon: Compass,
            },
            {
              step: '5',
              title: 'Home Delivery',
              desc: 'Customs clears at European port, and your parcel dispatches via local courier to your doorstep.',
              icon: Truck,
            },
          ].map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col items-center text-center p-4 rounded-xl bg-[#f7faf8] dark:bg-[#121c17] border border-gray-200 dark:border-gray-800"
              >
                <div className="w-12 h-12 rounded-full bg-[#173f34] text-[#e5a439] flex items-center justify-center font-black text-base mb-3 shadow-md">
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase text-[#c68a24] tracking-wider mb-1">
                  Step {item.step}
                </span>
                <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>

                {index < 4 && (
                  <div className="hidden md:block absolute -right-3 top-10 text-gray-300 dark:text-gray-700 pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Handmade Rule Box */}
        <div className="mt-10 p-5 rounded-xl bg-[#f0f5f2] dark:bg-[#13221b] border-l-4 border-[#c68a24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-[#173f34] dark:text-[#e5a439] uppercase tracking-wide">
              The Indian Handloom Artisan Rule
            </h4>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
              Every piece is woven by hand. Size, weave and colour tone vary slightly. Dimensions are approximate (±2 cm). We use organic seasoned cane without synthetic plastics.
            </p>
          </div>
          <Link
            href="/policies/shipping"
            className="flex-shrink-0 text-xs font-bold text-[#173f34] dark:text-[#e5a439] hover:underline whitespace-nowrap"
          >
            Read Shipping & Transit Policy →
          </Link>
        </div>
      </section>

      {/* 6. ETHICAL ARTISAN SPOTLIGHT & REAL WORKSHOP VIDEO SHOWCASE */}
      <section className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#173f34] to-[#0f2b23] text-white p-8 sm:p-12 shadow-xl border border-[#23594b]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#e5a439] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c68a24]" />
              <span>Real Indian Workshop Footage & Direct Export</span>
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-white">
              Preserving Generational Bamboo Weaving
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              In our artisan workshop in India, seasoned natural bamboo is hand-split, bent, and intricately woven without automated machinery or toxic glues. Each lamp is inspected, packed into protective crating, and staged for direct sea container dispatch to Europe.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-5 py-2.5 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-bold text-xs rounded transition-colors"
              >
                Explore Current Collection
              </Link>
              <Link
                href="/policies/contact"
                className="px-5 py-2.5 bg-transparent hover:bg-white/10 text-white border border-white/20 text-xs rounded transition-colors"
              >
                Trade & Architect Inquiries
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* Real Workshop Video */}
            <div className="relative w-56 sm:w-60 h-80 rounded-xl overflow-hidden shadow-2xl border-2 border-[#c68a24]/50 bg-black">
              <video
                src="/images/artisan-craft-video.mp4"
                controls
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-[#e5a439] text-[10px] font-bold px-2 py-0.5 rounded">
                Live Workshop
              </div>
            </div>

            {/* Real Artisan Photo With Measurements */}
            <div className="relative w-48 sm:w-52 h-64 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 hidden sm:block">
              <Image
                src="/images/four-point-measure.jpg"
                alt="Artisan verifying dimensions with tape measure"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] p-1.5 rounded text-center">
                Hand-measured: approx. 45 cm
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
