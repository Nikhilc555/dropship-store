'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import ProductImage from '@/components/ProductImage';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Tag,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotalInr,
    formatPrice,
    region,
    referralCode,
    discountPercent,
    applyReferralOrCoupon
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const discountAmountInr = Math.round((cartSubtotalInr * discountPercent) / 100);
  const finalTotalInr = Math.max(0, cartSubtotalInr - discountAmountInr);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await applyReferralOrCoupon(couponInput);
    setCouponFeedback(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping + UPI Incentive Banner */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-2.5 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            {region === 'IN' ? (
              <span>
                🎉 You unlocked <strong>FREE Express Shiprocket Delivery</strong> + Extra{' '}
                <strong>₹100 OFF on UPI Checkout!</strong>
              </span>
            ) : (
              <span>
                🌍 You unlocked <strong>Priority International Tracked Shipping!</strong>
              </span>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <p className="text-slate-700 font-semibold">Your cart is currently empty</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our direct-from-warehouse products with express India & Global delivery.
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 rounded-lg bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Warehouse: {product.warehouseCountry} • SKU: {product.supplierSku}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(product.retailPriceInr * quantity)}
                      </span>
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Coupon + Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              {/* Influencer / Referral Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  Creator Referral or Discount Code (Try: <code className="text-indigo-600">TECHBURNER10</code> or <code className="text-indigo-600">WELCOME10</code>)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={referralCode || 'Enter code...'}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <p className="text-xs font-medium text-indigo-600">{couponFeedback}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-sm border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotalInr)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Referral Discount ({referralCode} - {discountPercent}%)</span>
                    <span>-{formatPrice(discountAmountInr)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Express Tracked Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span>{formatPrice(finalTotalInr)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <span>
                  {region === 'IN'
                    ? 'Proceed to Checkout (UPI / Cards / COD)'
                    : 'Proceed to Global Checkout (Stripe / Cards)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>7-Day Easy Replacement Guarantee • Direct Automated Dispatch</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

