'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { CheckCircle2, X, ShoppingBag } from 'lucide-react';

export default function ToastNotification() {
  const { toast, dismissToast, openDrawer } = useCart();

  if (!toast) return null;

  return (
    <aside
      aria-label="Notification"
      className="fixed bottom-6 right-6 z-50 max-w-sm bg-white dark:bg-[#16221d] border-2 border-[#173f34] dark:border-[#c68a24] rounded-lg shadow-2xl p-4 flex gap-3 items-start animate-fade-in"
    >
      {toast.image ? (
        <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 border border-gray-200">
          <Image src={toast.image} alt="Cart item preview" fill className="object-cover" />
        </div>
      ) : (
        <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#173f34] dark:text-[#e5a439] uppercase tracking-wide">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          <span>{toast.title}</span>
        </div>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
          {toast.message}
        </p>
        <button
          onClick={openDrawer}
          className="mt-2 text-xs font-bold text-[#173f34] dark:text-[#c68a24] hover:underline flex items-center gap-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>View Cart & Reserved Container Slot</span>
        </button>
      </div>

      <button
        onClick={dismissToast}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
}
