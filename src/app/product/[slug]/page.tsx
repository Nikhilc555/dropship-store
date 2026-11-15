'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductImage from '@/components/ProductImage';
import {
  Star,
  Truck,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  PackageCheck
} from 'lucide-react';

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { products, formatPrice, addToCart, region } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pinInfo, setPinInfo] = useState<{
    serviceable: boolean;
    city: string;
    estimatedDays: string;
    courierPartner: string;
  } | null>(null);

  const product = products.find((p) => p.slug === slug) || products[0];

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-600">Loading product details...</p>
        <Link href="/" className="text-indigo-600 font-semibold text-sm underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const savingsPercent = Math.round(
    ((product.compareAtPriceInr - product.retailPriceInr) / product.compareAtPriceInr) * 100
  );

  // Automatic Google Shopping JSON-LD Structured Data for Organic SEO
  const jsonLdSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.gallery,
    description: product.description,
    sku: product.supplierSku,
    brand: {
      '@type': 'Brand',
      name: 'VOLT & VERVE'
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: region === 'IN' ? 'INR' : 'USD',
      price:
        region === 'IN'
          ? product.retailPriceInr
          : Math.round(product.retailPriceInr * 0.012),
      availability:
        product.stockCount > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount
    }
  };

  const checkPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length !== 6) return;
    const res = await fetch(`/api/pincode?pincode=${pincode}`);
    const data = await res.json();
    setPinInfo(data);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* JSON-LD SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Storefront Catalog
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          API SKU: {product.supplierSku} • Warehouse: {product.warehouseCountry}
        </span>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Image Showcase (Standard 800x800 1:1 Resolution) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white aspect-square shadow-sm">
            <ProductImage
              src={product.image}
              alt={product.title}
              className="w-full h-full"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-extrabold">
              SAVE {savingsPercent}% TODAY
            </span>
          </div>

          {/* Trust & Supplier Fulfillment Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-indigo-300 font-bold block">
                Direct Automated Fulfillment
              </span>
              <p className="text-sm font-semibold">
                Dispatched by {product.supplierName}
              </p>
              <p className="text-xs text-slate-400">
                {region === 'IN'
                  ? `India Delivery: ${product.deliveryDaysIndia}`
                  : `Global Delivery: ${product.deliveryDaysGlobal}`}
              </p>
            </div>
            <PackageCheck className="w-9 h-9 text-emerald-400 shrink-0" />
          </div>
        </div>

        {/* Right Conversion Column */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs">
                {product.category}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating} ({product.reviewsCount} Verified Buyers)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {product.title}
            </h1>
            <p className="text-sm text-slate-600">{product.subtitle}</p>
          </div>

          {/* Pricing Block */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900">
                {formatPrice(product.retailPriceInr)}
              </span>
              <span className="text-base text-slate-400 line-through">
                {formatPrice(product.compareAtPriceInr)}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            {region === 'IN' && (
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 px-3 py-2 rounded-xl">
                <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  Pay via <strong>UPI (GPay / PhonePe / Paytm)</strong> at checkout for an instant{' '}
                  <strong>₹100 OFF ({formatPrice(product.retailPriceInr - 100)})</strong>!
                </span>
              </div>
            )}
          </div>

          {/* Description & Key Features */}
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.features.map((feat, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pincode Checker for India */}
          {region === 'IN' && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Check Express Delivery & COD Availability (Shiprocket API)
              </label>
              <form onSubmit={checkPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode (e.g. 400001)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Check
                </button>
              </form>
              {pinInfo && pinInfo.serviceable && (
                <p className="text-xs text-emerald-700 font-semibold">
                  ✓ Express Delivery to {pinInfo.city} in {pinInfo.estimatedDays} via{' '}
                  {pinInfo.courierPartner} • Cash on Delivery Available
                </p>
              )}
            </div>
          )}

          {/* Quantity + Add to Cart / Buy Now Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="flex items-center border border-slate-300 rounded-xl bg-white px-3 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2 font-bold text-slate-600"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2 font-bold text-slate-600"
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 py-3.5 px-5 rounded-xl border-2 border-slate-900 text-slate-900 hover:bg-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>
                {region === 'IN' ? 'Buy Now (UPI / COD)' : 'Buy Now (Express Checkout)'}
              </span>
            </button>
          </div>

          {/* Technical Specifications */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Technical Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(product.specs || {}).map(([k, v]) => (
                <div
                  key={k}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 flex justify-between"
                >
                  <span className="text-slate-500 font-medium">{k}:</span>
                  <span className="text-slate-900 font-bold">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 pt-2">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" /> Free Express Shipping
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 7-Day Replacement Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

