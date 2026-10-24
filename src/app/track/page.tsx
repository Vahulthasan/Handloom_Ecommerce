'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getOrderByNumberAndEmail, getContainers } from '@/lib/data';
import { Order, Container } from '@/types';
import ContainerProgressBar from '@/components/ContainerProgressBar';
import {
  Search,
  Ship,
  CheckCircle2,
  Clock,
  Truck,
  Anchor,
  Calendar,
  AlertCircle,
  Package,
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get('orderNumber') || '';
  const initialEmail = searchParams.get('email') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState(initialEmail);
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [container, setContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLookup = async (lookupNumber: string, lookupEmail: string) => {
    if (!lookupNumber.trim() || !lookupEmail.trim()) {
      setError('Please enter both your Order Number and Email Address.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const foundOrder = await getOrderByNumberAndEmail(lookupNumber, lookupEmail);
      if (foundOrder) {
        setOrder(foundOrder);
        const containers = await getContainers();
        const foundContainer = containers.find((c) => c.id === foundOrder.container_id);
        setContainer(foundContainer || null);
      } else {
        setOrder(null);
        setContainer(null);
        setError('No order found matching this order number and email combination. Please check your spelling or sample order number (e.g. VC-EU-89241).');
      }
    } catch (e) {
      console.error(e);
      setError('Failed to look up order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialEmail) {
      executeLookup(initialOrderNumber, initialEmail);
    }
  }, [initialOrderNumber, initialEmail]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(orderNumber, email);
  };

  // Determine active timeline steps
  const timelineSteps = [
    {
      title: 'Order Paid & Confirmed',
      desc: 'Guest checkout completed with European pooled freight allocation.',
      isDone: true,
      isActive: order?.status === 'paid',
    },
    {
      title: `Assigned to ${container?.label || 'Ocean Container'}`,
      desc: container
        ? `${Math.round((container.used_units / container.capacity_units) * 100)}% filled with pooled European orders.`
        : 'Awaiting container slot assignment.',
      isDone: order?.status !== 'pending_payment',
      isActive: order?.status === 'in_container',
    },
    {
      title: 'Container Full & Ocean Departure',
      desc: container?.tracking_note || 'Scheduled from Port Nhava Sheva (INNSA) to European Port.',
      isDone: order?.status === 'shipped' || order?.status === 'delivered',
      isActive: order?.status === 'shipped',
    },
    {
      title: 'Customs Clearance & Final Delivery',
      desc: `Dispatched to ${order?.shipping_address.city || 'your destination'} via local European courier.`,
      isDone: order?.status === 'delivered',
      isActive: order?.status === 'delivered',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider">
          Live European Sea Freight Tracker
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-gray-900 dark:text-white">
          Track Your Container & Order Status
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Enter your order reference number and email to see real-time ocean container fill percentage, vessel notes, and delivery timeline.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Order Number (e.g. VC-EU-89241)
            </label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="VC-EU-89241"
              className="w-full min-h-[44px] h-11 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none font-mono focus:ring-1 focus:ring-[#c68a24]"
            />
          </div>

          <div className="md:col-span-5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hannah.schmidt@berlin-design.de"
              className="w-full min-h-[44px] h-11 px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none focus:ring-1 focus:ring-[#c68a24]"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] h-11 py-2.5 px-4 bg-[#173f34] hover:bg-[#1f4f42] text-white text-xs font-bold rounded shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-[#e5a439]" />
              <span>{loading ? 'Finding...' : 'Track'}</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Reference Link */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 flex flex-wrap items-center gap-2">
          <span>Try sample order:</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('VC-EU-89241');
              setEmail('hannah.schmidt@berlin-design.de');
              executeLookup('VC-EU-89241', 'hannah.schmidt@berlin-design.de');
            }}
            className="text-[#173f34] dark:text-[#e5a439] font-mono font-bold hover:underline"
          >
            VC-EU-89241 (Germany)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setOrderNumber('VC-EU-89288');
              setEmail('julien.moreau@atelier-paris.fr');
              executeLookup('VC-EU-89288', 'julien.moreau@atelier-paris.fr');
            }}
            className="text-[#173f34] dark:text-[#e5a439] font-mono font-bold hover:underline"
          >
            VC-EU-89288 (France)
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Lookup Results Display */}
      {order && (
        <div className="space-y-6 animate-fade-in">
          {/* Header Card */}
          <div className="bg-[#173f34] text-white rounded-xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-[#e5a439]">
                  #{order.order_number}
                </span>
                <span className="text-xs uppercase px-2 py-0.5 rounded-full bg-[#123129] text-gray-200 border border-[#2b594b] font-bold">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Destination: {order.shipping_address.city}, {order.shipping_address.country}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-gray-300">Total Order Value</span>
              <p className="font-heading font-black text-2xl text-[#e5a439]">
                €{order.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Container Fill Progress Bar */}
          {container && (
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Ship className="w-4 h-4 text-[#c68a24]" />
                <span>
                  Your order is in <strong>{container.label}</strong> (
                  {Math.round((container.used_units / container.capacity_units) * 100)}% full)
                </span>
              </h3>
              <ContainerProgressBar container={container} />
            </div>
          )}

          {/* Vertical Milestone Timeline */}
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white">
              Shipment Progress & Sea Freight Milestones
            </h3>

            <div className="relative border-l-2 border-[#173f34] dark:border-[#c68a24] ml-4 pl-6 space-y-8">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Step dot */}
                  <div
                    className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      step.isDone
                        ? 'bg-[#173f34] border-[#173f34] text-[#e5a439]'
                        : 'bg-white dark:bg-[#16221d] border-gray-300 text-gray-300'
                    }`}
                  >
                    {step.isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        step.isDone
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Container Tracking Note Callout */}
            {container?.tracking_note && (
              <div className="p-4 bg-[#f4f7f5] dark:bg-[#121c17] rounded-lg border border-[#d2dbd4] dark:border-[#273b33] text-xs space-y-1">
                <span className="font-bold text-[#173f34] dark:text-[#e5a439] flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5" />
                  Maritime Logistics & Vessel Update:
                </span>
                <p className="text-gray-700 dark:text-gray-300">{container.tracking_note}</p>
              </div>
            )}
          </div>

          {/* Items in this Order */}
          <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
              Items in Shipment
            </h3>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
