import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();

  // 1. Validate / Apply Coupon or Referral Code
  if (body.action === 'VALIDATE_CODE') {
    const code = String(body.code || '').trim().toUpperCase();
    const found = db.affiliates.find((a) => a.code.toUpperCase() === code);
    if (found) {
      found.clicks += 1;
      writeDb(db);
      return NextResponse.json({
        valid: true,
        code: found.code,
        discountPercent: found.discountPercent,
        influencerName: found.influencerName
      });
    }
    if (code === 'COMEBACK10' || code === 'UPI100') {
      return NextResponse.json({
        valid: true,
        code,
        discountPercent: 10,
        influencerName: 'Store Promotion'
      });
    }
    return NextResponse.json({ valid: false, message: 'Invalid discount or referral code' });
  }

  // 2. Create New Influencer / Affiliate Referral Partner
  if (body.action === 'CREATE_AFFILIATE') {
    const code = String(body.code || '').trim().toUpperCase();
    if (!code) {
      return NextResponse.json({ error: 'Referral code is required' }, { status: 400 });
    }
    const newAff = {
      id: `aff_${Date.now()}`,
      code,
      influencerName: body.influencerName || 'Creator Partner',
      handle: body.handle || `@${code.toLowerCase()}`,
      platform: body.platform || ('Instagram Reels' as const),
      discountPercent: Number(body.discountPercent || 10),
      commissionPercent: Number(body.commissionPercent || 15),
      clicks: 1,
      totalOrders: 0,
      totalEarningsInr: 0
    };
    db.affiliates.unshift(newAff);
    writeDb(db);
    return NextResponse.json({ success: true, affiliate: newAff, affiliates: db.affiliates });
  }

  // 3. Log Abandoned Cart from Checkout Step 1
  if (body.action === 'SAVE_ABANDONED_CART') {
    const entry = {
      id: `ab_${Date.now()}`,
      customerName: body.customerName || 'Shopper',
      customerPhone: String(body.customerPhone || '').replace(/\D/g, ''),
      customerEmail: body.customerEmail || '',
      country: body.country || 'IN',
      itemsSummary: body.itemsSummary || 'Cart Items',
      cartTotalInr: Number(body.cartTotalInr || 0),
      recoveryDiscountCode: 'COMEBACK10',
      recoveryStatus: 'PENDING' as const,
      createdAt: 'Just now'
    };
    db.abandonedCarts.unshift(entry);
    writeDb(db);
    return NextResponse.json({ success: true, abandonedCart: entry });
  }

  // 4. Mark Abandoned Cart as WhatsApp Recovery Sent
  if (body.action === 'MARK_WHATSAPP_SENT') {
    const cart = db.abandonedCarts.find((c) => c.id === body.id);
    if (cart) {
      cart.recoveryStatus = 'WHATSAPP_SENT';
      writeDb(db);
    }
    return NextResponse.json({ success: true, abandonedCarts: db.abandonedCarts });
  }

  return NextResponse.json({ error: 'Unknown marketing action' }, { status: 400 });
}

