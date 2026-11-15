'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Gift, X, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WelcomePopup() {
  const { applyReferralOrCoupon, referralCode } = useStore();
  const [open, setOpen] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('welcome_popup_seen');
    if (!alreadySeen && !referralCode) {
      const timer = setTimeout(() => setOpen(true), 4500);
      return () => clearTimeout(timer);
    }
  }, [referralCode]);

  if (!open) return null;

  const handleClose = () => {
    sessionStorage.setItem('welcome_popup_seen', '1');
    setOpen(false);
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    await applyReferralOrCoupon('WELCOME10');
    sessionStorage.setItem('welcome_popup_seen', '1');
    setClaimed(true);
    setTimeout(() => setOpen(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {claimed ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">10% OFF Activated!</h3>
            <p className="text-sm text-slate-600">
              Code <code className="font-bold text-indigo-600">WELCOME10</code> has been automatically applied to your cart.
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                <Sparkles className="w-3.5 h-3.5" /> First-Order VIP Offer
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Unlock 10% OFF + Free Express Delivery
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Enter your WhatsApp number or email to receive instant order tracking & unlock your 10% welcome discount.
              </p>
            </div>
            <input
              type="text"
              required
              value={phoneOrEmail}
              onChange={(e) => setPhoneOrEmail(e.target.value)}
              placeholder="Enter WhatsApp (+91...) or Email"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              Apply 10% OFF Instantly (WELCOME10)
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600"
            >
              No thanks, I&apos;ll pay full price
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

