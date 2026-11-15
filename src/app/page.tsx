'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ProductImage from '@/components/ProductImage';
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Zap,
  Star,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';

export default function StorefrontHome() {
  const {
    config,
    products,
    loading,
    region,
    formatPrice,
    addToCart,
    applyReferralOrCoupon
  } = useStore();

  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>('ALL');
  const [indiaWarehouseOnly, setIndiaWarehouseOnly] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{
    serviceable: boolean;
    city: string;
    state: string;
    estimatedDays: string;
    courierPartner: string;
  } | null>(null);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length !== 6) return;
    const res = await fetch(`/api/pincode?pincode=${encodeURIComponent(pincode)}`);
    const data = await res.json();
    setPincodeResult(data);
  };

  const filteredProducts = products.filter((p) => {
    const matchesNiche =
      selectedNicheFilter === 'ALL' || p.niche === selectedNicheFilter;
    const matchesWarehouse = !indiaWarehouseOnly || p.warehouseCountry === 'IN';
    return matchesNiche && matchesWarehouse;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
        <p className="text-sm text-slate-500 mt-3 font-medium">
          Syncing live storefront catalog from supplier APIs...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Dynamic Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{config?.heroBadge || 'Direct from Verified India & Global Warehouses'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {config?.heroTitle ||
                'Upgrade Your Lifestyle With Curated Direct-to-Door Essentials.'}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {config?.heroSubtitle ||
                'Automated direct fulfillment from local Indian hubs (Mumbai, Delhi, Bengaluru) via Shiprocket Express and Global warehouses.'}
            </p>

            {/* Primary CTAs + India Pincode Estimator */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#catalog"
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2"
                style={{ backgroundColor: config?.primaryColor || '#4f46e5' }}
              >
                <span>Shop Curated Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/admin"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm transition-colors"
              >
                Customize Niche & Supplier API →
              </Link>
            </div>

            {/* Live India Pincode Serviceability Bar */}
            {region === 'IN' && (
              <div className="pt-2 max-w-xl">
                <form
                  onSubmit={handleCheckPincode}
                  className="bg-white/5 border border-white/15 rounded-xl p-2 flex flex-col sm:flex-row gap-2"
                >
                  <div className="flex items-center gap-2 px-3 flex-1">
                    <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit India Pincode (e.g. 560038, 400001)"
                      className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 shrink-0"
                  >
                    Check Express Delivery
                  </button>
                </form>
                {pincodeResult && (
                  <div className="mt-2 text-xs flex items-center gap-2 text-emerald-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {pincodeResult.serviceable ? (
                      <span>
                        Delivering to <strong>{pincodeResult.city}, {pincodeResult.state}</strong> in{' '}
                        <strong>{pincodeResult.estimatedDays}</strong> via {pincodeResult.courierPartner} (UPI & COD Available)
                      </span>
                    ) : (
                      <span className="text-amber-300">Please enter a valid 6-digit Indian pincode.</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Featured Showcase Card */}
          {products[0] && (
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="relative rounded-xl overflow-hidden aspect-square max-h-80 w-full mx-auto bg-slate-900">
                  <ProductImage
                    src={products[0].image}
                    alt={products[0].title}
                    className="w-full h-full"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-xs">
                    🇮🇳 Bestseller • {products[0].deliveryDaysIndia}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{products[0].category}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {products[0].rating} ({products[0].reviewsCount} verified reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{products[0].title}</h3>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">
                        {formatPrice(products[0].retailPriceInr)}
                      </span>
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(products[0].compareAtPriceInr)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(products[0], 1)}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust & Fulfillment Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {region === 'IN' ? '2–5 Day India Express' : 'Global Priority Air Line'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {region === 'IN'
                  ? 'Dispatched via Bluedart, Delhivery & Xpressbees (Shiprocket)'
                  : 'Tracked door-to-door via CJPacket & USPS/DHL'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {region === 'IN' ? 'UPI, Cards & Verified COD' : 'Stripe, Apple Pay & Cards'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {region === 'IN'
                  ? 'Instant ₹100 OFF on GPay / PhonePe / Paytm UPI checkout'
                  : '256-bit encrypted multi-currency checkout'}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">7-Day Easy Replacement</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Damaged or defective item? Instant doorstep replacement guaranteed.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
            <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Live API Inventory Sync</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stock counts synced directly with supplier warehouses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Product Catalog Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Trending Direct-from-Warehouse Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              All products below are synced automatically from the Supplier API. Switch niches anytime in{' '}
              <Link href="/admin" className="text-indigo-600 font-semibold underline">
                /admin
              </Link>
              .
            </p>
          </div>

          {/* Category / Niche Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Niches' },
              { id: 'smart-desk', label: '⚡ Smart Desk & Tech' },
              { id: 'home-decor', label: '✨ Home & Ambient Decor' },
              { id: 'travel-edc', label: '🌍 Everyday Carry & Travel' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedNicheFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedNicheFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => setIndiaWarehouseOnly(!indiaWarehouseOnly)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                indiaWarehouseOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>🇮🇳 India Warehouse Only</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const savingsPercent = Math.round(
              ((product.compareAtPriceInr - product.retailPriceInr) /
                product.compareAtPriceInr) *
                100
            );
            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container (Standard 800x800 1:1 Resolution) */}
                  <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[11px] shadow-xs">
                        SAVE {savingsPercent}%
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-xs text-white font-semibold text-[10px]">
                        {product.warehouseCountry === 'IN'
                          ? '🇮🇳 IN Warehouse (2–4d)'
                          : `🌍 ${product.warehouseCountry} Express Hub`}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-indigo-600">{product.category}</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {product.rating} ({product.reviewsCount})
                      </span>
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      className="block font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors"
                    >
                      {product.title}
                    </Link>

                    <p className="text-xs text-slate-500 line-clamp-2">{product.subtitle}</p>
                  </div>
                </div>

                {/* Price + Actions */}
                <div className="p-4 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-lg font-extrabold text-slate-900">
                        {formatPrice(product.retailPriceInr)}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        {formatPrice(product.compareAtPriceInr)}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {product.stockCount} in stock
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/product/${product.slug}`}
                      className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold text-center transition-colors"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Built-in Influencer & Creator Referral Engine Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Sparkles className="w-4 h-4" /> Built-In Customer Acquisition Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold">
              Testing Influencer Reels or Referral Links?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Click below to simulate arriving from an Instagram Creator&apos;s bio link (<code className="text-indigo-300">?ref=TECHBURNER10</code>). It automatically activates 10% OFF for the shopper and credits 15% affiliate commission to the creator in your Admin Dashboard!
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => applyReferralOrCoupon('TECHBURNER10')}
              className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-colors"
            >
              Simulate Creator Link (?ref=TECHBURNER10)
            </button>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
            >
              View Creator Commissions in Admin →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

