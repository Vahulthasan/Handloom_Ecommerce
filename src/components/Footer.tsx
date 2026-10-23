'use client';

import React from 'react';
import Link from 'next/link';
import { Ship, Leaf, ShieldCheck, HeartHandshake, ArrowUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0d1512] text-gray-300 border-t border-[#1a2d24]">
      {/* Back to top banner */}
      <a
        href="#"
        className="block bg-[#173f34] hover:bg-[#1f4f42] text-[#e8ece8] hover:text-[#e5a439] py-3 text-center text-xs font-semibold tracking-wide transition-colors"
      >
        <span className="inline-flex items-center gap-1.5">
          <ArrowUp className="w-3.5 h-3.5" />
          Back to top
        </span>
      </a>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Story */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#c68a24] text-[#0d1512] font-black flex items-center justify-center text-sm">
                VC
              </div>
              <span className="font-heading font-bold text-white text-lg">
                Vintage Collections
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Direct Indian maker-exporter of generational handwoven bamboo pendant lamp shades. Handcrafted by master artisans in Assam & Bengal, pooled into dedicated sea containers, and shipped directly to European homes.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#e5a439]">
              <HeartHandshake className="w-4 h-4 flex-shrink-0" />
              <span>100% Fair-Trade Artisan Collective</span>
            </div>
          </div>

          {/* How Sea Container Pooling Works */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-3 text-[#e5a439]">
              Pooled Sea Freight
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              By consolidating individual European customer orders into full 40ft ocean containers, we eliminate expensive air cargo fees, minimize maritime carbon emissions, and offer true artisan direct prices.
            </p>
            <ul className="text-xs space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Ship className="w-3.5 h-3.5 text-[#c68a24]" />
                <span>Port: Nhava Sheva (IN) ➔ Rotterdam (NL)</span>
              </li>
              <li className="flex items-center gap-2">
                <Leaf className="w-3.5 h-3.5 text-green-500" />
                <span>82% lower CO₂ than international airmail</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c68a24]" />
                <span>Duty & clearance coordinated to your door</span>
              </li>
            </ul>
          </div>

          {/* Quick Links & Customer Care */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-3 text-[#e5a439]">
              Customer Service
            </h3>
            <ul className="text-xs space-y-2.5">
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Your Order & Container Status
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  Browse Full Shade Catalog
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping & Container Timeline Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Returns & Cancellations Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/contact" className="hover:text-white transition-colors">
                  Contact Workshop & Exporter Desk
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-400 hover:text-[#e5a439] transition-colors">
                  Admin & Operations Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm mb-3 text-[#e5a439]">
              Policies & Compliance
            </h3>
            <ul className="text-xs space-y-2.5">
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (GDPR European Compliant)
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms of Service & Sea Freight Pooling
                </Link>
              </li>
              <li>
                <span className="block text-gray-400 mt-2 text-[11px]">
                  <strong>Handmade Notice:</strong> Each piece is individually crafted from natural bamboo cane. Minor nuances in weave density, honey hue, and ±2 cm dimensions celebrate organic handcraft authenticity.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & government approval trust badges */}
        <div className="mt-12 pt-8 border-t border-[#1a2d24] flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#122b22] px-2.5 py-1 rounded border border-[#235345]">
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
              <span className="text-[10px] text-gray-300 font-medium">
                Approved Handloom Exporter • Govt. of Tamil Nadu &amp; Govt. of India
              </span>
            </div>
            <p className="text-[11px]">© 2026 Vintage Collections. IEC: IND-EXP-48201.</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Prices in EUR (€)</span>
            <span>•</span>
            <span>EU CE Fitting Compatible</span>
            <span>•</span>
            <span className="text-[#c68a24]">Sample Demonstration Store</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
