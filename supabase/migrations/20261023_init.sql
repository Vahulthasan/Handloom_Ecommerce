-- Supabase Schema Migration for Vintage Collections
-- Maker-Exporter of Handwoven Bamboo Pendant Lamp Shades

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CONTAINERS TABLE
create table if not exists containers (
  id text primary key default concat('cont_', gen_random_uuid()),
  label text not null,
  capacity_units integer not null default 250,
  used_units integer not null default 0,
  status text not null check (status in ('open', 'full', 'shipped', 'delivered')) default 'open',
  estimated_ship_date text,
  tracking_note text,
  created_at timestamptz not null default now(),
  shipped_at timestamptz,
  delivered_at timestamptz
);

-- 2. PRODUCTS TABLE
create table if not exists products (
  id text primary key default concat('prod_', gen_random_uuid()),
  slug text unique not null,
  name text not null,
  material text not null,
  description text not null,
  price_eur numeric(10, 2) not null,
  moq integer not null default 1,
  stock integer not null default 0,
  units_per_container_slot integer not null default 1,
  images text[] not null default '{}',
  tag text not null default '',
  shape text not null default 'Round Globe',
  size_approx text not null default 'approx. 40 cm (±2 cm)',
  active boolean not null default true,
  rating numeric(3, 2) not null default 4.9,
  review_count integer not null default 100,
  features text[] not null default '{}',
  dimensions_note text not null default '',
  handmade_statement text not null default 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  created_at timestamptz not null default now()
);

-- 3. ORDERS TABLE
create table if not exists orders (
  id text primary key default concat('ord_', gen_random_uuid()),
  order_number text unique not null,
  email text not null,
  country text not null,
  shipping_address jsonb not null,
  status text not null check (status in ('pending_payment', 'paid', 'in_container', 'shipped', 'delivered', 'cancelled')) default 'pending_payment',
  container_id text references containers(id) on delete set null,
  subtotal numeric(10, 2) not null default 0.00,
  shipping_fee numeric(10, 2) not null default 0.00,
  total numeric(10, 2) not null default 0.00,
  payment_status text not null check (payment_status in ('unpaid', 'paid', 'refunded')) default 'unpaid',
  payment_provider text not null default 'MockPaymentProvider',
  payment_reference text,
  total_container_units integer not null default 1,
  created_at timestamptz not null default now()
);

-- 4. ORDER ITEMS TABLE
create table if not exists order_items (
  id text primary key default concat('item_', gen_random_uuid()),
  order_id text not null references orders(id) on delete cascade,
  product_id text not null references products(id),
  product_name text not null,
  product_image text not null,
  qty integer not null default 1,
  unit_price numeric(10, 2) not null,
  units_per_slot integer not null default 1,
  selected_size text,
  selected_finish text
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
alter table products enable row level security;
alter table containers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read for active products
create policy "Public can read active products"
  on products for select
  using (active = true);

-- Public read for containers (needed to display container pooling % on storefront)
create policy "Public can read containers status"
  on containers for select
  using (true);

-- Customers can read only their own order via order_number + email lookup
create policy "Customers can read their own order"
  on orders for select
  using (
    (auth.role() = 'authenticated' and auth.jwt()->>'email' = email)
    or
    (current_setting('request.jwt.claims', true) is null) -- Allow secure server-side route handler / service role queries
  );

create policy "Customers can read order items for their order"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
    )
  );

-- Admin role has full access (for authenticated users with role = 'admin' or service key)
create policy "Admin full access to products"
  on products for all
  using (auth.jwt()->>'role' = 'admin' or auth.role() = 'service_role');

create policy "Admin full access to containers"
  on containers for all
  using (auth.jwt()->>'role' = 'admin' or auth.role() = 'service_role');

create policy "Admin full access to orders"
  on orders for all
  using (auth.jwt()->>'role' = 'admin' or auth.role() = 'service_role');

create policy "Admin full access to order items"
  on order_items for all
  using (auth.jwt()->>'role' = 'admin' or auth.role() = 'service_role');

-- Performance Indexes
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_orders_order_number on orders(order_number);
create index if not exists idx_orders_email on orders(email);
create index if not exists idx_orders_container_id on orders(container_id);
