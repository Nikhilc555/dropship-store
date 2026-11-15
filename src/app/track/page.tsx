'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/lib/types';
import ProductImage from '@/components/ProductImage';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderNum = searchParams.get('orderNumber') || 'ORD-1042';

  const [query, setQuery] = useState(initialOrderNum);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async (orderNumber: string) => {
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(orderNumber.trim())}`,
        { cache: 'no-store' }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        setOrder(null);
        setError(data.error || 'Order not found');
      } else {
        setOrder(data.order);
      }
    } catch {
      setError('Failed to look up order status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder(initialOrderNum);
  }, [initialOrderNum]);

  const handleSimulateWebhookAdvance = async () => {
    if (!order) return;
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: order.orderNumber,
        action: 'ADVANCE_STAGE'
      })
    });
    const data = await res.json();
    if (data.order) {
      setOrder(data.order);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header & Search Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <Truck className="w-4 h-4" /> Real-Time Courier & Warehouse Tracking
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold">
            Track Your Order Live
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Synced automatically via Shiprocket (India Bluedart/Delhivery) & CJdropshipping Global Air webhooks. Try sample orders{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('ORD-1042');
                fetchOrder('ORD-1042');
              }}
              className="underline text-indigo-300 font-bold"
            >
              ORD-1042 (India)
            </button>{' '}
            or{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('ORD-1043');
                fetchOrder('ORD-1043');
              }}
              className="underline text-indigo-300 font-bold"
            >
              ORD-1043 (US Global)
            </button>
            .
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchOrder(query);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-slate-300 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. ORD-1042) or Tracking Number..."
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shrink-0 transition-colors"
          >
            {loading ? 'Searching...' : 'Track Shipment'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
          {/* Top Metadata Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-2xl font-extrabold text-slate-900">
                  {order.orderNumber}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                  {order.fulfillmentStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Recipient: <strong>{order.customerName}</strong> • Destination:{' '}
                <strong>
                  {order.city}, {order.state} ({order.country})
                </strong>
              </p>
            </div>

            <button
              onClick={handleSimulateWebhookAdvance}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 self-start"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Courier Webhook Update</span>
            </button>
          </div>

          {/* Courier & Supplier API Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Courier Partner
              </span>
              <span className="text-sm font-extrabold text-slate-900 mt-1 block">
                {order.courierName}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Tracking AWB Number
              </span>
              <span className="text-sm font-mono font-extrabold text-indigo-600 mt-1 block">
                {order.trackingNumber}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Supplier API Reference
              </span>
              <span className="text-sm font-mono font-bold text-slate-800 mt-1 block">
                {order.supplierOrderId}
              </span>
            </div>
          </div>

          {/* 5-Stage Visual Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
              Live Shipment Progress
            </h3>
            <div className="space-y-4 relative before:absolute before:top-4 before:bottom-4 before:left-4 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4 pl-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      step.completed
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span
                        className={`text-sm font-bold ${
                          step.completed ? 'text-slate-900' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {step.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items in Shipment */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Package className="w-4 h-4" /> Package Contents
            </h4>
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
              >
                <div className="flex items-center gap-3">
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg border border-slate-200 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity} • Dispatched from {item.supplierName}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> QC Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}

