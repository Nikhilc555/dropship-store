'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import {
  ShoppingBag,
  Truck,
  LayoutDashboard,
  Globe,
  Sparkles,
  Tag
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    config,
    region,
    setRegion,
    cart,
    setIsCartOpen,
    referralCode,
    discountPercent
  } = useStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Top Dynamic Announcement Bar */}
      <div
        className="text-white text-xs sm:text-sm py-2 px-4 text-center font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: config?.primaryColor || '#4f46e5' }}
      >
        <Sparkles className="w-4 h-4 shrink-0" />
        <span>
          {config?.announcementText ||
            '🇮🇳 Extra ₹100 OFF on UPI Orders | Free Express Delivery Across India & Worldwide Shipping'}
        </span>
        {referralCode && (
          <span className="ml-2 inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-semibold">
            <Tag className="w-3 h-3" /> {referralCode} ({discountPercent}% OFF Active)
          </span>
        )}
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
            style={{ backgroundColor: config?.primaryColor || '#4f46e5' }}
          >
            {(config?.storeName || 'V')[0]}
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
              {config?.storeName || 'VOLT & VERVE'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              {config?.tagline || 'India & Global Direct Store'}
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              pathname === '/' ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shop Catalog
          </Link>
          <Link
            href="/track"
            className={`flex items-center gap-1.5 transition-colors ${
              pathname.startsWith('/track')
                ? 'text-indigo-600 font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            Track Order
          </Link>
          <Link
            href="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Merchant & Supplier API Admin
          </Link>
        </nav>

        {/* Right Controls: Region/Currency Switcher + Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* India (INR) vs Global (USD) Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setRegion('IN')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                region === 'IN'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to India Storefront (INR ₹, UPI & COD)"
            >
              <span>🇮🇳</span>
              <span>INR ₹</span>
            </button>
            <button
              onClick={() => setRegion('GLOBAL')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                region === 'GLOBAL'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Switch to Global Storefront (USD $, Stripe)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>USD $</span>
            </button>
          </div>

          {/* Mobile Admin / Track Shortcuts */}
          <Link
            href="/track"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            title="Track Order"
          >
            <Truck className="w-5 h-5" />
          </Link>
          <Link
            href="/admin"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            title="Admin Panel"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span
              className="px-1.5 py-0.5 text-xs rounded-full bg-white text-slate-900 font-bold"
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

