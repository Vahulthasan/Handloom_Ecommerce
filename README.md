# Vintage Collections — Handwoven Bamboo Pendant Lamp Shades
### Indian Maker-Exporter Online Store for European Customers (Amazon-Style Pooled Sea Container Freight)

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-3ecf8e?logo=supabase)](https://supabase.com/)

---

## 🌟 Overview & Architecture

**Vintage Collections** is a sample production-grade direct-to-consumer e-commerce store built for an Indian maker-exporter of artisanal handwoven bamboo pendant lamp shades. Customers across Europe order online with the simplicity, confidence, and speed of Amazon.

Instead of paying exorbitant individual airmail rates or keeping speculative inventory in expensive European warehouses, orders are **pooled into sea shipping containers**:
1. Every paid order is automatically assigned to the currently **open 40ft sea shipping container**.
2. When the container reaches full unit capacity, status switches to `full` and the ocean freight carrier is booked.
3. The vessel departs from **Port Nhava Sheva (INNSA), Mumbai, India** to European hub ports (**Rotterdam / Hamburg**).
4. Local European couriers (DHL, DPD, Chronopost) deliver parcels directly to the customer's doorstep.

---

## 🚀 Quick Start (Running Locally)

The project includes an automatic unified data layer with resilient in-memory/localStorage fallback, so you can run and test the complete storefront immediately without configuring an external database:

```bash
# 1. Clone or open directory
cd handloom_website_sample

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to experience the store.

---

## 🗄️ Supabase Setup & Production Deployment

To connect your own hosted PostgreSQL database with Row Level Security:

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **anon / public API key** from *Settings ➔ API*.

### 2. Run Database Migration & Seed
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Copy and run the schema migration in `supabase/migrations/20261023_init.sql`.
3. Copy and run the seed data script in `supabase/seed.sql`.

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
```

### 4. Deploy to Vercel
1. Push your repository to GitHub.
2. Import the project in [vercel.com](https://vercel.com).
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under *Project Settings ➔ Environment Variables*.
4. Deploy! Next.js App Router will build and deploy automatically.

---

## 📦 Core Storefront Pages & Features

| Page | URL | Features |
|---|---|---|
| **Home** | `/` | Dark evening hero with glowing amber lamps, softly swaying pendant animation, category tiles, trust strip, live container pooling progress, Amazon-style best seller cards, 5-step "How Ordering Works" guide. |
| **Catalog** | `/shop` | Search, shape filters (Round Globe, Four-Point Star, Sphere), approximate size filters (±2 cm rule), price range slider, sort options, container slot efficiency sort. |
| **Product Detail** | `/product/[slug]` | Amazon-style vertical thumbnails, interactive mouse-move zoom lens, finish and size chips, About this item bullet list, sticky buy box, container status delivery note, handmade specifications table, reviews. |
| **Cart** | Drawer & `/cart` | Live quantity stepper, subtotal in EUR, ocean container slot space impact preview, European country shipping selector. |
| **Checkout** | `/checkout` | Guest checkout, European country rate calculator, `PaymentProvider` interface with active `MockPaymentProvider` and clear PayPal / Razorpay tabs. |
| **Confirmation** | `/order-confirmation` | Celebration banner, order reference, live container fill status, shipping breakdown, print receipt button. |
| **Order Tracker** | `/track` | Search by order number & email. Milestone visual timeline: Order Confirmed ➔ Container Allocation ➔ Sea Cargo Sailing ➔ Courier Delivery. |
| **Admin Portal** | `/admin` | Complete container operations desk, mark container shipped (updates all orders inside automatically!), export packing list CSV, manage product stock & pricing, configure European shipping fees. |
| **Policies** | `/policies/*` | Shipping & Container Timeline, Returns & Cancellations, Privacy (GDPR), Terms, Workshop Contact. |

---

## 🪚 The Mandatory Handmade Rule

Every piece in this catalog is hand-split and handwoven by Indian artisans in rural Assam and Bengal:
- **Never display exact dimensions:** Always use `approx. 40 cm (±2 cm)`.
- **Handmade Row on all specifications:** *"Each piece is woven by hand. Size, weave and colour tone vary slightly."*
- **No invented dates, weights, or VAT figures:** Configurable placeholders marked *"to be confirmed"* are utilized until container vessel manifests are finalized.

---

## 📸 Real Photo Asset Architecture

As required, exactly 3 real product photography assets are provided and reused across the 8 placeholder products in `/public/images`:
- `public/images/round-shade.jpg`: Round dome bamboo pendant shade.
- `public/images/hand-held-shade.jpg`: Same round shade held in an artisan's hand demonstrating scale and texture.
- `public/images/four-point-shade.jpg`: Four-point star flared geometric bamboo pendant shade.

---

## 📋 Comprehensive List of TODOs for Production

Before launching live commercial European sales, complete the following integrations:

1. **Real Payment Provider Integration:**
   - [ ] Connect PayPal Orders v2 API in `src/lib/payments/paypal-provider.ts` using `@paypal/checkout-server-sdk`.
   - [ ] Connect Razorpay International multi-currency (EUR) in `src/lib/payments/razorpay-provider.ts` with RBI Export Purpose Code (P0102).
   - [ ] Implement webhook handlers for async payment captures.

2. **Transactional Email Delivery:**
   - [ ] Sign up for [Resend](https://resend.com) or SendGrid.
   - [ ] In `src/lib/email-templates.ts`, swap `sendEmail()` console stub with `resend.emails.send()`.
   - [ ] Verify SPF / DKIM DNS records for `@vintagecollections.in`.

3. **European Customs & VAT / Duties Rules:**
   - [ ] Determine IOSS (Import One-Stop Shop) registration for EU orders under €150.
   - [ ] Establish commercial invoice templates with Harmonized System (HS) Code for Bamboo Lighting (`HS 9405.10.90`).
   - [ ] Finalize port brokerage terms at Port of Rotterdam (NLRTM) and Hamburg (DEHAM).

4. **Legal & Commercial Compliance:**
   - [ ] Have European legal counsel review `policies/terms/page.tsx` and `policies/privacy/page.tsx`.
   - [ ] Certify CE electrical safety compliance certificates for the brass collar fitting rings.

---

## 👨‍💻 Developer Notes

- Built by Amazon Website Developer persona emphasizing conversion ergonomics, container pooling economics, high-contrast typography, and accessible micro-interactions.
- To test the Admin portal immediately, navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
