# India-First & Global Automated Dropshipping Web App (`dropship-store`)

A white-label, niche-customizable dropshipping e-commerce storefront and automation platform built with **Next.js (App Router)**, **Tailwind CSS**, and **Prisma / Local JSON Database**.

## Key Features Included

1. **Zero-Touch Live Supplier API Integration (`/admin`):**
   - Built-in **CJdropshipping REST API v2** client ([cj-api.ts](file:///d:/Projects/dropship-store/src/lib/suppliers/cj-api.ts)) supporting **India Warehouses (`IN`)**, **US Warehouses (`US`)**, and **Global Warehouses (`CN`)**.
   - **Auto-Pricing Markup Engine:** Set your retail multiplier (`1.5x` – `4.0x` supplier wholesale cost) and import or sync all products with 1 click.
   - **Automated Order Forwarding:** Paid customer orders are automatically dispatched to the supplier API (`createOrderV2`) with live tracking generation.
2. **India-First + Global Multi-Currency Storefront (`/`):**
   - Switch between **🇮🇳 INR `₹`** (UPI / Razorpay with ₹100 instant prepaid discount + Verified India COD) and **🌍 USD `$`** (Stripe Global Checkout).
   - **Shiprocket India Pincode Estimator** ([shiprocket.ts](file:///d:/Projects/dropship-store/src/lib/suppliers/shiprocket.ts)) for instant city/state detection and 2–5 day delivery estimates.
3. **Built-In Customer Acquisition & Marketing Engine:**
   - **Influencer & Reels Referral System (`?ref=CODE`):** Create custom links for Instagram Reels & YouTube Shorts creators (`?ref=TECHBURNER10`), auto-apply shopper discounts, and track creator affiliate commissions.
   - **1-Click WhatsApp Abandoned Cart Recovery:** Send pre-filled WhatsApp discount reminders to shoppers who leave checkout.
   - **Programmatic Google Shopping JSON-LD Schema** on every product page (`/product/[slug]`).
4. **Live Customer Order Tracking Portal (`/track`):**
   - Real-time 5-stage visual shipment progress for India (`ORD-1042`) and Global (`ORD-1043`) orders.

## Quick Start

```bash
cd d:\Projects\dropship-store
npm.cmd run dev
```

Then open `http://localhost:3000` in your browser.

