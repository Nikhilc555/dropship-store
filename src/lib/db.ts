import fs from 'fs';
import path from 'path';
import {
  StoreConfig,
  Product,
  Order,
  ReferralAffiliate,
  AbandonedCart,
  NicheKey,
  SupplierCatalogItem
} from './types';
import { SUPPLIER_API_CATALOG } from './suppliers/cj-api';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store-db.json');

export const NICHE_PRESETS: Record<
  NicheKey,
  {
    name: string;
    storeName: string;
    tagline: string;
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    primaryColor: string;
    announcementText: string;
  }
> = {
  'smart-desk': {
    name: 'Smart Desk & Tech Gadgets',
    storeName: 'VOLT & VERVE',
    tagline: 'Next-Gen Workspace & Charging Essentials',
    heroBadge: '⚡ Direct from India & Global Tech Warehouses',
    heroTitle: 'Upgrade Your Desk Into a High-Output Command Center.',
    heroSubtitle:
      'Precision-engineered GaN chargers, MagSafe docks, and studio lighting. Fast 2–4 day delivery across India via Shiprocket + Worldwide Express.',
    primaryColor: '#4f46e5',
    announcementText:
      '🇮🇳 Extra ₹100 OFF on UPI Orders | Free Express Delivery Across India & Worldwide Shipping Available'
  },
  'home-decor': {
    name: 'Minimalist Home & Ambient Decor',
    storeName: 'LUMINA CASA',
    tagline: 'Architectural Lighting & Calm Living Spaces',
    heroBadge: '✨ Curated Modern Home & Wellness Objects',
    heroTitle: 'Transform Any Room Into a Warm, Restorative Sanctuary.',
    heroSubtitle:
      'Levitating lamps, ultrasonic flame diffusers, and tactile minimalist decor delivered straight from verified warehouses to your doorstep.',
    primaryColor: '#d97706',
    announcementText:
      '✨ Festive Home Sale: Use code WELCOME10 for 10% OFF + Free Prepaid Delivery in India!'
  },
  'travel-edc': {
    name: 'Everyday Carry & Travel Gear',
    storeName: 'NOMAD CORE',
    tagline: 'Engineered Gear for Modern Explorers',
    heroBadge: '🌍 Built for Commuters, Creators & Flyers',
    heroTitle: 'Carry Smarter. Move Faster. Anywhere on Earth.',
    heroSubtitle:
      'Anti-theft carbon sling packs, cordless travel espresso makers, and modular EDC gear with India & Global express fulfillment.',
    primaryColor: '#059669',
    announcementText:
      '✈️ Travel Ready: Free Express Dispatch within 24 Hours + Live Courier Tracking on Every Order'
  }
};

export interface DatabaseSchema {
  config: StoreConfig;
  products: Product[];
  orders: Order[];
  affiliates: ReferralAffiliate[];
  abandonedCarts: AbandonedCart[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function calculateRetailPriceInr(supplierCostInr: number, multiplier: number): {
  retailPriceInr: number;
  compareAtPriceInr: number;
} {
  // Psychological pricing in INR ending in 99
  const rawRetail = supplierCostInr * multiplier;
  const roundedRetail = Math.ceil(rawRetail / 100) * 100 - 1;
  const rawCompare = roundedRetail * 1.35;
  const roundedCompare = Math.ceil(rawCompare / 100) * 100 - 1;
  return {
    retailPriceInr: Math.max(roundedRetail, supplierCostInr + 200),
    compareAtPriceInr: roundedCompare
  };
}

export function mapSupplierItemToProduct(
  item: SupplierCatalogItem,
  multiplier: number,
  isFeatured = true
): Product {
  const { retailPriceInr, compareAtPriceInr } = calculateRetailPriceInr(
    item.supplierCostInr,
    multiplier
  );
  const normalizedImage =
    item.image && item.image.trim() !== ''
      ? item.image.replace('w=900', 'w=800&h=800')
      : '/images/default-product.svg';

  return {
    id: `prod_${item.supplierProductId.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    slug: slugify(item.title),
    title: item.title,
    subtitle: item.subtitle,
    description: item.description,
    category: item.category,
    niche: item.niche,
    image: normalizedImage,
    gallery:
      item.gallery && item.gallery.length > 0
        ? item.gallery.map((g) => (g ? g.replace('w=900', 'w=800&h=800') : normalizedImage))
        : [normalizedImage],
    supplierCostInr: item.supplierCostInr,
    retailPriceInr,
    compareAtPriceInr,
    supplierName: item.supplierName,
    supplierProductId: item.supplierProductId,
    supplierSku: item.supplierSku,
    warehouseCountry: item.warehouseCountry,
    deliveryDaysIndia: item.deliveryDaysIndia,
    deliveryDaysGlobal: item.deliveryDaysGlobal,
    stockCount: item.stockCount,
    rating: 4.8,
    reviewsCount: Math.floor(38 + Math.random() * 140),
    isFeatured,
    features: item.features,
    specs: item.specs,
    lastSyncedAt: new Date().toISOString()
  };
}

function createInitialSeedDatabase(): DatabaseSchema {
  const defaultMultiplier = 2.4;
  const preset = NICHE_PRESETS['smart-desk'];

  // Automatically import initial products from the Supplier API catalog
  const seededProducts: Product[] = SUPPLIER_API_CATALOG.map((item, idx) =>
    mapSupplierItemToProduct(item, defaultMultiplier, idx < 6)
  );

  const sampleOrders: Order[] = [
    {
      id: 'ord_1042',
      orderNumber: 'ORD-1042',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      customerPhone: '+91 98765 43210',
      shippingAddress: 'Flat 402, Palm Grove Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      country: 'IN',
      currency: 'INR',
      items: [
        {
          productId: seededProducts[0].id,
          title: seededProducts[0].title,
          sku: seededProducts[0].supplierSku,
          image: seededProducts[0].image,
          quantity: 1,
          unitPriceInr: seededProducts[0].retailPriceInr,
          supplierCostInr: seededProducts[0].supplierCostInr,
          supplierName: seededProducts[0].supplierName
        }
      ],
      subtotalInr: seededProducts[0].retailPriceInr,
      discountInr: 100,
      shippingInr: 0,
      totalAmountInr: seededProducts[0].retailPriceInr - 100,
      supplierCostTotalInr: seededProducts[0].supplierCostInr,
      netProfitInr: seededProducts[0].retailPriceInr - 100 - seededProducts[0].supplierCostInr,
      paymentMethod: 'UPI_RAZORPAY',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'IN_TRANSIT',
      supplierOrderId: 'CJ-IN-ORD-883920',
      trackingNumber: 'SR-BLUEDART-883920IN',
      courierName: 'Shiprocket (Bluedart Air Express)',
      estimatedDelivery: '2–3 Days',
      referralCodeUsed: 'TECHBURNER10',
      createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      timeline: [
        {
          stage: 'ORDER_CONFIRMED',
          label: 'Customer Order Confirmed & UPI Payment Verified',
          timestamp: 'Yesterday, 10:14 AM',
          location: 'Online Storefront',
          completed: true
        },
        {
          stage: 'DISPATCHED_TO_SUPPLIER',
          label: 'Auto-Forwarded to Supplier API (CJdropshipping IN Warehouse)',
          timestamp: 'Yesterday, 10:15 AM',
          location: 'Automated API Router',
          completed: true
        },
        {
          stage: 'PACKAGED_AT_WAREHOUSE',
          label: 'QC Passed & Handed to Bluedart Air via Shiprocket',
          timestamp: 'Yesterday, 04:30 PM',
          location: 'Bhiwandi Fulfillment Hub, Mumbai (IN)',
          completed: true
        },
        {
          stage: 'IN_TRANSIT',
          label: 'In Transit — Arrived at Bengaluru Sort Facility',
          timestamp: 'Today, 08:45 AM',
          location: 'Bengaluru Hub, Karnataka',
          completed: true
        },
        {
          stage: 'OUT_FOR_DELIVERY',
          label: 'Out for Delivery with Local Executive',
          timestamp: 'Pending',
          location: 'Indiranagar, Bengaluru',
          completed: false
        }
      ]
    },
    {
      id: 'ord_1043',
      orderNumber: 'ORD-1043',
      customerName: 'Sophia Miller',
      customerEmail: 'sophia.m@example.com',
      customerPhone: '+1 415 890 2311',
      shippingAddress: '742 Evergreen Terrace, Suite 4B',
      city: 'Austin',
      state: 'TX',
      pincode: '78701',
      country: 'US',
      currency: 'USD',
      items: [
        {
          productId: seededProducts[2].id,
          title: seededProducts[2].title,
          sku: seededProducts[2].supplierSku,
          image: seededProducts[2].image,
          quantity: 1,
          unitPriceInr: seededProducts[2].retailPriceInr,
          supplierCostInr: seededProducts[2].supplierCostInr,
          supplierName: seededProducts[2].supplierName
        }
      ],
      subtotalInr: seededProducts[2].retailPriceInr,
      discountInr: 0,
      shippingInr: 0,
      totalAmountInr: seededProducts[2].retailPriceInr,
      supplierCostTotalInr: seededProducts[2].supplierCostInr,
      netProfitInr: seededProducts[2].retailPriceInr - seededProducts[2].supplierCostInr,
      paymentMethod: 'CARD_STRIPE',
      paymentStatus: 'PAID',
      fulfillmentStatus: 'DISPATCHED_TO_SUPPLIER',
      supplierOrderId: 'CJ-GL-ORD-991044',
      trackingNumber: 'CJPACKET-991044US',
      courierName: 'CJPacket US Priority (USPS Last-Mile)',
      estimatedDelivery: '4–7 Days',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      timeline: [
        {
          stage: 'ORDER_CONFIRMED',
          label: 'Global Stripe Order Paid ($ USD)',
          timestamp: 'Today, 11:02 AM',
          location: 'Global Checkout',
          completed: true
        },
        {
          stage: 'DISPATCHED_TO_SUPPLIER',
          label: 'Auto-Routed to CJdropshipping US Warehouse API',
          timestamp: 'Today, 11:03 AM',
          location: 'California Fulfillment Hub (US)',
          completed: true
        },
        {
          stage: 'PACKAGED_AT_WAREHOUSE',
          label: 'Picking & Labeling in Progress',
          timestamp: 'Estimated Today',
          location: 'Los Angeles Warehouse',
          completed: false
        },
        {
          stage: 'IN_TRANSIT',
          label: 'USPS Priority Dispatch',
          timestamp: 'Pending',
          location: 'Austin, TX',
          completed: false
        }
      ]
    }
  ];

  const affiliates: ReferralAffiliate[] = [
    {
      id: 'aff_1',
      code: 'TECHBURNER10',
      influencerName: 'Rohan (Tech Reels India)',
      handle: '@rohan_setups',
      platform: 'Instagram Reels',
      discountPercent: 10,
      commissionPercent: 15,
      clicks: 412,
      totalOrders: 18,
      totalEarningsInr: 5120
    },
    {
      id: 'aff_2',
      code: 'DESKFLOW',
      influencerName: 'Ananya Workspace Shorts',
      handle: '@ananyadesks',
      platform: 'YouTube Shorts',
      discountPercent: 10,
      commissionPercent: 12,
      clicks: 285,
      totalOrders: 11,
      totalEarningsInr: 2890
    },
    {
      id: 'aff_3',
      code: 'WELCOME10',
      influencerName: 'First-Order Welcome Popup',
      handle: 'Store Lead Capture',
      platform: 'Customer Referral',
      discountPercent: 10,
      commissionPercent: 0,
      clicks: 690,
      totalOrders: 34,
      totalEarningsInr: 0
    }
  ];

  const abandonedCarts: AbandonedCart[] = [
    {
      id: 'ab_1',
      customerName: 'Vikram Nair',
      customerPhone: '919820112233',
      customerEmail: 'vikram.nair@gmail.com',
      country: 'IN',
      itemsSummary: 'LumenBar Pro Curved Monitor Light Bar (x1)',
      cartTotalInr: seededProducts[1].retailPriceInr,
      recoveryDiscountCode: 'COMEBACK10',
      recoveryStatus: 'PENDING',
      createdAt: '42 mins ago'
    },
    {
      id: 'ab_2',
      customerName: 'Neha Kapoor',
      customerPhone: '919811445566',
      customerEmail: 'neha.k@outlook.com',
      country: 'IN',
      itemsSummary: 'Orbita Magnetic Levitating Moon Lamp (x1)',
      cartTotalInr: seededProducts[4].retailPriceInr,
      recoveryDiscountCode: 'COMEBACK10',
      recoveryStatus: 'WHATSAPP_SENT',
      createdAt: '3 hours ago'
    }
  ];

  return {
    config: {
      storeName: preset.storeName,
      tagline: preset.tagline,
      nichePreset: 'smart-desk',
      announcementText: preset.announcementText,
      primaryColor: preset.primaryColor,
      heroTitle: preset.heroTitle,
      heroSubtitle: preset.heroSubtitle,
      heroBadge: preset.heroBadge,
      usdExchangeRate: 0.012,
      defaultMarkupMultiplier: defaultMultiplier,
      autoFulfillOrders: true,
      cjApiKey: process.env.CJ_API_KEY || '',
      shiprocketEmail: process.env.SHIPROCKET_EMAIL || 'logistics@voltandverve.in',
      apiMode: process.env.CJ_API_KEY ? 'LIVE_CJ_API' : 'SANDBOX_SIMULATOR',
      lastCatalogSync: new Date().toISOString()
    },
    products: seededProducts,
    orders: sampleOrders,
    affiliates,
    abandonedCarts
  };
}

export function readDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initial = createInitialSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    const initial = createInitialSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

export function writeDb(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

