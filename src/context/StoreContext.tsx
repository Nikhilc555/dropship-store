'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, StoreConfig } from '@/lib/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  config: StoreConfig | null;
  products: Product[];
  loading: boolean;
  region: 'IN' | 'GLOBAL';
  setRegion: (r: 'IN' | 'GLOBAL') => void;
  formatPrice: (inrAmount: number) => string;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotalInr: number;
  referralCode: string;
  discountPercent: number;
  applyReferralOrCoupon: (code: string) => Promise<{ valid: boolean; message: string }>;
  refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<'IN' | 'GLOBAL'>('IN');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const refreshStore = useCallback(async () => {
    try {
      const res = await fetch('/api/store', { cache: 'no-store' });
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (data.products) setProducts(data.products);
    } catch (e) {
      console.error('Failed to load store data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyReferralOrCoupon = useCallback(async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { valid: false, message: 'Enter a valid code' };
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VALIDATE_CODE', code: clean })
      });
      const data = await res.json();
      if (data.valid) {
        setReferralCode(data.code);
        setDiscountPercent(data.discountPercent);
        localStorage.setItem('dropship_ref', data.code);
        return {
          valid: true,
          message: `${data.discountPercent}% OFF applied via ${data.influencerName} (${data.code})!`
        };
      }
      return { valid: false, message: data.message || 'Code not found' };
    } catch {
      return { valid: false, message: 'Could not validate code' };
    }
  }, []);

  useEffect(() => {
    refreshStore();

    // Check URL for influencer referral param (?ref=TECHBURNER10)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      const savedRef = localStorage.getItem('dropship_ref');
      if (refParam) {
        applyReferralOrCoupon(refParam);
      } else if (savedRef) {
        applyReferralOrCoupon(savedRef);
      }
    }
  }, [refreshStore, applyReferralOrCoupon]);

  const formatPrice = useCallback(
    (inrAmount: number) => {
      if (region === 'IN') {
        return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`;
      }
      const rate = config?.usdExchangeRate || 0.012;
      const usd = inrAmount * rate;
      // Psychological .99 pricing in USD
      const whole = Math.max(1, Math.floor(usd));
      return `$${whole}.99`;
    },
    [region, config]
  );

  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotalInr = cart.reduce(
    (sum, item) => sum + item.product.retailPriceInr * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        config,
        products,
        loading,
        region,
        setRegion,
        formatPrice,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotalInr,
        referralCode,
        discountPercent,
        applyReferralOrCoupon,
        refreshStore
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

