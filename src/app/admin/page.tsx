'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ProductImage from '@/components/ProductImage';
import {
  SupplierCatalogItem,
  Order,
  ReferralAffiliate,
  AbandonedCart,
  NicheKey
} from '@/lib/types';
import {
  Search,
  RefreshCw,
  DownloadCloud,
  CheckCircle2,
  TrendingUp,
  Package,
  Users,
  Palette,
  ExternalLink,
  KeyRound,
  Zap,
  MessageSquare,
  Copy,
  Truck,
  Sparkles
} from 'lucide-react';

interface SupplierSearchItem extends SupplierCatalogItem {
  alreadyImported?: boolean;
}

export default function AdminDashboardPage() {
  const { config, refreshStore } = useStore();

  const [activeTab, setActiveTab] = useState<
    'SUPPLIER_API' | 'ORDERS' | 'MARKETING' | 'NICHE_CONFIG'
  >('SUPPLIER_API');

  // Supplier API Tab State
  const [searchQuery, setSearchQuery] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState<'ALL' | 'IN' | 'US' | 'CN'>('ALL');
  const [supplierItems, setSupplierItems] = useState<SupplierSearchItem[]>([]);
  const [endpointCalled, setEndpointCalled] = useState('');
  const [apiMode, setApiMode] = useState<'LIVE_CJ_API' | 'SANDBOX_SIMULATOR'>('SANDBOX_SIMULATOR');
  const [markupMultiplier, setMarkupMultiplier] = useState<number>(2.4);
  const [cjApiKeyInput, setCjApiKeyInput] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders & Marketing State
  const [orders, setOrders] = useState<Order[]>([]);
  const [affiliates, setAffiliates] = useState<ReferralAffiliate[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);

  // New Affiliate Form
  const [newCode, setNewCode] = useState('');
  const [newInfluencer, setNewInfluencer] = useState('');
  const [newPlatform, setNewPlatform] = useState<
    'Instagram Reels' | 'YouTube Shorts' | 'Customer Referral'
  >('Instagram Reels');
  const [newDiscount, setNewDiscount] = useState(10);
  const [newCommission, setNewCommission] = useState(15);

  // Brand Customizer Form
  const [customStoreName, setCustomStoreName] = useState('');
  const [customTagline, setCustomTagline] = useState('');
  const [customAnnouncement, setCustomAnnouncement] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchSupplierCatalog = useCallback(
    async (q = searchQuery, wh = warehouseFilter) => {
      setSyncing(true);
      try {
        const res = await fetch(
          `/api/suppliers?q=${encodeURIComponent(q)}&warehouse=${wh}`,
          { cache: 'no-store' }
        );
        const data = await res.json();
        setSupplierItems(data.items || []);
        setEndpointCalled(data.endpointCalled || '');
        setApiMode(data.mode || 'SANDBOX_SIMULATOR');
      } finally {
        setSyncing(false);
      }
    },
    [searchQuery, warehouseFilter]
  );

  const fetchAdminData = useCallback(async () => {
    const [storeRes, ordersRes] = await Promise.all([
      fetch('/api/store', { cache: 'no-store' }),
      fetch('/api/orders', { cache: 'no-store' })
    ]);
    const storeData = await storeRes.json();
    const ordersData = await ordersRes.json();

    if (storeData.config) {
      setMarkupMultiplier(storeData.config.defaultMarkupMultiplier || 2.4);
      setCjApiKeyInput(storeData.config.cjApiKey || '');
      setCustomStoreName(storeData.config.storeName || '');
      setCustomTagline(storeData.config.tagline || '');
      setCustomAnnouncement(storeData.config.announcementText || '');
    }
    setAffiliates(storeData.affiliates || []);
    setAbandonedCarts(storeData.abandonedCarts || []);
    setOrders(ordersData.orders || []);
  }, []);

  useEffect(() => {
    fetchAdminData();
    fetchSupplierCatalog('', 'ALL');
  }, [fetchAdminData, fetchSupplierCatalog]);

  const handleImportSupplierProduct = async (item: SupplierSearchItem) => {
    const res = await fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'IMPORT',
        supplierItem: item,
        markupMultiplier
      })
    });
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      await refreshStore();
      await fetchSupplierCatalog(searchQuery, warehouseFilter);
    }
  };

  const handleSyncAllInventory = async () => {
    setSyncing(true);
    try {
      await fetch('/api/store', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultMarkupMultiplier: markupMultiplier,
          recalculatePrices: true
        })
      });
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SYNC_ALL' })
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `Synced live stock & ${markupMultiplier}x markup across ${data.syncedCount} products via API!`
        );
        await refreshStore();
        await fetchSupplierCatalog(searchQuery, warehouseFilter);
      }
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/store', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cjApiKey: cjApiKeyInput })
    });
    showToast(
      cjApiKeyInput.trim().length > 10
        ? 'Live CJdropshipping API Key saved! Catalog queries now hit live CJ v2 endpoints.'
        : 'Switched to Built-in Supplier API Sandbox Feed.'
    );
    await fetchSupplierCatalog(searchQuery, warehouseFilter);
  };

  const handleSwitchNichePreset = async (presetKey: NicheKey) => {
    const res = await fetch('/api/store', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nichePreset: presetKey })
    });
    const data = await res.json();
    if (data.config) {
      setCustomStoreName(data.config.storeName);
      setCustomTagline(data.config.tagline);
      setCustomAnnouncement(data.config.announcementText);
      await refreshStore();
      showToast(`Switched Storefront Niche to "${data.config.storeName}"!`);
    }
  };

  const handleSaveCustomBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/store', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeName: customStoreName,
        tagline: customTagline,
        announcementText: customAnnouncement
      })
    });
    await refreshStore();
    showToast('Updated storefront branding & announcement banner!');
  };

  const handleCreateAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const res = await fetch('/api/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE_AFFILIATE',
        code: newCode,
        influencerName: newInfluencer || 'Creator Partner',
        platform: newPlatform,
        discountPercent: newDiscount,
        commissionPercent: newCommission
      })
    });
    const data = await res.json();
    if (data.affiliates) {
      setAffiliates(data.affiliates);
      setNewCode('');
      setNewInfluencer('');
      showToast(`Created creator referral link: ?ref=${data.affiliate.code}`);
    }
  };

  // Financial Metrics Calculation
  const totalRevenueInr = orders.reduce((sum, o) => sum + o.totalAmountInr, 0);
  const totalSupplierCostInr = orders.reduce((sum, o) => sum + o.supplierCostTotalInr, 0);
  const totalNetProfitInr = orders.reduce((sum, o) => sum + o.netProfitInr, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header & Live Profit KPIs */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Zap className="w-4 h-4" /> Automated Dropshipping Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Merchant & Supplier API Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Zero manual product entry: search supplier APIs, auto-calculate retail markups, route orders, and run creator marketing.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Gross Store Revenue</span>
            <p className="text-2xl font-extrabold text-white mt-1">
              ₹{totalRevenueInr.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Across {orders.length} India & Global Orders
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">
              Supplier Wholesale Cost (API)
            </span>
            <p className="text-2xl font-extrabold text-slate-200 mt-1">
              ₹{totalSupplierCostInr.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-slate-400">
              Auto-paid to CJ / India Warehouses
            </span>
          </div>

          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4">
            <span className="text-xs text-emerald-300 font-bold">Net Merchant Profit</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-1">
              +₹{totalNetProfitInr.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-300">
              {totalRevenueInr > 0
                ? `${Math.round((totalNetProfitInr / totalRevenueInr) * 100)}% Net Margin after Supplier Cost`
                : 'Ready for orders'}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Supplier API Mode</span>
            <p className="text-sm font-extrabold text-indigo-300 mt-1.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              {apiMode === 'LIVE_CJ_API'
                ? 'Live CJdropshipping API v2'
                : 'API Feed Connected (Sandbox Ready)'}
            </p>
            <span className="text-[11px] text-slate-400 block mt-1">
              Auto-Fulfill: {config?.autoFulfillOrders ? 'ENABLED' : 'MANUAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          {
            id: 'SUPPLIER_API',
            label: '1. Live Supplier API Catalog & Auto-Pricing',
            icon: DownloadCloud
          },
          {
            id: 'ORDERS',
            label: `2. Automated Order Routing (${orders.length})`,
            icon: Package
          },
          {
            id: 'MARKETING',
            label: '3. Influencer Referrals & WhatsApp Recovery',
            icon: Users
          },
          {
            id: 'NICHE_CONFIG',
            label: '4. Niche Preset & Brand Customizer',
            icon: Palette
          }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as 'SUPPLIER_API' | 'ORDERS' | 'MARKETING' | 'NICHE_CONFIG'
                )
              }
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE SUPPLIER API CATALOG & AUTO-PRICING */}
      {activeTab === 'SUPPLIER_API' && (
        <div className="space-y-6">
          {/* API Connection & Auto-Markup Rules Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Markup Multiplier Engine */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Automated Pricing Markup Rules Engine
                  </h2>
                  <p className="text-xs text-slate-500">
                    Set your retail multiplier once—all products imported from the Supplier API are priced automatically.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-sm">
                  {markupMultiplier.toFixed(1)}x Supplier Cost
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={1.5}
                  max={4.0}
                  step={0.1}
                  value={markupMultiplier}
                  onChange={(e) => setMarkupMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>1.5x (Low Margin / High Volume)</span>
                  <span>2.4x (Recommended India/Global Margin)</span>
                  <span>4.0x (Luxury Brand Markup)</span>
                </div>
              </div>

              <div className="pt-1 flex flex-wrap gap-3">
                <button
                  onClick={handleSyncAllInventory}
                  disabled={syncing}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>
                    Sync All Store Inventory & Apply {markupMultiplier.toFixed(1)}x Markup
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Live CJdropshipping API Key Input */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                CJdropshipping REST API v2 Key (Optional)
              </h3>
              <p className="text-xs text-slate-500">
                Works out-of-the-box with the built-in Supplier API Feed, or paste a free key from{' '}
                <code className="text-indigo-600">developers.cjdropshipping.com</code> to query live warehouses.
              </p>
              <form onSubmit={handleSaveApiKey} className="flex gap-2">
                <input
                  type="password"
                  value={cjApiKeyInput}
                  onChange={(e) => setCjApiKeyInput(e.target.value)}
                  placeholder="Paste CJ_API_KEY (or leave blank for Sandbox Feed)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
                >
                  Save Key
                </button>
              </form>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                GET {endpointCalled}
              </p>
            </div>
          </div>

          {/* Search & Warehouse Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex flex-col md:flex-row gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchSupplierCatalog(searchQuery, warehouseFilter);
                }}
                className="flex-1 flex gap-2"
              >
                <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Supplier API by keyword, SKU, or category (e.g. charger, lamp, espresso)..."
                    className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                >
                  Query Supplier API
                </button>
              </form>

              {/* Warehouse Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                {[
                  { id: 'ALL', label: 'All Warehouses' },
                  { id: 'IN', label: '🇮🇳 India Hub (IN)' },
                  { id: 'US', label: '🇺🇸 US Hub (US)' },
                  { id: 'CN', label: '🌍 Global Hub (CN)' }
                ].map((wh) => (
                  <button
                    key={wh.id}
                    onClick={() => {
                      const val = wh.id as 'ALL' | 'IN' | 'US' | 'CN';
                      setWarehouseFilter(val);
                      fetchSupplierCatalog(searchQuery, val);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      warehouseFilter === wh.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {wh.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Supplier API Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
              {supplierItems.map((item) => {
                const calculatedRetail =
                  Math.ceil((item.supplierCostInr * markupMultiplier) / 100) * 100 - 1;
                const projectedProfit = calculatedRetail - item.supplierCostInr;

                return (
                  <div
                    key={item.supplierProductId}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-square bg-white border-b border-slate-200 overflow-hidden">
                        <ProductImage
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold">
                          {item.warehouseCountry === 'IN'
                            ? '🇮🇳 IN Warehouse'
                            : `🌍 ${item.warehouseCountry} Warehouse`}
                        </span>
                        {item.alreadyImported && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            ✓ Live on Store
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                          <span>{item.supplierProductId}</span>
                          <span className="text-emerald-700 font-bold">
                            Stock: {item.stockCount}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500">{item.supplierName}</p>
                      </div>
                    </div>

                    {/* Wholesale Cost vs Retail Price Breakdown */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                        <div className="flex justify-between text-slate-500">
                          <span>Supplier API Cost:</span>
                          <strong className="text-slate-800">
                            ₹{item.supplierCostInr} (${item.supplierCostUsd})
                          </strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span>Auto Retail ({markupMultiplier.toFixed(1)}x):</span>
                          <strong className="text-indigo-600">₹{calculatedRetail}</strong>
                        </div>
                        <div className="flex justify-between text-emerald-700 border-t border-slate-100 pt-1">
                          <span>Profit / Sale:</span>
                          <strong>+₹{projectedProfit}</strong>
                        </div>
                      </div>

                      <button
                        onClick={() => handleImportSupplierProduct(item)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                          item.alreadyImported
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>
                          {item.alreadyImported
                            ? `Update Price (₹${calculatedRetail})`
                            : '1-Click Import via API'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED ORDER ROUTING & FULFILLMENT LEDGER */}
      {activeTab === 'ORDERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Customer Orders & Automated Supplier Dispatch
              </h2>
              <p className="text-xs text-slate-500">
                Every paid order is automatically forwarded to the supplier API with the customer&apos;s shipping address.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-3 px-3">Order</th>
                  <th className="py-3 px-3">Customer & Region</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Retail Paid</th>
                  <th className="py-3 px-3">Supplier Cost</th>
                  <th className="py-3 px-3">Net Profit</th>
                  <th className="py-3 px-3">Supplier API & Courier Tracking</th>
                  <th className="py-3 px-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">
                      {ord.orderNumber}
                      {ord.referralCodeUsed && (
                        <span className="block text-[10px] text-indigo-600 font-semibold">
                          Ref: {ord.referralCodeUsed}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-slate-800 block">{ord.customerName}</span>
                      <span className="text-xs text-slate-500">
                        {ord.city}, {ord.state} ({ord.country})
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold">
                      ₹{ord.totalAmountInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      ₹{ord.supplierCostTotalInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-emerald-600">
                      +₹{ord.netProfitInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono text-xs font-bold text-slate-800 block">
                        API: {ord.supplierOrderId}
                      </span>
                      <span className="font-mono text-[11px] text-indigo-600 block">
                        AWB: {ord.trackingNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Link
                        href={`/track?orderNumber=${ord.orderNumber}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-indigo-600"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Track</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INFLUENCER REFERRALS & WHATSAPP CART RECOVERY */}
      {activeTab === 'MARKETING' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Influencer & Creator Referral Manager */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Influencer Reels & Affiliate Referral Links
              </h2>
              <p className="text-xs text-slate-500">
                Create custom links for Instagram Reels / YouTube Shorts creators. Automatically gives shoppers a discount and tracks creator commission.
              </p>
            </div>

            <form
              onSubmit={handleCreateAffiliate}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200"
            >
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="Code (e.g. REELS15)"
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <input
                type="text"
                required
                value={newInfluencer}
                onChange={(e) => setNewInfluencer(e.target.value)}
                placeholder="Creator Name"
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              />
              <select
                value={newPlatform}
                onChange={(e) =>
                  setNewPlatform(
                    e.target.value as
                      | 'Instagram Reels'
                      | 'YouTube Shorts'
                      | 'Customer Referral'
                  )
                }
                className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
              >
                <option value="Instagram Reels">Instagram Reels</option>
                <option value="YouTube Shorts">YouTube Shorts</option>
                <option value="Customer Referral">Customer Referral</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                + Create Link
              </button>
            </form>

            <div className="space-y-3">
              {affiliates.map((aff) => {
                const shareUrl = `${
                  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                }/?ref=${aff.code}`;
                return (
                  <div
                    key={aff.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm text-indigo-600">
                          {aff.code}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          • {aff.influencerName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {aff.platform}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Shopper Discount: <strong>{aff.discountPercent}% OFF</strong> • Creator Commission:{' '}
                        <strong>{aff.commissionPercent}%</strong> • Clicks: <strong>{aff.clicks}</strong> • Orders:{' '}
                        <strong>{aff.totalOrders}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Earned: ₹{aff.totalEarningsInr.toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          showToast(`Copied referral URL: ${shareUrl}`);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 1-Click WhatsApp Abandoned Cart Recovery */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                1-Click WhatsApp Cart Recovery
              </h2>
              <p className="text-xs text-slate-500">
                Recover 25–30% of lost sales by sending a pre-filled WhatsApp discount link to shoppers who left checkout.
              </p>
            </div>

            <div className="space-y-3">
              {abandonedCarts.map((cart) => {
                const message = encodeURIComponent(
                  `Hi ${cart.customerName}! 👋 We noticed you left *${cart.itemsSummary}* in your cart at ${
                    config?.storeName || 'our store'
                  }. Use code *${cart.recoveryDiscountCode}* for an instant *10% OFF + Free Express Delivery* right now!`
                );
                const whatsappUrl = `https://wa.me/${cart.customerPhone}?text=${message}`;

                return (
                  <div
                    key={cart.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        {cart.customerName} ({cart.country})
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">
                        ₹{cart.cartTotalInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{cart.itemsSummary}</p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        +{cart.customerPhone} • {cart.createdAt}
                      </span>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp Offer</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WHITE-LABEL NICHE & BRAND CUSTOMIZER */}
      {activeTab === 'NICHE_CONFIG' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 1-Click Niche Presets */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900">
              1-Click Storefront Niche Presets
            </h2>
            <p className="text-xs text-slate-500">
              Instantly transform your storefront&apos;s brand name, hero copy, color palette, and announcement bar.
            </p>

            <div className="space-y-3">
              {[
                {
                  key: 'smart-desk' as NicheKey,
                  title: '⚡ VOLT & VERVE — Smart Desk & Tech Gadgets',
                  desc: 'High-converting dark/indigo aesthetic for GaN chargers, MagSafe docks, and workspace gear.'
                },
                {
                  key: 'home-decor' as NicheKey,
                  title: '✨ LUMINA CASA — Minimalist Home & Ambient Decor',
                  desc: 'Warm architectural palette for levitating lamps, flame aroma diffusers, and bedroom lighting.'
                },
                {
                  key: 'travel-edc' as NicheKey,
                  title: '🌍 NOMAD CORE — Everyday Carry & Travel Gear',
                  desc: 'Rugged emerald/slate theme for carbon anti-theft sling bags and portable espresso makers.'
                }
              ].map((preset) => (
                <div
                  key={preset.key}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between gap-4 ${
                    config?.nichePreset === preset.key
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{preset.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{preset.desc}</p>
                  </div>
                  <button
                    onClick={() => handleSwitchNichePreset(preset.key)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shrink-0"
                  >
                    Activate Preset
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Custom Brand Editor */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900">
              Custom Brand & Announcement Editor
            </h2>
            <form onSubmit={handleSaveCustomBranding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand / Storefront Name
                </label>
                <input
                  type="text"
                  value={customStoreName}
                  onChange={(e) => setCustomStoreName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Tagline (Header Subtitle)
                </label>
                <input
                  type="text"
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Top Announcement Bar Offer Text
                </label>
                <input
                  type="text"
                  value={customAnnouncement}
                  onChange={(e) => setCustomAnnouncement(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm"
              >
                Save Custom Store Branding
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

