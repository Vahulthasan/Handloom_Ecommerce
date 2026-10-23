export type ContainerStatus = 'open' | 'full' | 'shipped' | 'delivered';

export interface Container {
  id: string;
  label: string; // e.g. "Container #EU-2026-04"
  capacity_units: number; // e.g. 250 units
  used_units: number;
  status: ContainerStatus;
  estimated_ship_date: string | null; // e.g. "mid-November 2026 (to be confirmed)"
  tracking_note: string | null; // e.g. "Vessel: Maersk Ganges, Port of Origin: Nhava Sheva (INNSA) -> Rotterdam (NLRTM)"
  created_at: string;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  material: string; // "100% Natural Indian Bamboo & Brass Fitting"
  description: string;
  price_eur: number;
  moq: number; // Minimum Order Quantity, default 1
  stock: number;
  units_per_container_slot: number; // How much space one piece takes (e.g. 1, 2)
  images: string[];
  tag: string; // "Artisan Best Seller", "New Arrival", "Amazon's Choice", etc.
  shape: 'Round Globe' | 'Four-Point Star' | 'Flared Cone' | 'Sphere' | 'Flared Bell' | 'Cylinder' | 'Teardrop';
  size_approx: string; // e.g. "approx. 40 cm (±2 cm)"
  active: boolean;
  rating: number; // e.g. 4.9
  review_count: number; // e.g. 184
  features: string[];
  dimensions_note: string;
  handmade_statement: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_container'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  qty: number;
  unit_price: number;
  units_per_slot: number;
  selected_size?: string;
  selected_finish?: string;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company_name?: string;
  street_address: string;
  apartment?: string;
  city: string;
  postal_code: string;
  country: string; // e.g. "Germany", "France", "Netherlands"
  phone: string;
}

export interface Order {
  id: string;
  order_number: string; // e.g. "VC-EU-89241"
  email: string;
  shipping_address: ShippingAddress;
  country: string;
  status: OrderStatus;
  container_id: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  payment_provider: string; // "MockPaymentProvider", "PayPal", "Razorpay"
  payment_reference?: string;
  total_container_units: number;
  created_at: string;
  items: OrderItem[];
}

export interface ShippingCountryRate {
  code: string;
  name: string;
  fee_eur: number;
  estimated_transit_days: string;
  is_allowed: boolean;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  origin_port: string;
  allowed_countries: ShippingCountryRate[];
  default_container_capacity: number;
  estimated_ship_date_fallback: string;
  vat_duty_notice: string;
  handmade_disclaimer: string;
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  error?: string;
}

export interface PaymentProvider {
  name: string;
  processPayment(order: Omit<Order, 'id' | 'created_at' | 'order_number'>): Promise<PaymentResult>;
}
