'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrders, getContainers } from '@/lib/data';
import { Order, Container } from '@/types';
import ContainerProgressBar from '@/components/ContainerProgressBar';
import {
  CheckCircle2,
  Ship,
  Calendar,
  MapPin,
  Package,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  const [order, setOrder] = useState<Order | null>(null);
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }
      const allOrders = await getOrders();
      const foundOrder = allOrders.find(
        (o) => o.order_number.toUpperCase() === orderNumber.toUpperCase()
      );

      if (foundOrder) {
        setOrder(foundOrder);
        const allContainers = await getContainers();
        const foundContainer = allContainers.find((c) => c.id === foundOrder.container_id);
        if (foundContainer) setContainer(foundContainer);
      }
      setLoading(false);
    }
    load();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#173f34] border-t-[#c68a24] rounded-full animate-spin" />
        <p className="text-xs text-gray-500 mt-3">Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900 dark:text-white">
          Order Not Found
        </h1>
        <p className="text-xs text-gray-500">
          We could not locate this order. Please verify your order reference number or visit the tracking portal.
        </p>
        <Link
          href="/track"
          className="inline-block px-5 py-2.5 bg-[#173f34] text-white text-xs font-semibold rounded"
        >
          Go to Track Order
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Celebration Banner */}
      <div className="bg-gradient-to-r from-[#173f34] to-[#123129] text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-[#23594b] text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#c68a24] text-[#0d1512] flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-[#e5a439] uppercase tracking-wider">
            Order Confirmed & Payment Received
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-white mt-1">
            Thank you for supporting Indian handloom artisans!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-2 leading-relaxed">
            Your payment is confirmed. Your order has been pooled into our upcoming European ocean sea container schedule.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 border border-[#2b594b] text-gray-200">
            Order Reference: <strong className="text-[#e5a439] font-mono">{order.order_number}</strong>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-black/40 border border-[#2b594b] text-gray-200">
            Confirmation sent to: <strong className="text-white">{order.email}</strong>
          </div>
        </div>
      </div>

      {/* Live Container Assignment Card */}
      {container && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#c68a24]" />
              <span>Assigned Ocean Shipping Container</span>
            </h2>
            <Link
              href={`/track?orderNumber=${order.order_number}&email=${encodeURIComponent(order.email)}`}
              className="text-xs font-semibold text-[#173f34] dark:text-[#e5a439] hover:underline"
            >
              Track live updates →
            </Link>
          </div>

          <ContainerProgressBar container={container} />
        </div>
      )}

      {/* Order Details & Summary Card */}
      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800 gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
              Order #{order.order_number}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Receipt</span>
            </button>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold rounded-full">
              Status: In Open Container
            </span>
          </div>
        </div>

        {/* Delivery Address & Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200 dark:border-gray-800 text-xs">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c68a24]" />
              <span>European Shipping Address</span>
            </h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-0.5 leading-relaxed">
              <p className="font-bold text-gray-900 dark:text-white">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
              </p>
              {order.shipping_address.company_name && (
                <p>{order.shipping_address.company_name}</p>
              )}
              <p>{order.shipping_address.street_address}</p>
              {order.shipping_address.apartment && <p>{order.shipping_address.apartment}</p>}
              <p>
                {order.shipping_address.postal_code} {order.shipping_address.city}
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {order.shipping_address.country}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[#c68a24]" />
              <span>Ocean Shipping Method</span>
            </h4>
            <div className="text-gray-600 dark:text-gray-400 space-y-1">
              <p className="font-medium text-gray-900 dark:text-white">
                Pooled 40ft Sea Cargo (India ➔ European Hub)
              </p>
              <p>
                Port of Departure: <strong>Nhava Sheva (INNSA), India</strong>
              </p>
              <p>
                Estimated Ship Window: <strong>{container?.estimated_ship_date || 'mid-November (to be confirmed)'}</strong>
              </p>
              <p className="text-[11px] text-gray-500">
                Final mile delivery to your door handled by local European courier after customs clearance.
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[11px] mb-4">
            Items in this Shipment
          </h4>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{item.product_name}</p>
                    <p className="text-gray-500 text-[11px]">
                      Qty: {item.qty} • {item.selected_size}
                    </p>
                  </div>
                </div>

                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  €{(item.unit_price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-1.5 text-xs text-right">
            <div className="flex justify-end gap-6 text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <span className="w-20">€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-6 text-gray-600 dark:text-gray-400">
              <span>Pooled Sea Freight:</span>
              <span className="w-20">€{order.shipping_fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-end gap-6 font-bold text-base text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
              <span>Total Paid:</span>
              <span className="w-20 text-[#173f34] dark:text-[#e5a439] font-black">
                €{order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Handmade Disclaimer Note */}
        <div className="p-4 bg-[#f8faf8] dark:bg-[#121c17] rounded-lg border border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 leading-relaxed">
          <strong>Handmade Reminder:</strong> Each piece is woven by hand from natural Indian bamboo cane. Size, weave and colour tone vary slightly (approx. ±2 cm).
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading order confirmation...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
