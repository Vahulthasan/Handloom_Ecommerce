'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { getSettings, createOrder, getOpenContainer } from '@/lib/data';
import { StoreSettings, Container, ShippingAddress } from '@/types';
import { MockPaymentProvider } from '@/lib/payments/mock-provider';
import {
  Lock,
  ShieldCheck,
  Ship,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalContainerUnits, clearCart } = useCart();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [openContainer, setOpenContainer] = useState<Container | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [countryCode, setCountryCode] = useState('DE');
  const [phone, setPhone] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'mock' | 'paypal' | 'razorpay'>('mock');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getSettings().then(setSettings);
    getOpenContainer().then(setOpenContainer);
  }, []);

  const selectedCountry =
    settings?.allowed_countries.find((c) => c.code === countryCode) ||
    settings?.allowed_countries[0];

  const shippingFee = selectedCountry?.fee_eur || 14.5;
  const grandTotal = subtotal + shippingFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!email || !firstName || !lastName || !streetAddress || !city || !postalCode) {
      setErrorMessage('Please fill in all mandatory European delivery address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      const shippingAddress: ShippingAddress = {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        street_address: streetAddress,
        apartment,
        city,
        postal_code: postalCode,
        country: selectedCountry?.name || 'Germany',
        phone,
      };

      if (paymentMethod === 'mock') {
        const provider = new MockPaymentProvider();
        const paymentResult = await provider.processPayment({
          email,
          shipping_address: shippingAddress,
          country: shippingAddress.country,
          status: 'pending_payment',
          container_id: null,
          subtotal,
          shipping_fee: shippingFee,
          total: grandTotal,
          payment_status: 'paid',
          payment_provider: provider.name,
          total_container_units: totalContainerUnits,
          items: items.map((i) => ({
            id: i.id,
            order_id: '',
            product_id: i.product_id,
            product_name: i.product_name,
            product_image: i.product_image,
            qty: i.qty,
            unit_price: i.unit_price,
            units_per_slot: i.units_per_slot,
            selected_size: i.selected_size,
            selected_finish: i.selected_finish,
          })),
        });

        if (paymentResult.success) {
          const newOrder = await createOrder({
            email,
            shipping_address: shippingAddress,
            country: shippingAddress.country,
            subtotal,
            shipping_fee: shippingFee,
            total: grandTotal,
            payment_status: 'paid',
            payment_provider: provider.name,
            payment_reference: paymentResult.transaction_id,
            total_container_units: totalContainerUnits,
            items: items.map((i) => ({
              id: i.id,
              order_id: '',
              product_id: i.product_id,
              product_name: i.product_name,
              product_image: i.product_image,
              qty: i.qty,
              unit_price: i.unit_price,
              units_per_slot: i.units_per_slot,
              selected_size: i.selected_size,
              selected_finish: i.selected_finish,
            })),
          });

          clearCart();
          router.push(`/order-confirmation?orderNumber=${newOrder.order_number}`);
        } else {
          setErrorMessage(paymentResult.error || 'Payment processing failed.');
        }
      } else if (paymentMethod === 'paypal') {
        setErrorMessage(
          'PayPal Express Checkout requires production API credentials. Please switch to Instant Test Payment to complete demonstration order.'
        );
      } else if (paymentMethod === 'razorpay') {
        setErrorMessage(
          'Razorpay International requires live API credentials. Please switch to Instant Test Payment to complete demonstration order.'
        );
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      setErrorMessage('An unexpected error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4">
        <h1 className="font-heading font-extrabold text-2xl text-gray-900 dark:text-white">
          No Items in Cart
        </h1>
        <p className="text-xs text-gray-500">
          Your basket is empty. Please add a handwoven bamboo pendant lamp shade to proceed to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-[#173f34] text-white text-xs font-semibold rounded"
        >
          Browse Shades
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Checkout Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider">
            Secure European Checkout
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-gray-900 dark:text-white">
            Guest Checkout & Sea Freight Allocation
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted • Direct Exporter Protocol</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Contact, Shipping, Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Info */}
            <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#173f34] text-[#e5a439] text-xs flex items-center justify-center font-bold">1</span>
                  <span>Contact Information (Guest Checkout)</span>
                </h2>
                <span className="text-[11px] text-gray-400">No password required</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Email Address (for order & container ship updates) *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hannah.schmidt@berlin-design.de"
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none focus:ring-1 focus:ring-[#c68a24]"
                />
              </div>
            </div>

            {/* 2. European Shipping Address */}
            <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173f34] text-[#e5a439] text-xs flex items-center justify-center font-bold">2</span>
                <span>European Delivery Address</span>
              </h2>

              {/* Country Selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Destination Country (Configured European Delivery List) *
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] font-medium outline-none focus:ring-1 focus:ring-[#c68a24]"
                >
                  {settings?.allowed_countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} — €{c.fee_eur.toFixed(2)} ({c.estimated_transit_days})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Hannah"
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Schmidt"
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Studio or Architectural Practice"
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Kastanienallee 42"
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Apartment / Suite
                  </label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10119"
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Berlin"
                    className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Phone (for European courier notification)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 30 1234567"
                  className="w-full px-3 py-2 text-xs rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121c17] outline-none"
                />
              </div>
            </div>

            {/* 3. Payment Method Step (PaymentProvider Architecture) */}
            <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
              <h2 className="font-heading font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#173f34] text-[#e5a439] text-xs flex items-center justify-center font-bold">3</span>
                <span>Payment Step (Mock Provider Active)</span>
              </h2>

              <p className="text-xs text-gray-500">
                Processed through a secure <code>PaymentProvider</code> interface. No sensitive card data is ever stored on this server.
              </p>

              <div className="space-y-3">
                {/* Mock Provider (Default Active) */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'mock'
                      ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f4f7f5] dark:bg-[#14261f] ring-1 ring-[#173f34]'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentMethod === 'mock'}
                    onChange={() => setPaymentMethod('mock')}
                    className="mt-1 accent-[#173f34]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Instant Test Payment (Mock Payment Provider)
                      </span>
                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Simulated & Ready
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Simulates immediate approved payment in EUR. Adds your items to the open sea container and generates confirmation.
                    </p>
                  </div>
                </label>

                {/* PayPal Stub */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f4f7f5] dark:bg-[#14261f]'
                      : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="mt-1 accent-[#173f34]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        PayPal European Express
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        TODO: Live Credentials
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Stubbed with TODOs in <code>lib/payments/paypal-provider.ts</code>.
                    </p>
                  </div>
                </label>

                {/* Razorpay International Stub */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#173f34] dark:border-[#c68a24] bg-[#f4f7f5] dark:bg-[#14261f]'
                      : 'border-gray-200 dark:border-gray-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-[#173f34]"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">
                        Razorpay International (Cards / iDEAL / Sofort / Bancontact)
                      </span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        TODO: Live Credentials
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Stubbed with TODOs in <code>lib/payments/razorpay-provider.ts</code>.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-[#c68a24] hover:bg-[#e5a439] text-[#0d1512] font-black text-base rounded-md shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              <span>
                {isProcessing
                  ? 'Reserving Ocean Slot & Processing...'
                  : `Complete Order & Reserve Slot • €${grandTotal.toFixed(2)}`}
              </span>
            </button>
          </div>

          {/* Right Column: Order Summary & Container Impact (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-gray-900 dark:text-white pb-3 border-b border-gray-200 dark:border-gray-800">
                Order Summary ({items.length} product{items.length !== 1 ? 's' : ''})
              </h3>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.product_name}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        Qty: {item.qty} • {item.selected_size}
                      </p>
                    </div>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      €{(item.unit_price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Pooled Sea Freight ({selectedCountry?.name}):</span>
                  <span>€{shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Import VAT / Customs Notice:</span>
                  <span className="text-gray-500 italic">to be confirmed</span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-baseline font-bold text-base">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="font-heading font-black text-2xl text-[#173f34] dark:text-[#e5a439]">
                    €{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Current Open Container Preview */}
              {openContainer && (
                <div className="p-3 bg-[#f0f5f2] dark:bg-[#13221b] rounded-lg border border-[#d2dbd4] dark:border-[#273b33] text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#173f34] dark:text-[#e5a439]">
                    <Ship className="w-3.5 h-3.5" />
                    <span>Assigned to: {openContainer.label}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your items reserve <strong>{totalContainerUnits} unit{totalContainerUnits !== 1 ? 's' : ''}</strong> out of {openContainer.capacity_units} container capacity.
                  </p>
                </div>
              )}

              {/* Handmade Rule Reminder */}
              <div className="p-3 bg-gray-50 dark:bg-[#121c17] rounded border border-gray-200 dark:border-gray-800 text-[11px] text-gray-500 space-y-1">
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  Handmade Craftsmanship Notice:
                </span>
                <p>
                  Each piece is individually woven by hand from natural Indian bamboo cane. Size, weave and colour tone vary slightly (approx. ±2 cm).
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
