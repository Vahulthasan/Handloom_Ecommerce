import { Product, Container, Order, StoreSettings } from '@/types';
import { supabase, isSupabaseConfigured } from './supabase';
import { allocateOrderToContainer } from './container-logic';
import { generateOrderConfirmationEmail, generateContainerShippedEmail, generateOrderDeliveredEmail, sendEmail } from './email-templates';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    slug: 'kashi-round-dome-pendant',
    name: 'The Kashi Round Dome Handwoven Bamboo Pendant Shade',
    material: '100% Seasoned Indian Bamboo & Hand-Turned Brass Fitting',
    description: 'An architectural dome woven from fine slivers of matured Indian bamboo. The radial criss-cross lattice creates soft amber light patterns and a warm, atmospheric ambient glow in living rooms and over dining tables.',
    price_eur: 89.0,
    moq: 1,
    stock: 24,
    units_per_container_slot: 1,
    images: [
      '/images/round-shade.jpg',
      '/images/round-shade-side.jpg',
      '/images/round-shade-workshop.jpg',
      '/images/hand-held-shade.jpg',
    ],
    tag: "Amazon's Choice / Artisan Best Seller",
    shape: 'Round Globe',
    size_approx: 'approx. 40 cm (±2 cm)',
    active: true,
    rating: 4.9,
    review_count: 248,
    features: [
      'Hand-split bamboo cane selected for flexibility and warm honey tone',
      'Naturally heat-bent framework ensures structural integrity without chemical binders',
      'Compatible with standard European E26 / E27 lamp holders (bulb and cord not included)',
      'Optimized lightweight profile for pooled ocean freight container shipping',
    ],
    dimensions_note: 'Diameter: approx. 40 cm (±2 cm), Height: approx. 38 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_2',
    slug: 'surya-four-point-geometric-shade',
    name: 'The Surya Four-Point Star Geometric Bamboo Pendant Shade',
    material: 'Hand-Splinted Natural Indian Bamboo Cane',
    description: 'A striking four-wing geometric silhouette hand-shaped by generational weavers. The four flared outer points create dynamic chiaroscuro light projections across ceilings and surrounding walls.',
    price_eur: 115.0,
    moq: 1,
    stock: 18,
    units_per_container_slot: 2,
    images: [
      '/images/four-point-shade.jpg',
      '/images/four-point-held.jpg',
      '/images/four-point-measure.jpg',
      '/images/four-point-stack.jpg',
      '/images/four-point-depth.jpg',
    ],
    tag: 'Artisan Architectural Spotlight',
    shape: 'Four-Point Star',
    size_approx: 'approx. 45 cm (±2 cm)',
    active: true,
    rating: 4.8,
    review_count: 172,
    features: [
      'Intricate quad-petal contour inspired by traditional temple lotus motifs',
      'Double-ply woven ribs for superior geometry retention during sea transit',
      'Filtered ambient illumination with downward focused task lighting',
      'Treated with organic vegetable oils for gentle humidity resistance in European climates',
    ],
    dimensions_note: 'Width point-to-point: approx. 45 cm (±2 cm), Height: approx. 35 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_3',
    slug: 'ananta-artisan-held-globe',
    name: 'The Ananta Handwoven Sphere Globe Bamboo Pendant',
    material: 'Wild-Harvested Indian River-Bank Bamboo',
    description: 'Crafted with exceptionally tight lattice strips into an orb sphere silhouette. Perfectly sized for kitchen islands, reading nooks, or clustered in groups of three over long dining credenzas.',
    price_eur: 79.0,
    moq: 1,
    stock: 30,
    units_per_container_slot: 1,
    images: [
      '/images/bamboo-globe-sphere.jpg',
      '/images/bamboo-globe-angle2.jpg',
    ],
    tag: 'Top Rated in Europe',
    shape: 'Sphere',
    size_approx: 'approx. 35 cm (±2 cm)',
    active: true,
    rating: 5.0,
    review_count: 96,
    features: [
      'Dense micro-weave spherical orb designed to diffuse direct LED glare while maintaining lumen efficiency',
      'Harmonious Japanese-Scandinavian aesthetic blending warmth and minimalist lines',
      'Organic smoke-finished bamboo with subtle golden-bronze undertones',
      'Zero plastic and biodegradable organic craftsmanship',
    ],
    dimensions_note: 'Diameter: approx. 35 cm (±2 cm), Height: approx. 33 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_4',
    slug: 'dhara-statement-quad-pendant',
    name: 'The Dhara Sculptural Undulating Wavy Saucer Bamboo Shade',
    material: 'Natural Giant Golden Bamboo (Bambusa tulda)',
    description: 'An architectural wide-brim saucer piece engineered for grand dining tables, boutique European cafes, and open loft spaces. The organic wavy perimeter catches ambient daylight and transforms at dusk into a radiant golden beacon.',
    price_eur: 129.0,
    moq: 1,
    stock: 12,
    units_per_container_slot: 2,
    images: [
      '/images/bamboo-saucer-wavy.jpg',
      '/images/bamboo-saucer-angle2.jpg',
    ],
    tag: 'Architectural Statement',
    shape: 'Flared Bell',
    size_approx: 'approx. 50 cm (±2 cm)',
    active: true,
    rating: 4.9,
    review_count: 83,
    features: [
      'Expansive 50 cm undulating saucer rim with delicate curved waves woven by master artisans',
      'Dual-layer central chamber that securely anchors standard European pendant cables',
      'High container efficiency flat-pack nesting capability for ocean cargo',
      'Ships in reinforced honeycomb recycled cardboard protective crating',
    ],
    dimensions_note: 'Width: approx. 50 cm (±2 cm), Height: approx. 32 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_5',
    slug: 'mandala-natural-sphere-shade',
    name: 'The Mandala Bell Contour Handwoven Bamboo Shade',
    material: 'Hand-Planed Indian Cane & Solid Brass Collars',
    description: 'A harmonious flared bell shade designed to cast concentric halo patterns down over tables. Its balanced curved rim and open downward aperture make it an effortless centerpiece in dining spaces.',
    price_eur: 92.0,
    moq: 1,
    stock: 20,
    units_per_container_slot: 1,
    images: [
      '/images/bamboo-bell-pendant.jpg',
      '/images/bamboo-bell-angle2.jpg',
    ],
    tag: 'Amazon Bestseller in Lighting',
    shape: 'Flared Bell',
    size_approx: 'approx. 40 cm (±2 cm)',
    active: true,
    rating: 4.7,
    review_count: 142,
    features: [
      'Balanced bell geometry hand-calibrated by eye without rigid molds',
      'Open bottom aperture for hassle-free bulb replacement',
      'Warm natural patina that gently enriches over years of light exposure',
      'Sustainably gathered from regenerative village plantations in Assam',
    ],
    dimensions_note: 'Diameter: approx. 40 cm (±2 cm), Height: approx. 39 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_6',
    slug: 'nakshatra-four-wing-pendant',
    name: 'The Nakshatra Cylindrical Lattice Bamboo Lantern',
    material: 'Fine Split Bamboo & Brass Mounting Collar',
    description: 'A vertical cylindrical lantern silhouette featuring airy geometric bamboo slats. Perfectly designed for pendant clusters and modern atmospheric hallway illumination.',
    price_eur: 108.0,
    moq: 1,
    stock: 15,
    units_per_container_slot: 2,
    images: [
      '/images/bamboo-cylinder-lantern.jpg',
      '/images/bamboo-cylinder-angle2.jpg',
    ],
    tag: 'Limited Artisan Batch',
    shape: 'Cylinder',
    size_approx: 'approx. 42 cm (±2 cm)',
    active: true,
    rating: 4.8,
    review_count: 67,
    features: [
      'Vertical open-slat lattice providing generous luminous projection',
      'Warm amber radiance ideal for dining table and lounge mood lighting',
      'Hand-finished edge binding with natural cotton twine',
      'Pre-fitted with European CE standard mounting bracket ring',
    ],
    dimensions_note: 'Width: approx. 42 cm (±2 cm), Height: approx. 34 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_7',
    slug: 'prana-open-lattice-globe',
    name: 'The Prana Organic Teardrop Bamboo Lamp Shade',
    material: 'Natural Flexible Hill Bamboo',
    description: 'A delicate organic pear/teardrop shaped pendant shade woven from fine natural hill bamboo. Combines soft curves with rich criss-cross texture to enrich Scandinavian and Mediterranean interiors.',
    price_eur: 84.0,
    moq: 1,
    stock: 28,
    units_per_container_slot: 1,
    images: [
      '/images/bamboo-teardrop-shade.jpg',
      '/images/bamboo-teardrop-angle2.jpg',
    ],
    tag: 'Popular for Dining Spaces',
    shape: 'Teardrop',
    size_approx: 'approx. 38 cm (±2 cm)',
    active: true,
    rating: 4.9,
    review_count: 115,
    features: [
      'Graceful teardrop profile provides focused warm light',
      'Ultra-lightweight yet sturdy natural tensile strength',
      'Blends seamlessly with Japandi, Bohemian, and Modern Rustic decor',
      'Directly supports women craft collectives in rural Bengal',
    ],
    dimensions_note: 'Diameter: approx. 38 cm (±2 cm), Height: approx. 36 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
  {
    id: 'prod_8',
    slug: 'samudra-flared-star-pendant',
    name: 'The Samudra Multi-Tier Flared Lotus Bamboo Shade',
    material: 'Indian Golden Bamboo with Wax Seal Coating',
    description: 'An architectural multi-tiered lotus blossom silhouette. Individual curved bamboo petals radiate outward to create stunning dimensional warmth and shadow play across European ceilings.',
    price_eur: 119.0,
    moq: 1,
    stock: 14,
    units_per_container_slot: 2,
    images: [
      '/images/bamboo-lotus-flared.jpg',
      '/images/bamboo-lotus-angle2.jpg',
    ],
    tag: 'Architect Choice',
    shape: 'Four-Point Star',
    size_approx: 'approx. 46 cm (±2 cm)',
    active: true,
    rating: 4.8,
    review_count: 88,
    features: [
      'Curved four-petal aerodynamic silhouette',
      'Enhanced depth weave with alternating light and deep bamboo cane tones',
      'Specially designed for ambient dimmable smart bulbs (e.g. Philips Hue / IKEA Tradfri)',
      '100% natural, ethical, fair-trade certified Indian maker-exporter origin',
    ],
    dimensions_note: 'Width: approx. 46 cm (±2 cm), Height: approx. 38 cm (±2 cm)',
    handmade_statement: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  },
];

export const INITIAL_CONTAINERS: Container[] = [
  {
    id: 'cont_active_01',
    label: 'Container #EU-2026-04',
    capacity_units: 250,
    used_units: 172, // ~68% full!
    status: 'open',
    estimated_ship_date: 'mid-November (to be confirmed)',
    tracking_note: 'Open for European orders. Staging at Nhava Sheva Port, India (INNSA ➔ NLRTM)',
    created_at: '2026-10-01T10:00:00Z',
    shipped_at: null,
    delivered_at: null,
  },
  {
    id: 'cont_prev_01',
    label: 'Container #EU-2026-03',
    capacity_units: 250,
    used_units: 250,
    status: 'shipped',
    estimated_ship_date: '2026-10-15',
    tracking_note: 'Vessel: CMA CGM Ganga. Arrived in Mediterranean, expected at Rotterdam Hub Port on Nov 02.',
    created_at: '2026-09-01T10:00:00Z',
    shipped_at: '2026-10-15T08:00:00Z',
    delivered_at: null,
  },
  {
    id: 'cont_prev_00',
    label: 'Container #EU-2026-02',
    capacity_units: 200,
    used_units: 200,
    status: 'delivered',
    estimated_ship_date: '2026-08-20',
    tracking_note: 'Completed European distribution via DHL Freight & DPD.',
    created_at: '2026-07-15T10:00:00Z',
    shipped_at: '2026-08-20T08:00:00Z',
    delivered_at: '2026-09-28T14:30:00Z',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    order_number: 'VC-EU-89241',
    email: 'hannah.schmidt@berlin-design.de',
    country: 'Germany',
    shipping_address: {
      first_name: 'Hannah',
      last_name: 'Schmidt',
      company_name: 'Studio Schmidt',
      street_address: 'Kastanienallee 42',
      apartment: 'Apt 4B',
      city: 'Berlin',
      postal_code: '10119',
      country: 'Germany',
      phone: '+49 30 1234567',
    },
    status: 'in_container',
    container_id: 'cont_active_01',
    subtotal: 178.0,
    shipping_fee: 14.5,
    total: 192.5,
    payment_status: 'paid',
    payment_provider: 'MockPaymentProvider',
    payment_reference: 'TXN-MOCK-SAMPLE-89241',
    total_container_units: 2,
    created_at: '2026-10-18T14:22:00Z',
    items: [
      {
        id: 'item_1',
        order_id: 'ord_101',
        product_id: 'prod_1',
        product_name: 'The Kashi Round Dome Handwoven Bamboo Pendant Shade',
        product_image: '/images/round-shade.jpg',
        qty: 2,
        unit_price: 89.0,
        units_per_slot: 1,
        selected_size: 'approx. 40 cm (±2 cm)',
      },
    ],
  },
  {
    id: 'ord_102',
    order_number: 'VC-EU-89288',
    email: 'julien.moreau@atelier-paris.fr',
    country: 'France',
    shipping_address: {
      first_name: 'Julien',
      last_name: 'Moreau',
      street_address: '18 Rue de Charonne',
      city: 'Paris',
      postal_code: '75011',
      country: 'France',
      phone: '+33 1 42 68 00 00',
    },
    status: 'in_container',
    container_id: 'cont_active_01',
    subtotal: 230.0,
    shipping_fee: 15.0,
    total: 245.0,
    payment_status: 'paid',
    payment_provider: 'MockPaymentProvider',
    payment_reference: 'TXN-MOCK-SAMPLE-89288',
    total_container_units: 4,
    created_at: '2026-10-21T09:15:00Z',
    items: [
      {
        id: 'item_2',
        order_id: 'ord_102',
        product_id: 'prod_2',
        product_name: 'The Surya Four-Point Star Geometric Bamboo Shade',
        product_image: '/images/four-point-shade.jpg',
        qty: 2,
        unit_price: 115.0,
        units_per_slot: 2,
        selected_size: 'approx. 45 cm (±2 cm)',
      },
    ],
  },
];

export const INITIAL_SETTINGS: StoreSettings = {
  store_name: 'Vintage Collections',
  tagline: 'Handwoven bamboo pendant shades, delivered to Europe by pooled sea containers',
  origin_port: 'Port of Nhava Sheva (INNSA), India',
  default_container_capacity: 250,
  estimated_ship_date_fallback: 'mid-November (to be confirmed)',
  vat_duty_notice: 'Customs & VAT handling: To be confirmed with European importer rules. Calculated at port clearance.',
  handmade_disclaimer: 'Each piece is woven by hand. Size, weave and colour tone vary slightly.',
  allowed_countries: [
    { code: 'DE', name: 'Germany', fee_eur: 14.5, estimated_transit_days: 'approx. 25-32 days', is_allowed: true },
    { code: 'FR', name: 'France', fee_eur: 15.0, estimated_transit_days: 'approx. 26-34 days', is_allowed: true },
    { code: 'NL', name: 'Netherlands', fee_eur: 12.0, estimated_transit_days: 'approx. 22-28 days', is_allowed: true },
    { code: 'BE', name: 'Belgium', fee_eur: 13.5, estimated_transit_days: 'approx. 23-30 days', is_allowed: true },
    { code: 'AT', name: 'Austria', fee_eur: 16.0, estimated_transit_days: 'approx. 27-35 days', is_allowed: true },
    { code: 'IT', name: 'Italy', fee_eur: 16.5, estimated_transit_days: 'approx. 25-33 days', is_allowed: true },
    { code: 'ES', name: 'Spain', fee_eur: 17.0, estimated_transit_days: 'approx. 27-36 days', is_allowed: true },
    { code: 'SE', name: 'Sweden', fee_eur: 19.0, estimated_transit_days: 'approx. 28-38 days', is_allowed: true },
    { code: 'DK', name: 'Denmark', fee_eur: 18.0, estimated_transit_days: 'approx. 26-34 days', is_allowed: true },
    { code: 'PL', name: 'Poland', fee_eur: 15.5, estimated_transit_days: 'approx. 27-35 days', is_allowed: true },
    { code: 'IE', name: 'Ireland', fee_eur: 18.5, estimated_transit_days: 'approx. 28-36 days', is_allowed: true },
    { code: 'PT', name: 'Portugal', fee_eur: 17.5, estimated_transit_days: 'approx. 28-36 days', is_allowed: true },
  ],
};

// IN-MEMORY / LOCAL STORAGE DATA STORE HELPER
const STORE_KEY_PRODUCTS = 'vc_store_products_v1';
const STORE_KEY_CONTAINERS = 'vc_store_containers_v1';
const STORE_KEY_ORDERS = 'vc_store_orders_v1';
const STORE_KEY_SETTINGS = 'vc_store_settings_v1';

function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving local data:', err);
  }
}

// UNIFIED DATA LAYER API (The UI only communicates with these functions)

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (!error && data && data.length > 0) return data as Product[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local data layer:', e);
    }
  }
  return getLocalData<Product[]>(STORE_KEY_PRODUCTS, INITIAL_PRODUCTS);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug && p.active) || null;
}

export async function getContainers(): Promise<Container[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('containers').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Container[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local data layer:', e);
    }
  }
  return getLocalData<Container[]>(STORE_KEY_CONTAINERS, INITIAL_CONTAINERS);
}

export async function getOpenContainer(): Promise<Container> {
  const containers = await getContainers();
  const open = containers.find((c) => c.status === 'open');
  if (open) return open;
  return containers[0] || INITIAL_CONTAINERS[0];
}

export async function getOrders(): Promise<Order[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Order[];
    } catch (e) {
      console.warn('Supabase orders fetch failed, falling back to local data layer:', e);
    }
  }
  return getLocalData<Order[]>(STORE_KEY_ORDERS, INITIAL_ORDERS);
}

export async function getOrderByNumberAndEmail(orderNumber: string, email: string): Promise<Order | null> {
  const orders = await getOrders();
  const cleanNum = orderNumber.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();
  return orders.find(
    (o) => o.order_number.toUpperCase() === cleanNum && o.email.toLowerCase() === cleanEmail
  ) || null;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((o) => o.id === id) || null;
}

export async function createOrder(
  orderInput: Omit<Order, 'id' | 'created_at' | 'order_number' | 'status' | 'container_id'>
): Promise<Order> {
  const containers = await getContainers();
  const settings = await getSettings();

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const orderNumber = `VC-EU-${randomNum}`;
  const now = new Date().toISOString();

  const baseOrder: Order = {
    ...orderInput,
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    order_number: orderNumber,
    status: 'in_container',
    container_id: null,
    created_at: now,
  };

  // Run Container Pooling Engine!
  const allocation = allocateOrderToContainer(
    baseOrder,
    containers,
    settings.default_container_capacity
  );

  baseOrder.container_id = allocation.assignedContainerId;

  // Persist updated containers
  setLocalData<Container[]>(STORE_KEY_CONTAINERS, allocation.updatedContainers);

  // Persist order
  const existingOrders = await getOrders();
  const updatedOrders = [baseOrder, ...existingOrders];
  setLocalData<Order[]>(STORE_KEY_ORDERS, updatedOrders);

  // Update stock
  const products = await getProducts();
  const updatedProducts = products.map((prod) => {
    const item = baseOrder.items.find((i) => i.product_id === prod.id);
    if (item) {
      return { ...prod, stock: Math.max(0, prod.stock - item.qty) };
    }
    return prod;
  });
  setLocalData<Product[]>(STORE_KEY_PRODUCTS, updatedProducts);

  // Send Order Confirmation Email via stub
  const assignedContainer = allocation.updatedContainers.find((c) => c.id === allocation.assignedContainerId);
  await sendEmail(generateOrderConfirmationEmail(baseOrder, assignedContainer));

  // If container became full, send admin alert stub
  if (allocation.containerBecameFull) {
    console.log(`[ADMIN NOTIFICATION] Container ${allocation.containerLabel} is 100% full! Booking ocean carrier slot from Nhava Sheva to Rotterdam.`);
  }

  return baseOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  orders[index].status = status;
  setLocalData<Order[]>(STORE_KEY_ORDERS, orders);

  if (status === 'delivered') {
    await sendEmail(generateOrderDeliveredEmail(orders[index]));
  }

  return orders[index];
}

export async function markContainerShipped(
  containerId: string,
  trackingNote: string,
  estimatedShipDate: string
): Promise<Container | null> {
  const containers = await getContainers();
  const index = containers.findIndex((c) => c.id === containerId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  containers[index].status = 'shipped';
  containers[index].shipped_at = now;
  containers[index].tracking_note = trackingNote;
  containers[index].estimated_ship_date = estimatedShipDate;

  setLocalData<Container[]>(STORE_KEY_CONTAINERS, containers);

  // CRITICAL REQUIREMENT: "Marking shipped updates all its orders"
  const orders = await getOrders();
  let updatedOrdersCount = 0;
  for (const order of orders) {
    if (order.container_id === containerId) {
      order.status = 'shipped';
      updatedOrdersCount++;
      await sendEmail(generateContainerShippedEmail(order, containers[index]));
    }
  }
  setLocalData<Order[]>(STORE_KEY_ORDERS, orders);
  console.log(`[CONTAINER SHIPPED] Marked ${containers[index].label} as shipped. Updated ${updatedOrdersCount} orders inside!`);

  return containers[index];
}

export async function markContainerDelivered(containerId: string): Promise<Container | null> {
  const containers = await getContainers();
  const index = containers.findIndex((c) => c.id === containerId);
  if (index === -1) return null;

  const now = new Date().toISOString();
  containers[index].status = 'delivered';
  containers[index].delivered_at = now;

  setLocalData<Container[]>(STORE_KEY_CONTAINERS, containers);

  // Update all orders inside to delivered
  const orders = await getOrders();
  for (const order of orders) {
    if (order.container_id === containerId) {
      order.status = 'delivered';
      await sendEmail(generateOrderDeliveredEmail(order));
    }
  }
  setLocalData<Order[]>(STORE_KEY_ORDERS, orders);

  return containers[index];
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return null;

  products[index] = { ...products[index], ...updates };
  setLocalData<Product[]>(STORE_KEY_PRODUCTS, products);
  return products[index];
}

export async function addProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...productData,
    id: `prod_${Date.now()}`,
  };
  products.push(newProduct);
  setLocalData<Product[]>(STORE_KEY_PRODUCTS, products);
  return newProduct;
}

export async function getSettings(): Promise<StoreSettings> {
  return getLocalData<StoreSettings>(STORE_KEY_SETTINGS, INITIAL_SETTINGS);
}

export async function updateSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings();
  const updated = { ...current, ...newSettings };
  setLocalData<StoreSettings>(STORE_KEY_SETTINGS, updated);
  return updated;
}

/**
 * Generates Packing List CSV content for a container
 */
export async function generatePackingListCSV(containerId: string): Promise<string> {
  const containers = await getContainers();
  const container = containers.find((c) => c.id === containerId);
  const orders = await getOrders();
  const containerOrders = orders.filter((o) => o.container_id === containerId);

  const headers = [
    'Container Label',
    'Order Number',
    'Order Date',
    'Customer Name',
    'Email',
    'Destination Country',
    'City',
    'Postal Code',
    'Street Address',
    'Product Name',
    'Quantity',
    'Slot Units',
    'Order Status',
  ];

  const rows: string[] = [headers.join(',')];

  for (const order of containerOrders) {
    for (const item of order.items) {
      const row = [
        `"${container?.label || containerId}"`,
        `"${order.order_number}"`,
        `"${order.created_at}"`,
        `"${order.shipping_address.first_name} ${order.shipping_address.last_name}"`,
        `"${order.email}"`,
        `"${order.shipping_address.country}"`,
        `"${order.shipping_address.city}"`,
        `"${order.shipping_address.postal_code}"`,
        `"${order.shipping_address.street_address}"`,
        `"${item.product_name.replace(/"/g, '""')}"`,
        item.qty,
        item.qty * item.units_per_slot,
        `"${order.status}"`,
      ];
      rows.push(row.join(','));
    }
  }

  return rows.join('\n');
}
