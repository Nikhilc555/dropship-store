import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import WelcomePopup from '@/components/WelcomePopup';

export const metadata: Metadata = {
  title: 'VOLT & VERVE | India & Global Automated Dropshipping Storefront',
  description:
    'Next-Gen customizable e-commerce storefront powered by live CJdropshipping & Shiprocket API fulfillment for India (INR/UPI/COD) and Global (USD/Stripe) shoppers.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <StoreProvider>
          <Navbar />
          <CartDrawer />
          <WelcomePopup />
          <main className="flex-1">{children}</main>
          <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold">India-First & Global Automated Dropshipping Storefront</p>
                <p className="text-xs text-slate-400 mt-1">
                  Powered by Live Supplier Catalog APIs (CJdropshipping v2 + Shiprocket India Express) • Multi-Currency (INR ₹ / USD $)
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">UPI / Razorpay Ready</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">India COD Verified</span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300">Global Stripe Ready</span>
              </div>
            </div>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}

