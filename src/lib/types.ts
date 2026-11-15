export type NicheKey = 'smart-desk' | 'home-decor' | 'travel-edc';

export interface StoreConfig {
  storeName: string;
  tagline: string;
  nichePreset: NicheKey;
  announcementText: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  usdExchangeRate: number; // e.g., 0.012 (1 INR = 0.012 USD)
  defaultMarkupMultiplier: number; // e.g., 2.5x supplier cost
  autoFulfillOrders: boolean;
  cjApiKey: string;
  shiprocketEmail: string;
  apiMode: 'SANDBOX_SIMULATOR' | 'LIVE_CJ_API';
  lastCatalogSync: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  niche: NicheKey;
  image: string;
  gallery: string[];
  supplierCostInr: number;
  retailPriceInr: number;
  compareAtPriceInr: number;
  supplierName: string;
  supplierProductId: string;
  supplierSku: string;
  warehouseCountry: 'IN' | 'US' | 'CN';
  deliveryDaysIndia: string;
  deliveryDaysGlobal: string;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  features: string[];
  specs: Record<string, string>;
  lastSyncedAt: string;
}

export interface SupplierCatalogItem {
  supplierProductId: string;
  supplierSku: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  niche: NicheKey;
  image: string;
  gallery: string[];
  supplierCostInr: number;
  supplierCostUsd: number;
  supplierName: string;
  warehouseCountry: 'IN' | 'US' | 'CN';
  stockCount: number;
  deliveryDaysIndia: string;
  deliveryDaysGlobal: string;
  features: string[];
  specs: Record<string, string>;
}

export interface OrderItem {
  productId: string;
  title: string;
  sku: string;
  image: string;
  quantity: number;
  unitPriceInr: number;
  supplierCostInr: number;
  supplierName: string;
}

export type FulfillmentStage =
  | 'ORDER_CONFIRMED'
  | 'DISPATCHED_TO_SUPPLIER'
  | 'PACKAGED_AT_WAREHOUSE'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: 'IN' | 'US' | 'UK' | 'AE' | 'CA';
  currency: 'INR' | 'USD';
  items: OrderItem[];
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  totalAmountInr: number;
  supplierCostTotalInr: number;
  netProfitInr: number;
  paymentMethod: 'UPI_RAZORPAY' | 'CARD_STRIPE' | 'COD_INDIA';
  paymentStatus: 'PAID' | 'COD_VERIFIED' | 'PENDING';
  fulfillmentStatus: FulfillmentStage;
  supplierOrderId: string;
  trackingNumber: string;
  courierName: string;
  estimatedDelivery: string;
  referralCodeUsed?: string;
  createdAt: string;
  timeline: {
    stage: FulfillmentStage;
    label: string;
    timestamp: string;
    location: string;
    completed: boolean;
  }[];
}

export interface ReferralAffiliate {
  id: string;
  code: string;
  influencerName: string;
  handle: string;
  platform: 'Instagram Reels' | 'YouTube Shorts' | 'Customer Referral';
  discountPercent: number;
  commissionPercent: number;
  clicks: number;
  totalOrders: number;
  totalEarningsInr: number;
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  country: string;
  itemsSummary: string;
  cartTotalInr: number;
  recoveryDiscountCode: string;
  recoveryStatus: 'PENDING' | 'WHATSAPP_SENT' | 'RECOVERED';
  createdAt: string;
}

