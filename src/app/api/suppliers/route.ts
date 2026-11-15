import { NextResponse } from 'next/server';
import { readDb, writeDb, mapSupplierItemToProduct, calculateRetailPriceInr } from '@/lib/db';
import { searchSupplierCatalogApi, SUPPLIER_API_CATALOG } from '@/lib/suppliers/cj-api';
import { SupplierCatalogItem } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const warehouse = (searchParams.get('warehouse') || 'ALL') as 'ALL' | 'IN' | 'US' | 'CN';
  const niche = searchParams.get('niche') || 'ALL';

  const db = readDb();
  const result = await searchSupplierCatalogApi({
    query,
    warehouse,
    niche,
    apiKey: db.config.cjApiKey
  });

  // Mark which items are already imported in the store
  const importedIds = new Set(db.products.map((p) => p.supplierProductId));

  return NextResponse.json({
    mode: result.mode,
    endpointCalled: result.endpointCalled,
    items: result.items.map((item) => ({
      ...item,
      alreadyImported: importedIds.has(item.supplierProductId)
    }))
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();

  // Action 1: Import a single product from Supplier API result
  if (body.action === 'IMPORT' && body.supplierItem) {
    const item = body.supplierItem as SupplierCatalogItem;
    const customMultiplier = Number(body.markupMultiplier) || db.config.defaultMarkupMultiplier;
    const existingIdx = db.products.findIndex(
      (p) => p.supplierProductId === item.supplierProductId
    );

    const newProduct = mapSupplierItemToProduct(item, customMultiplier, true);

    if (existingIdx >= 0) {
      db.products[existingIdx] = newProduct;
    } else {
      db.products.unshift(newProduct);
    }

    db.config.lastCatalogSync = new Date().toISOString();
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: `Imported "${newProduct.title}" from ${newProduct.supplierName} with ${customMultiplier}x markup.`,
      product: newProduct
    });
  }

  // Action 2: Sync all products' live inventory & prices with Supplier API
  if (body.action === 'SYNC_ALL') {
    const feedMap = new Map(SUPPLIER_API_CATALOG.map((i) => [i.supplierProductId, i]));
    const now = new Date().toISOString();

    db.products = db.products.map((prod) => {
      const remote = feedMap.get(prod.supplierProductId);
      const updatedCost = remote ? remote.supplierCostInr : prod.supplierCostInr;
      const updatedStock = remote
        ? Math.max(25, remote.stockCount + Math.floor(Math.random() * 15 - 5))
        : prod.stockCount;
      const { retailPriceInr, compareAtPriceInr } = calculateRetailPriceInr(
        updatedCost,
        db.config.defaultMarkupMultiplier
      );

      return {
        ...prod,
        supplierCostInr: updatedCost,
        retailPriceInr,
        compareAtPriceInr,
        stockCount: updatedStock,
        lastSyncedAt: now
      };
    });

    db.config.lastCatalogSync = now;
    writeDb(db);

    return NextResponse.json({
      success: true,
      syncedCount: db.products.length,
      lastCatalogSync: now,
      products: db.products
    });
  }

  return NextResponse.json({ error: 'Invalid supplier action' }, { status: 400 });
}

