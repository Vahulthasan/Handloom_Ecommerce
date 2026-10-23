Build a sample online store for "Vintage Collections", an Indian maker-exporter of handwoven bamboo pendant lamp shades. Customers in Europe order online like on Amazon. Orders are pooled: every paid order is added to an open shipping container, and when the container is full it ships.

TECH
- Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.
- Supabase (Postgres + Auth + Row Level Security) for data. Use environment variables for keys. Include a SQL migration file and seed data.
- Access data through a small data layer (lib/data.ts) so the UI never talks to Supabase directly.
- Cart in React context + localStorage. Guest checkout (no account needed). Optional email login to see past orders.
- Prices in EUR. next/image, mobile first, light/dark mode, respect prefers-reduced-motion.

PHOTOS (/public/images)
I have only 3 real photos (round shade, same shade held in a hand, four-point shade). Reuse them across 8 placeholder products. Do not generate other product images.

DATABASE (Supabase)
- products: id, slug, name, material, description, price_eur, moq (default 1), stock, units_per_container_slot (how much container space one piece takes), images[], tag, active
- containers: id, label, capacity_units, status (open, full, shipped, delivered), estimated_ship_date (nullable, set by admin), tracking_note
- orders: id, order_number, email, shipping address fields, country, status (pending_payment, paid, in_container, shipped, delivered, cancelled), container_id, subtotal, shipping_fee, total, payment_status, created_at
- order_items: id, order_id, product_id, qty, unit_price
- Row Level Security: public read for active products; customers can read only their own order via order_number + email; all writes through server actions or route handlers; admin role for admin pages.

STORE PAGES
1. Home: dark evening hero with warm amber glow and softly swaying hanging bamboo shades (use cutout images if provided, otherwise photo cards), headline "Handwoven bamboo pendant shades, delivered to Europe", category tiles overlapping the hero, trust strip (Handwoven in India / Ships by sea container / Secure checkout), best sellers, "How ordering works" with 5 steps: Order, Your order joins the next container, Container fills, Shipping, Delivery.
2. Shop: grid, search, sort, filter by shape and size.
3. Product detail (Amazon-style): vertical thumbnails with hover switch and mouse-move zoom, title, tag, price, size and finish chips, About this item, sticky buy box with quantity, Add to cart, Buy now, delivery note ("Ships when the container is full. Estimated ship date: [from current open container, or 'to be announced']"), specifications table, More from this range.
4. Cart (drawer + page): quantities, subtotal, shipping estimate, proceed to checkout.
5. Checkout: contact, shipping address (country dropdown limited to a configurable list of EU countries), order summary, payment step through a PaymentProvider interface. Implement a MockPaymentProvider now (marks order as paid) and leave clear TODOs for PayPal and Razorpay International. Do not store card data.
6. Order confirmation + Track order page (order number + email): show status timeline and "Your order is in Container #X (NN% full)".
7. Policies pages with placeholder text: Shipping and container timeline, Returns and cancellations, Privacy, Terms, Contact.

CONTAINER LOGIC
- When an order is marked paid, add its items to the currently open container (sum of qty * units_per_container_slot). If it overflows, split across the next container or open a new one (keep logic simple and commented).
- When used units reach capacity, set status = full and notify admin. Show a progress bar per container in admin and a gentle "Container NN% full" note on the storefront.

ADMIN (/admin, Supabase Auth + admin role)
- Orders list with filters and status updates.
- Containers: current fill %, list of orders inside, buttons "Mark shipped" (with tracking note and date) and "Mark delivered". Marking shipped updates all its orders.
- Products: add/edit price, stock, units_per_container_slot, active, images.
- Settings: shipping fee table per country, allowed countries, estimated ship date text.
- CSV export of orders for a container (packing list).

EMAILS
Create email templates and a sendEmail() stub (order confirmation, container shipped, delivered). Use Resend later; log to console for now.

HANDMADE RULE (important)
Every piece is handmade. Never show exact measurements. Use "approx. 40 cm (±2 cm)" and a Handmade row: "Each piece is woven by hand. Size, weave and colour tone vary slightly." Do not invent weights, VAT or duty rules, delivery dates, or container capacities. Use configurable placeholders in admin settings and mark them "to be confirmed".

DESIGN
- Fonts: Bricolage Grotesque headings, Figtree body.
- CSS variables: brand forest green #173f34, amber/gold accent #c68a24, page background #e8ece8, white cards, hero #0d1512, with dark-mode values.
- Amazon-style product card hover: second-angle photo cross-fade, lift, brand border. Add to cart updates header badge with a toast.
- Visible focus rings, good contrast, alt text, top banner "Sample store. Prices, names and policies are placeholders."

DELIVERABLE
A project that runs with npm run dev using Supabase, a README with setup steps (create Supabase project, run migration, seed, env vars, Vercel deploy), and a list of TODOs: real payment provider, email provider, VAT/customs rules, legal pages.
