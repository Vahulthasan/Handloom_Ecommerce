import React from 'react';
import Link from 'next/link';
import { Ship, Clock, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider">
          Logistics Transparency
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
          Shipping & Pooled Container Timeline
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          How our Indian handloom collective pools ocean containers to provide direct European delivery.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Ship className="w-4 h-4 text-[#c68a24]" />
            <span>1. What is Pooled Sea Container Freight?</span>
          </h2>
          <p>
            Unlike mass-market decor brands that maintain costly European warehouse stock, Vintage Collections operates as a direct Indian maker-exporter. Individual customer orders across European countries are aggregated into a single 40-foot sea shipping container. When the container reaches full unit capacity, the booking is locked and it departs from Nhava Sheva Port, India.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c68a24]" />
            <span>2. Estimated Timeline & Milestones</span>
          </h2>
          <p>
            The overall delivery cycle consists of three phases:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
            <li>
              <strong>Container Pooling (approx. 1 to 3 weeks):</strong> Orders accumulate until the open container reaches 100% capacity. You can track this live in your order dashboard.
            </li>
            <li>
              <strong>Maritime Ocean Transit (approx. 22 to 32 days):</strong> The container vessel departs Nhava Sheva (INNSA) sailing via the Suez maritime route to European hub ports (Rotterdam / Hamburg).
            </li>
            <li>
              <strong>European Customs & Doorstep Delivery (approx. 3 to 7 days):</strong> Customs formalities clear at port, and items are handed to regional European courier partners (DHL, DPD, Chronopost) for final doorstep delivery.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#c68a24]" />
            <span>3. Customs, Duties & VAT Notice</span>
          </h2>
          <p>
            <strong>Status: To be confirmed.</strong> European import VAT and customs handling depend on member state thresholds and courier brokerage fees at port entry. Placeholders are maintained in store settings and finalized prior to vessel docking.
          </p>
        </section>

        {/* Handmade Rule Box */}
        <section className="p-4 bg-[#f4f7f5] dark:bg-[#121c17] rounded-lg border-l-4 border-[#173f34] dark:border-[#c68a24] space-y-1">
          <h3 className="font-bold text-[#173f34] dark:text-[#e5a439]">
            The Mandatory Handmade Craftsmanship Rule
          </h3>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            Every piece is woven by hand. Never assume exact measurements. Dimensions are specified as approx. 40 cm (±2 cm). Size, weave density and colour tone vary slightly across harvest batches.
          </p>
        </section>
      </div>

      <div className="flex justify-between items-center text-xs">
        <Link href="/track" className="font-bold text-[#173f34] dark:text-[#e5a439] hover:underline flex items-center gap-1">
          <span>Track live container schedule</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/policies/returns" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
          View Returns & Cancellations Policy →
        </Link>
      </div>
    </div>
  );
}
