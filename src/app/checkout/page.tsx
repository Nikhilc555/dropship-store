'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ProductImage from '@/components/ProductImage';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Truck,
  ArrowRight,
  CreditCard,
  Banknote,
  Lock,
  MessageSquare
} from 'lucide-react';
import { Order } from '@/lib/types';

export default function CheckoutPage() {
  const {
    cart,
    cartSubtotalInr,
    formatPrice,
    region,
    setRegion,
    referralCode,
    discountPercent,
    clearCart,
    refreshStore
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState<'IN' | 'US' | 'UK' | 'AE' | 'CA'>(
    region === 'IN' ? 'IN' : 'US'
  );
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI_RAZORPAY' | 'COD_INDIA' | 'CARD_STRIPE'
  >(region === 'IN' ? 'UPI_RAZORPAY' : 'CARD_STRIPE');

  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [abandonedSaved, setAbandonedSaved] = useState(false);

  const handlePincodeBlur = async () => {
    if (country === 'IN' && pincode.length === 6) {
      const res = await fetch(`/api/pincode?pincode=${pincode}`);
      const data = await res.json();
      if (data.serviceable) {
        if (!city) setCity(data.city);
        if (!state) setState(data.state);
      }
    }
  };

  const referralDiscountInr = Math.round((cartSubtotalInr * discountPercent) / 100);
  const upiPrepaidDiscountInr =
    country === 'IN' && paymentMethod === 'UPI_RAZORPAY' ? 100 : 0;
  const totalDiscountInr = referralDiscountInr + upiPrepaidDiscountInr;
  const codFeeInr = country === 'IN' && paymentMethod === 'COD_INDIA' ? 49 : 0;
  const finalTotalInr = Math.max(0, cartSubtotalInr - totalDiscountInr + codFeeInr);

  const handleSaveAbandonedCart = async () => {
    if (!customerPhone && !customerEmail) return;
    await fetch('/api/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'SAVE_ABANDONED_CART',
        customerName: customerName || 'Checkout Visitor',
        customerPhone: customerPhone || '919800000000',
        customerEmail,
        country,
        itemsSummary: cart.map((c) => `${c.product.title} (x${c.quantity})`).join(', '),
        cartTotalInr: finalTotalInr
      })
    });
    setAbandonedSaved(true);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          shippingAddress,
          city,
          state,
          pincode,
          country,
          currency: country === 'IN' ? 'INR' : 'USD',
          paymentMethod,
          discountInr: totalDiscountInr,
          shippingInr: codFeeInr,
          referralCodeUsed: referralCode || undefined,
          items: cart.map((c) => ({
            productId: c.product.id,
            title: c.product.title,
            sku: c.product.supplierSku,
            image: c.product.image,
            quantity: c.quantity,
            unitPriceInr: c.product.retailPriceInr,
            supplierCostInr: c.product.supplierCostInr,
            supplierName: c.product.supplierName
          }))
        })
      });
      const data = await res.json();
      if (data.order) {
        setCompletedOrder(data.order);
        clearCart();
        await refreshStore();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              Order Confirmed & Dispatched to Supplier API
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thank You, {completedOrder.customerName}!
            </h1>
            <p className="text-sm text-slate-600">
              Your order <strong>{completedOrder.orderNumber}</strong> has been automatically routed to the supplier warehouse for fulfillment.
            </p>
          </div>

          {/* Live Automated API Dispatch Summary */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between text-xs text-indigo-300 font-bold uppercase tracking-wider">
              <span>Zero-Touch Supplier API Fulfillment Log</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {completedOrder.fulfillmentStatus}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block">Supplier API Order ID</span>
                <strong className="font-mono text-sm text-white">
                  {completedOrder.supplierOrderId}
                </strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block">Courier Partner</span>
                <strong className="text-sm text-white">{completedOrder.courierName}</strong>
              </div>
              <div className="bg-white/5 p-3 rounded-xl">
                <span className="text-slate-400 block">Live Tracking Number</span>
                <strong className="font-mono text-sm text-emerald-400">
                  {completedOrder.trackingNumber}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/track?orderNumber=${completedOrder.orderNumber}`}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Order ({completedOrder.orderNumber})</span>
            </Link>
            <Link
              href="/admin"
              className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
            >
              View Profit & Supplier Dispatch in Admin →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">
          Add a product from the catalog to test the India (UPI/COD) or Global (Stripe) checkout flow.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Express Encrypted Checkout
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Orders are automatically routed to our India or Global warehouse upon completion.
          </p>
        </div>

        {/* Region Toggle */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold self-start">
          <button
            type="button"
            onClick={() => {
              setRegion('IN');
              setCountry('IN');
              setPaymentMethod('UPI_RAZORPAY');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              country === 'IN' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            🇮🇳 India Checkout (UPI / COD)
          </button>
          <button
            type="button"
            onClick={() => {
              setRegion('GLOBAL');
              setCountry('US');
              setPaymentMethod('CARD_STRIPE');
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              country !== 'IN' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            🌍 Global Checkout (USD / Stripe)
          </button>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Contact Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                1. Contact & WhatsApp Updates
              </h2>
              <button
                type="button"
                onClick={handleSaveAbandonedCart}
                className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {abandonedSaved
                  ? '✓ Logged to Admin Abandoned Carts!'
                  : 'Simulate Abandoned Cart Lead'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={country === 'IN' ? 'Rohit Verma' : 'Alex Johnson'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={country === 'IN' ? '+91 98765 43210' : '+1 415 555 0192'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address (for Invoice & Live Tracking Link) *
              </label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900">2. Shipping Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Country / Region</label>
                <select
                  value={country}
                  onChange={(e) => {
                    const val = e.target.value as 'IN' | 'US' | 'UK' | 'AE' | 'CA';
                    setCountry(val);
                    setRegion(val === 'IN' ? 'IN' : 'GLOBAL');
                    setPaymentMethod(val === 'IN' ? 'UPI_RAZORPAY' : 'CARD_STRIPE');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="IN">🇮🇳 India (Shiprocket Express)</option>
                  <option value="US">🇺🇸 United States (USPS / CJPacket)</option>
                  <option value="UK">🇬🇧 United Kingdom (Royal Mail Line)</option>
                  <option value="AE">🇦🇪 UAE (Middle East Direct)</option>
                  <option value="CA">🇨🇦 Canada (Express Line)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {country === 'IN' ? '6-Digit Pincode *' : 'ZIP / Postal Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  onBlur={handlePincodeBlur}
                  placeholder={country === 'IN' ? '560038 (Auto-fills City/State)' : '90210'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Street Address / Flat / Landmark *
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House/Flat No., Building Name, Area/Street"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={country === 'IN' ? 'Bengaluru' : 'Los Angeles'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder={country === 'IN' ? 'Karnataka' : 'California'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Gateway */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h2 className="text-base font-extrabold text-slate-900">3. Payment Method</h2>

            {country === 'IN' ? (
              <div className="space-y-3">
                {/* Option 1: UPI / Razorpay */}
                <label
                  onClick={() => setPaymentMethod('UPI_RAZORPAY')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'UPI_RAZORPAY'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">
                        UPI (GPay, PhonePe, Paytm) / Cards via Razorpay
                      </span>
                      <span className="text-xs text-slate-500">
                        Instant priority warehouse dispatch + Extra ₹100 OFF applied
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                    SAVE ₹100
                  </span>
                </label>

                {/* Option 2: India COD */}
                <label
                  onClick={() => setPaymentMethod('COD_INDIA')}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'COD_INDIA'
                      ? 'border-indigo-600 bg-indigo-50/40'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">
                        Cash on Delivery (Pay via Cash/UPI at Doorstep)
                      </span>
                      <span className="text-xs text-slate-500">
                        Verified via Shiprocket • ₹49 COD handling fee applies
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600">+₹49</span>
                </label>
              </div>
            ) : (
              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('CARD_STRIPE')}
                  className="flex items-center justify-between p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50/40 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-sm text-slate-900 block">
                        Stripe Global Checkout (Visa, Mastercard, Amex, Apple Pay)
                      </span>
                      <span className="text-xs text-slate-500">
                        Instant automated routing to closest US/Global CJdropshipping warehouse
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">USD $</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 sticky top-24 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <ProductImage
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{product.title}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {quantity} • {product.supplierName}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatPrice(product.retailPriceInr * quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartSubtotalInr)}</span>
              </div>

              {referralDiscountInr > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Referral Code ({referralCode} - {discountPercent}%)</span>
                  <span>-{formatPrice(referralDiscountInr)}</span>
                </div>
              )}

              {upiPrepaidDiscountInr > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Instant UPI Prepaid Discount</span>
                  <span>-₹100</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Express Courier Shipping</span>
                <span className="text-emerald-600 font-bold">
                  {codFeeInr > 0 ? `+₹${codFeeInr} (COD Fee)` : 'FREE'}
                </span>
              </div>

              <div className="flex justify-between text-lg font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                <span>Total Payable</span>
                <span>{formatPrice(finalTotalInr)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Dispatching Order to Supplier API...'
                  : `Complete Order • ${formatPrice(finalTotalInr)}`}
              </span>
            </button>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Automated Supplier API Routing Active</span>
              </div>
              <p>
                Upon clicking Complete Order, the backend automatically calls the supplier API (<code className="text-indigo-600">createOrderV2</code>) and generates your live tracking number.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

