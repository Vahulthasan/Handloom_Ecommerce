import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import AuthMascotForm from '@/components/AuthMascotForm';
import { ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sign In & Register | Vintage Collections - Handmade Bamboo Shades',
  description:
    'Sign in or register to manage your handmade bamboo pendant orders, track EU shipments, and request custom dimensions.',
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-8 sm:py-12">
      <div className="w-[min(100%-2rem,1240px)] mx-auto min-w-0">
        {/* Split Layout on >= 1024px, Single Centered Column on < 1024px */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Brand Showcase (1024px+) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-between rounded-3xl bg-gradient-to-br from-[#122e25] via-[#173f34] to-[#0c1f19] p-8 xl:p-10 text-white shadow-2xl border border-[#255b4c] relative overflow-hidden min-h-[640px]">
            {/* Ambient Background Lamp Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c68a24]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#1f5243]/30 rounded-full blur-2xl pointer-events-none" />

            {/* Top Brand Pill & Title */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#c68a24]/20 text-[#f5bc5c] border border-[#c68a24]/40">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vintage Collections • Direct EU Export</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight font-[family-name:var(--font-heading)] leading-tight">
                Handmade Bamboo Shades, Shipped Direct to Europe.
              </h2>

              <p className="text-sm xl:text-base text-gray-200 font-normal leading-relaxed">
                Connect with our artisan cooperative in Tamil Nadu. Every pendant lamp is hand-woven with sustainable
                mature bamboo, engineered for EU electrical fittings, and cleared through DDP customs.
              </p>
            </div>

            {/* Center Image Showcase */}
            <div className="relative z-10 my-6 rounded-2xl overflow-hidden border border-[#2d6c5b] shadow-2xl group">
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src="/images/bamboo-bell-pendant.jpg"
                  alt="Handmade Bamboo Bell Pendant Lamp in Ambient Interior"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 500px, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-4">
                  <div className="text-xs">
                    <span className="font-bold text-[#f5bc5c] tracking-wide uppercase text-[10px] block">
                      Featured Lamp
                    </span>
                    <span className="text-white font-medium">Bamboo Bell Woven Pendant • 3-Point Diffused Warmth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 3 Trust Pillars */}
            <div className="relative z-10 grid grid-cols-3 gap-3 pt-4 border-t border-[#255b4c]">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#e5a439] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight text-gray-300">
                  <strong className="text-white block font-semibold">CE &amp; EU Ready</strong>
                  Low-voltage compliant
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#e5a439] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight text-gray-300">
                  <strong className="text-white block font-semibold">DDP Cleared</strong>
                  Zero customs friction
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e5a439] flex-shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight text-gray-300">
                  <strong className="text-white block font-semibold">Fair Wage</strong>
                  Generational artisans
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mascot Auth Card (All Viewports) */}
          <div className="lg:col-span-6 flex items-center justify-center w-full">
            <AuthMascotForm initialTab="login" onSuccessRedirect="/shop" />
          </div>
        </div>
      </div>
    </div>
  );
}
