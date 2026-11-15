import { NextResponse } from 'next/server';
import { readDb, writeDb, NICHE_PRESETS, calculateRetailPriceInr } from '@/lib/db';
import { NicheKey } from '@/lib/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    config: db.config,
    products: db.products,
    affiliates: db.affiliates,
    abandonedCarts: db.abandonedCarts,
    nichePresets: NICHE_PRESETS
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const db = readDb();

  if (body.nichePreset && NICHE_PRESETS[body.nichePreset as NicheKey]) {
    const presetKey = body.nichePreset as NicheKey;
    const preset = NICHE_PRESETS[presetKey];
    db.config.nichePreset = presetKey;
    db.config.storeName = body.storeName || preset.storeName;
    db.config.tagline = preset.tagline;
    db.config.heroBadge = preset.heroBadge;
    db.config.heroTitle = preset.heroTitle;
    db.config.heroSubtitle = preset.heroSubtitle;
    db.config.primaryColor = preset.primaryColor;
    db.config.announcementText = preset.announcementText;
  }

  if (typeof body.storeName === 'string' && !body.nichePreset) {
    db.config.storeName = body.storeName;
  }
  if (typeof body.tagline === 'string') {
    db.config.tagline = body.tagline;
  }
  if (typeof body.announcementText === 'string') {
    db.config.announcementText = body.announcementText;
  }
  if (typeof body.defaultMarkupMultiplier === 'number') {
    db.config.defaultMarkupMultiplier = body.defaultMarkupMultiplier;
    // Automatically recalculate retail prices across catalog if requested
    if (body.recalculatePrices) {
      db.products = db.products.map((p) => {
        const { retailPriceInr, compareAtPriceInr } = calculateRetailPriceInr(
          p.supplierCostInr,
          body.defaultMarkupMultiplier
        );
        return { ...p, retailPriceInr, compareAtPriceInr };
      });
    }
  }
  if (typeof body.autoFulfillOrders === 'boolean') {
    db.config.autoFulfillOrders = body.autoFulfillOrders;
  }
  if (typeof body.cjApiKey === 'string') {
    db.config.cjApiKey = body.cjApiKey.trim();
    db.config.apiMode = db.config.cjApiKey.length > 10 ? 'LIVE_CJ_API' : 'SANDBOX_SIMULATOR';
  }

  writeDb(db);
  return NextResponse.json({ success: true, config: db.config, products: db.products });
}

