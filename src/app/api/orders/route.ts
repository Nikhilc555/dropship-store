import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { dispatchOrderToSupplierApi } from '@/lib/suppliers/cj-api';
import { Order, OrderItem, FulfillmentStage } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const db = readDb();

  if (orderNumber) {
    const normalized = orderNumber.trim().toUpperCase();
    const found = db.orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === normalized ||
        o.trackingNumber.toUpperCase() === normalized
    );
    if (!found) {
      return NextResponse.json(
        { error: `No order found matching "${orderNumber}". Try ORD-1042 or ORD-1043.` },
        { status: 404 }
      );
    }
    return NextResponse.json({ order: found });
  }

  return NextResponse.json({ orders: db.orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const db = readDb();

  const items: OrderItem[] = body.items || [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'Order must contain at least 1 item' }, { status: 400 });
  }

  const subtotalInr = items.reduce((acc, i) => acc + i.unitPriceInr * i.quantity, 0);
  const supplierCostTotalInr = items.reduce((acc, i) => acc + i.supplierCostInr * i.quantity, 0);
  const discountInr = Number(body.discountInr || 0);
  const shippingInr = Number(body.shippingInr || 0);
  const totalAmountInr = Math.max(0, subtotalInr - discountInr + shippingInr);

  // Check referral attribution
  let affiliateCommissionInr = 0;
  const referralCodeUsed = body.referralCodeUsed ? String(body.referralCodeUsed).toUpperCase() : undefined;
  if (referralCodeUsed) {
    const aff = db.affiliates.find((a) => a.code.toUpperCase() === referralCodeUsed);
    if (aff) {
      affiliateCommissionInr = Math.round((totalAmountInr * aff.commissionPercent) / 100);
      aff.totalOrders += 1;
      aff.totalEarningsInr += affiliateCommissionInr;
    }
  }

  const netProfitInr = totalAmountInr - supplierCostTotalInr - affiliateCommissionInr;
  const nextNum = 1044 + db.orders.length;
  const orderNumber = `ORD-${nextNum}`;
  const isIndia = (body.country || 'IN') === 'IN';

  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    orderNumber,
    customerName: body.customerName || 'Valued Customer',
    customerEmail: body.customerEmail || 'customer@example.com',
    customerPhone: body.customerPhone || '+91 98000 00000',
    shippingAddress: body.shippingAddress || '12 MG Road',
    city: body.city || 'Mumbai',
    state: body.state || 'Maharashtra',
    pincode: body.pincode || '400001',
    country: body.country || 'IN',
    currency: body.currency || (isIndia ? 'INR' : 'USD'),
    items,
    subtotalInr,
    discountInr,
    shippingInr,
    totalAmountInr,
    supplierCostTotalInr,
    netProfitInr,
    paymentMethod: body.paymentMethod || (isIndia ? 'UPI_RAZORPAY' : 'CARD_STRIPE'),
    paymentStatus: body.paymentMethod === 'COD_INDIA' ? 'COD_VERIFIED' : 'PAID',
    fulfillmentStatus: 'ORDER_CONFIRMED',
    supplierOrderId: 'PENDING_DISPATCH',
    trackingNumber: 'AWAITING_COURIER',
    courierName: isIndia ? 'Shiprocket Express' : 'CJPacket Priority',
    estimatedDelivery: isIndia ? '2–4 Days' : '6–10 Days',
    referralCodeUsed,
    createdAt: new Date().toISOString(),
    timeline: [
      {
        stage: 'ORDER_CONFIRMED',
        label:
          body.paymentMethod === 'COD_INDIA'
            ? 'COD Order Confirmed & Pincode Verified'
            : `Online Payment Verified (${body.paymentMethod})`,
        timestamp: 'Just now',
        location: 'Storefront Checkout',
        completed: true
      },
      {
        stage: 'DISPATCHED_TO_SUPPLIER',
        label: 'Forwarded to Supplier Fulfillment API',
        timestamp: 'Pending',
        location: isIndia ? 'India Warehouse Hub' : 'Global Warehouse Hub',
        completed: false
      },
      {
        stage: 'PACKAGED_AT_WAREHOUSE',
        label: 'Quality Check & Courier Labeling',
        timestamp: 'Pending',
        location: isIndia ? 'Mumbai / Delhi Hub' : 'International Sort Hub',
        completed: false
      },
      {
        stage: 'IN_TRANSIT',
        label: 'Handed Over to Express Courier Partner',
        timestamp: 'Pending',
        location: body.city || 'Destination Hub',
        completed: false
      }
    ]
  };

  // Zero-Touch Automated Supplier Order Forwarding if autoFulfillOrders is ON
  if (db.config.autoFulfillOrders) {
    const dispatchResult = await dispatchOrderToSupplierApi(newOrder, db.config.cjApiKey);
    newOrder.fulfillmentStatus = 'DISPATCHED_TO_SUPPLIER';
    newOrder.supplierOrderId = dispatchResult.supplierOrderId;
    newOrder.trackingNumber = dispatchResult.trackingNumber;
    newOrder.courierName = dispatchResult.courierName;
    newOrder.timeline[1] = {
      stage: 'DISPATCHED_TO_SUPPLIER',
      label: `Auto-Dispatched via API (${dispatchResult.supplierOrderId})`,
      timestamp: 'Just now (Automated)',
      location: isIndia ? 'CJ India / Shiprocket API' : 'CJdropshipping Global API',
      completed: true
    };
  }

  // Deduct stock count
  for (const item of items) {
    const p = db.products.find((prod) => prod.id === item.productId);
    if (p) {
      p.stockCount = Math.max(0, p.stockCount - item.quantity);
    }
  }

  db.orders.unshift(newOrder);
  writeDb(db);

  return NextResponse.json({
    success: true,
    order: newOrder
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const db = readDb();
  const order = db.orders.find((o) => o.id === body.orderId || o.orderNumber === body.orderNumber);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  if (body.action === 'DISPATCH_TO_SUPPLIER') {
    const dispatchResult = await dispatchOrderToSupplierApi(order, db.config.cjApiKey);
    order.fulfillmentStatus = 'DISPATCHED_TO_SUPPLIER';
    order.supplierOrderId = dispatchResult.supplierOrderId;
    order.trackingNumber = dispatchResult.trackingNumber;
    order.courierName = dispatchResult.courierName;
    if (order.timeline[1]) {
      order.timeline[1].completed = true;
      order.timeline[1].timestamp = 'Just now';
      order.timeline[1].label = `Dispatched to Supplier API (${dispatchResult.supplierOrderId})`;
    }
  } else if (body.action === 'ADVANCE_STAGE') {
    const nextIncomplete = order.timeline.find((t) => !t.completed);
    if (nextIncomplete) {
      nextIncomplete.completed = true;
      nextIncomplete.timestamp = 'Just now (Webhook Update)';
      order.fulfillmentStatus = nextIncomplete.stage as FulfillmentStage;
    } else {
      order.fulfillmentStatus = 'DELIVERED';
    }
  }

  writeDb(db);
  return NextResponse.json({ success: true, order });
}

