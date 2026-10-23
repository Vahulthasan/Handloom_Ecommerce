import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider block">
          Legal Agreement
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
          Terms of Service & Ocean Pooling
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Conditions governing purchases, container pooling, and international supply.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            1. Nature of the Service
          </h2>
          <p>
            Vintage Collections operates an export-pooling mechanism where items are ordered directly from Indian artisans and consolidated into sea freight shipping containers. By ordering, you acknowledge that shipping schedules depend on container capacity fulfillment.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            2. The Handmade Variance Principle
          </h2>
          <p>
            Every piece is woven by hand. Dimensions are stated as approximate (±2 cm). Variations in weave pattern and natural bamboo honey tones are inherent to authentic handmade manufacturing.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            3. Demonstration Store Disclosures
          </h2>
          <p>
            This website serves as a live sample demonstration store. Prices, product names, VAT rules, and shipping timelines are placeholders for European trade verification.
          </p>
        </section>
      </div>
    </div>
  );
}
