import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider block">
          European Privacy Compliance
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
          Privacy Policy (GDPR Notice)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          How customer data is processed solely for European shipping and order fulfillment.
        </p>
      </div>

      <div className="bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          Vintage Collections respects the privacy of customers ordering from Europe. This store operates with guest checkout and collects only the information necessary to fulfill your ocean container reservation and last-mile European delivery.
        </p>

        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            1. Information Collected
          </h2>
          <p>
            We collect: Customer name, email address (for order timeline notifications), delivery postal address, and contact telephone number (provided to local European delivery couriers).
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            2. Payment Data Security
          </h2>
          <p>
            We never store credit card, debit card, or sensitive banking information on our servers. All transactions are securely routed through accredited external payment gateways under PCI-DSS Level 1 compliance.
          </p>
        </section>

        <section className="space-y-1.5">
          <h2 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
            3. Data Sharing for Customs & Logistics
          </h2>
          <p>
            Your shipping details are shared strictly with the maritime carrier for container manifest generation and European customs brokers at Rotterdam/Hamburg for import declaration.
          </p>
        </section>
      </div>
    </div>
  );
}
