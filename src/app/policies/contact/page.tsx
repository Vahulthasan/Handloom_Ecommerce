'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'European Order Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-bold text-[#c68a24] uppercase tracking-wider block">
          Artisan Exporter Desk
        </span>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-gray-900 dark:text-white mt-1">
          Contact Workshop & Operations
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Reach our Indian artisan collective and European shipping coordination team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                Message Sent Successfully
              </h3>
              <p className="text-xs text-gray-500">
                Thank you. Our European logistics coordinator will respond to your inquiry within 24 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hannah Schmidt"
                  className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-700 dark:bg-[#121c17] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-700 dark:bg-[#121c17] outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-700 dark:bg-[#121c17] outline-none"
                >
                  <option value="European Order Inquiry">European Order Inquiry</option>
                  <option value="Container Pooling Timeline">Container Pooling Timeline</option>
                  <option value="Architect & Hospitality Bulk Quote">Architect & Hospitality Bulk Quote</option>
                  <option value="Custom Dimensions / Design">Custom Dimensions / Design</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please specify order number or project inquiry..."
                  className="w-full px-3 py-2 border rounded border-gray-300 dark:border-gray-700 dark:bg-[#121c17] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#173f34] hover:bg-[#1f4f42] text-white font-bold rounded flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-3.5 h-3.5 text-[#e5a439]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Card */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#f7faf8] dark:bg-[#16221d] rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-gray-900 dark:text-white">
              Export Workshop Headquarters
            </h3>

            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c68a24] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white">Workshop & Dispatch Facility:</strong>
                  <p>Vintage Collections Handloom Center</p>
                  <p>Sector 18, Nhava Sheva Export Zone</p>
                  <p>Navi Mumbai, MH 400707, India</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#c68a24] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white">Email:</strong>
                  <p>export@vintagecollections.in</p>
                  <p>europe-desk@vintagecollections.in</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#c68a24] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white">Export Desk Phone:</strong>
                  <p>+91 22 2840 9100 (Mon–Fri, 09:00–18:00 IST)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
