import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider block">
          Policy & Guarantee
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
          Returns and Cancellations Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Clear guidelines for order changes, maritime transit protection, and returns.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#c68a24]" />
            <span>1. Cancellations During Open Container Pooling</span>
          </h2>
          <p>
            You may cancel your order for a 100% full refund at any time while the container status remains <code>open</code>. Once the container is marked <code>full</code> and booking documentation is submitted to the ocean carrier, cancellations cannot be processed as cargo manifests are officially locked with Indian customs authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#c68a24]" />
            <span>2. Transit Damage Guarantee</span>
          </h2>
          <p>
            All shipments travel in heavy-duty double-fluted honeycomb crating engineered for sea voyages. In the rare event of transit damage during maritime or courier handling, submit photos within 48 hours of delivery to our customer desk for an immediate replacement or refund.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#c68a24]" />
            <span>3. Handmade Nuance Disclaimer</span>
          </h2>
          <p>
            Because each piece is hand-split and woven by generational artisans without automated industrial molds, minor variations in weave tension, cane hue, and dimensions (approx. ±2 cm) are natural markers of organic handcrafting rather than defects.
          </p>
        </section>
      </div>
    </div>
  );
}
