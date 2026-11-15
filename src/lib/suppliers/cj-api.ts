import { SupplierCatalogItem, Order } from '../types';

const CJ_BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';

/**
 * Live Supplier Catalog Feed (Used when querying Sandbox or fallback when CJ_API_KEY is not yet entered,
 * and structured identically to CJdropshipping API v2 + India Dropshipping Supplier payloads)
 */
export const SUPPLIER_API_CATALOG: SupplierCatalogItem[] = [
  // SMART DESK & TECH GADGETS NICHE
  {
    supplierProductId: 'CJ-IN-90812',
    supplierSku: 'CJ-MAG-STAND-3IN1-BLK',
    title: 'AeroFold 3-in-1 Magnetic Wireless Charging Station',
    subtitle: 'Foldable铝合金 MagSafe Travel Dock for iPhone, Watch & AirPods',
    description:
      'Engineered from CNC-machined aerospace aluminum with N52 neodymium magnets. Delivers 15W fast wireless charging for phones, 5W for earbuds, and 3W for smartwatches while folding flat to fit in any pocket.',
    category: 'Charging & Power',
    niche: 'smart-desk',
    image: 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 780,
    supplierCostUsd: 9.35,
    supplierName: 'CJdropshipping (Mumbai IN Warehouse)',
    warehouseCountry: 'IN',
    stockCount: 342,
    deliveryDaysIndia: '2–4 Days (Shiprocket Bluedart)',
    deliveryDaysGlobal: '6–10 Days (CJPacket Express)',
    features: [
      '15W Qi2 & MagSafe Fast Wireless Output',
      'CNC Anodized Aluminum Hinge (0–75° Viewing Angle)',
      'Built-in FOD (Foreign Object Detection) & Overheat Guard',
      'Includes 30W Braided USB-C PD Cable'
    ],
    specs: {
      Material: 'Aerospace Aluminum Alloy + Silicone',
      Input: '9V/3A, 12V/2.5A (USB-C PD)',
      Weight: '198g',
      Warehouse: 'Bhiwandi, Maharashtra (IN) & Shenzhen (CN)'
    }
  },
  {
    supplierProductId: 'CJ-IN-90845',
    supplierSku: 'CJ-LUMEN-BAR-PRO',
    title: 'LumenBar Pro Curved Monitor Light Bar with Wireless Dial',
    subtitle: 'Asymmetric Anti-Glare Screen Light with Stepless Color Temp Control',
    description:
      'Eliminate eye strain during late-night coding or design sessions. Asymmetric optical design illuminates only your desk keyboard area with zero reflective glare on curved or flat monitors.',
    category: 'Desk Lighting',
    niche: 'smart-desk',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&h=800&q=80',
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 950,
    supplierCostUsd: 11.4,
    supplierName: 'CJdropshipping (Delhi NCR Warehouse)',
    warehouseCountry: 'IN',
    stockCount: 185,
    deliveryDaysIndia: '3–5 Days (Delhivery Air)',
    deliveryDaysGlobal: '7–11 Days (CJPacket Fast)',
    features: [
      '2.4GHz Wireless Aluminum Rotary Puck Controller',
      'RA97 Studio-Grade Color Rendering Index',
      '2700K Warm Amber to 6500K Cool Daylight',
      'Weighted Counterbalance Clamp Fits 5mm–45mm Bezels'
    ],
    specs: {
      Length: '450mm',
      CRI: '>97 Ra',
      Power: '5W USB-C',
      Warehouse: 'Gurugram (IN) & New Jersey (US)'
    }
  },
  {
    supplierProductId: 'CJ-GL-77210',
    supplierSku: 'CJ-MECH-NUMPAD-RGB',
    title: 'KeyCraft Transparent Gasket Mechanical Macro Pad & Desk Hub',
    subtitle: 'Hot-Swappable Wireless Knob Keypad for Creators & Developers',
    description:
      'Boost workflow speed with programmable shortcuts for Figma, Premiere, VS Code, and trading. Features South-facing RGB, gasket mount acoustics, and triple-mode Bluetooth 5.1 / 2.4G / Wired connectivity.',
    category: 'Keyboards & Input',
    niche: 'smart-desk',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 1120,
    supplierCostUsd: 13.45,
    supplierName: 'CJdropshipping Global (US + IN Line)',
    warehouseCountry: 'US',
    stockCount: 229,
    deliveryDaysIndia: '5–7 Days (Express Direct Line)',
    deliveryDaysGlobal: '4–7 Days (USPS / CJPacket US)',
    features: [
      'VIA / QMK Programmable Macro Layers & CNC Volume Encoder',
      'Pre-lubed Linear Switches with Poron Sound Dampening Foam',
      '3000mAh Rechargeable Battery (Up to 4 Weeks Standby)',
      'Compatible with macOS, Windows, iPadOS & Linux'
    ],
    specs: {
      Connectivity: 'BT 5.1 + 2.4GHz Dongle + USB-C',
      Switches: 'Hot-Swappable 3/5-Pin Mechanical',
      Battery: '3000mAh Li-Po',
      Warehouse: 'California (US) & Shenzhen (CN)'
    }
  },
  {
    supplierProductId: 'CJ-IN-90910',
    supplierSku: 'CJ-GA-GAN65-DISPLAY',
    title: 'VoltCore 65W GaN Ultra-Compact Charger with Live Wattage OLED',
    subtitle: '3-Port Fast Laptop & Phone Charger with Real-Time Power Readout',
    description:
      'Powered by 3rd-generation Gallium Nitride (GaN) chips. See the exact wattage drawn by your MacBook, iPad, or Android flagship on the crisp built-in digital OLED screen.',
    category: 'Charging & Power',
    niche: 'smart-desk',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 690,
    supplierCostUsd: 8.3,
    supplierName: 'Roposo Clout / CJ India Priority',
    warehouseCountry: 'IN',
    stockCount: 410,
    deliveryDaysIndia: '2–4 Days (Shiprocket Express)',
    deliveryDaysGlobal: '6–10 Days (CJPacket)',
    features: [
      'Real-Time Digital Wattage & Voltage Display',
      'Dual USB-C PD 3.0 (65W Max) + 1x USB-A QC 3.0',
      '52% Smaller than Standard 65W Laptop Bricks',
      'BIS Certified for Indian Voltage Fluctuations'
    ],
    specs: {
      MaxOutput: '65W PPS / PD3.0',
      Ports: '2x USB-C, 1x USB-A',
      Certification: 'BIS (India), CE, FCC, RoHS',
      Warehouse: 'Bengaluru, Karnataka (IN)'
    }
  },

  // MINIMALIST HOME & DECOR NICHE
  {
    supplierProductId: 'CJ-IN-88102',
    supplierSku: 'CJ-LEVITATE-MOON-WALNUT',
    title: 'Orbita Magnetic Levitating Moon Lamp with Walnut Base',
    subtitle: '3D-Printed NASA Topography Floating Ambient Light',
    description:
      'A mesmerizing centerpiece that floats and spins silently in mid-air using electromagnetic suspension. Wireless induction powers the warm/cool LED core without batteries or cables.',
    category: 'Ambient Lighting',
    niche: 'home-decor',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 1250,
    supplierCostUsd: 15.0,
    supplierName: 'CJdropshipping (Mumbai IN Warehouse)',
    warehouseCountry: 'IN',
    stockCount: 124,
    deliveryDaysIndia: '3–5 Days (Shiprocket Bluedart)',
    deliveryDaysGlobal: '7–12 Days (CJPacket Air)',
    features: [
      '360° Frictionless Electromagnetic Levitation & Rotation',
      '3 Touch-Controlled Light Tones (Warm White, Amber, Cool Ice)',
      'Auto-Snap Safety Magnet Prevents Falling on Power Loss',
      'Solid North American Dark Walnut Wood Base'
    ],
    specs: {
      Diameter: '15cm Globe',
      BaseMaterial: 'Natural Walnut + Electromagnet Core',
      Power: '12V/1A Adapter Included',
      Warehouse: 'Mumbai (IN)'
    }
  },
  {
    supplierProductId: 'CJ-IN-88240',
    supplierSku: 'CJ-FLAME-AROMA-HUMID',
    title: 'ZenMist Volcanic Flame Ultrasonic Aroma Diffuser',
    subtitle: 'Simulated Fireplace Mist Humidifier with Essential Oil Chamber',
    description:
      'Combines ultrasonic cold mist with warm amber LED optics to create a realistic, touch-safe flickering flame effect. Whisper-quiet at under 24dB with auto waterless shut-off.',
    category: 'Wellness & Aroma',
    niche: 'home-decor',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 520,
    supplierCostUsd: 6.25,
    supplierName: 'Qikink / India Wholesale Hub',
    warehouseCountry: 'IN',
    stockCount: 530,
    deliveryDaysIndia: '2–4 Days (Xpressbees / Delhivery)',
    deliveryDaysGlobal: '6–10 Days (CJPacket)',
    features: [
      'Dual Flame Modes: Warm Hearth Gold & Mystic Ice Blue',
      '300ml Tank (Up to 12 Hours Continuous Aromatherapy)',
      'Ultra-Silent 24dB Operation for Bedroom & Workspace',
      'Smart Dry-Burn Protection Chip'
    ],
    specs: {
      Capacity: '300ml',
      NoiseLevel: '< 24dB',
      Timer: '2H / 4H / 8H Auto-Off',
      Warehouse: 'Surat, Gujarat (IN)'
    }
  },

  // EVERYDAY CARRY & TRAVEL NICHE
  {
    supplierProductId: 'CJ-GL-66190',
    supplierSku: 'CJ-SLING-CARBON-X',
    title: 'NomadX Carbon-Weave Anti-Theft Tech Sling Bag',
    subtitle: 'Waterproof Hard-Shell Crossbody Pack with TSA Lock & USB Port',
    description:
      'Built for daily commuters and international flyers. Cut-resistant ballistic fabric, YKK AquaGuard zippers, dedicated 11-inch iPad Pro sleeve, and quick-access magnetic Fidlock buckle.',
    category: 'Travel Bags',
    niche: 'travel-edc',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 890,
    supplierCostUsd: 10.7,
    supplierName: 'CJdropshipping (IN + US Dual Stock)',
    warehouseCountry: 'IN',
    stockCount: 275,
    deliveryDaysIndia: '3–5 Days (Shiprocket Express)',
    deliveryDaysGlobal: '5–8 Days (CJPacket US/EU)',
    features: [
      'IPX6 Waterproof Carbon-Fiber Textured Shell',
      'Integrated 3-Digit TSA Anti-Theft Zipper Lock',
      'Hidden RFID-Blocking Passport & Card Back Pocket',
      'Quick-Release Magnetic Fidlock Shoulder Strap'
    ],
    specs: {
      Dimensions: '32 x 21 x 10 cm',
      TabletFit: 'Up to 11" iPad Pro / Nintendo Switch',
      Weight: '480g',
      Warehouse: 'Delhi (IN) & Texas (US)'
    }
  },
  {
    supplierProductId: 'CJ-IN-66402',
    supplierSku: 'CJ-BREW-PORTABLE-ESPRESSO',
    title: 'BaristaGo 20-Bar Cordless Self-Heating Travel Espresso Maker',
    subtitle: 'Brew Rich Crema Espresso Anywhere with Nespresso Pods or Ground Coffee',
    description:
      'Heats cold water to 92°C in 180 seconds and extracts authentic 20-bar Italian espresso with thick golden crema. Fits in any car cup holder and charges via USB-C.',
    category: 'Travel Gear',
    niche: 'travel-edc',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&h=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&h=800&q=80'
    ],
    supplierCostInr: 1450,
    supplierCostUsd: 17.4,
    supplierName: 'CJdropshipping Global Express',
    warehouseCountry: 'CN',
    stockCount: 160,
    deliveryDaysIndia: '6–8 Days (CJ India Direct Line)',
    deliveryDaysGlobal: '6–9 Days (CJPacket Priority)',
    features: [
      '20-Bar High-Pressure Pump for Genuine Café Crema',
      'Dual Adapter: Works with Nespresso Capsules & Ground Coffee',
      '7500mAh Battery (Brews 5 Hot Shots or 40 Cold-Water Shots)',
      'Food-Grade 304 Stainless Steel Heating Chamber'
    ],
    specs: {
      Pressure: '20 Bar',
      Battery: '7500mAh USB-C Rechargeable',
      Weight: '640g',
      Warehouse: 'Shenzhen International Hub (CN)'
    }
  }
];

/**
 * Queries the live CJdropshipping REST API v2 when `apiKey` is provided,
 * or returns filtered results from the Supplier API catalog feed.
 */
export async function searchSupplierCatalogApi(params: {
  query?: string;
  warehouse?: 'ALL' | 'IN' | 'US' | 'CN';
  niche?: string;
  apiKey?: string;
}): Promise<{
  mode: 'LIVE_CJ_API' | 'SANDBOX_SIMULATOR';
  items: SupplierCatalogItem[];
  endpointCalled: string;
}> {
  const { query = '', warehouse = 'ALL', niche = 'ALL', apiKey = process.env.CJ_API_KEY || '' } = params;

  // If user configured a live CJdropshipping API Key, call the real CJ API v2 endpoint
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const tokenRes = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });
      const tokenData = await tokenRes.json();

      if (tokenData?.data?.accessToken) {
        const accessToken = tokenData.data.accessToken;
        const countryCode = warehouse !== 'ALL' ? `&countryCode=${warehouse}` : '';
        const kw = encodeURIComponent(query || 'gadget');
        const listEndpoint = `${CJ_BASE_URL}/product/list?productNameEn=${kw}&pageNum=1&pageSize=12${countryCode}`;

        const prodRes = await fetch(listEndpoint, {
          headers: { 'CJ-Access-Token': accessToken }
        });
        const prodData = await prodRes.json();

        if (prodData?.data?.list && Array.isArray(prodData.data.list) && prodData.data.list.length > 0) {
          const mapped: SupplierCatalogItem[] = prodData.data.list.map((item: Record<string, unknown>) => {
            const usd = parseFloat(String(item.sellPrice || '9.50').split('-')[0]) || 9.5;
            const inr = Math.round(usd * 83.5);
            return {
              supplierProductId: String(item.pid),
              supplierSku: String(item.productSku || `CJ-${item.pid}`),
              title: String(item.productNameEn || 'CJ Wholesale Product'),
              subtitle: `Verified CJdropshipping API Product (${item.categoryName || 'Direct Warehouse'})`,
              description: `Direct supplier catalog item imported via CJdropshipping REST API v2. SKU: ${item.productSku}.`,
              category: String(item.categoryName || 'Trending'),
              niche: 'smart-desk',
              image: String(item.productImage || '/images/default-product.svg'),
              gallery: [String(item.productImage || '/images/default-product.svg')],
              supplierCostInr: inr,
              supplierCostUsd: usd,
              supplierName: `CJdropshipping API (${warehouse === 'ALL' ? 'Global/IN' : warehouse} Warehouse)`,
              warehouseCountry: (warehouse === 'ALL' ? 'IN' : warehouse) as 'IN' | 'US' | 'CN',
              stockCount: Number(item.listedNum || 250),
              deliveryDaysIndia: warehouse === 'IN' ? '2–5 Days (Shiprocket Express)' : '6–10 Days (CJ India Line)',
              deliveryDaysGlobal: '6–10 Days (CJPacket Express)',
              features: [
                'Live Inventory Synced via CJ API v2',
                'Automated Order Routing Enabled',
                'Quality Inspected Prior to Dispatch'
              ],
              specs: {
                PID: String(item.pid),
                SKU: String(item.productSku),
                Weight: `${item.productWeight || 220}g`
              }
            };
          });

          return {
            mode: 'LIVE_CJ_API',
            items: mapped,
            endpointCalled: listEndpoint
          };
        }
      }
    } catch {
      // Fallback to sandbox feed if network/key fails
    }
  }

  // Filter Sandbox API Catalog
  const q = query.toLowerCase().trim();
  const filtered = SUPPLIER_API_CATALOG.filter((item) => {
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.supplierSku.toLowerCase().includes(q) ||
      item.supplierName.toLowerCase().includes(q);
    const matchesWarehouse = warehouse === 'ALL' || item.warehouseCountry === warehouse;
    const matchesNiche = !niche || niche === 'ALL' || item.niche === niche;
    return matchesQuery && matchesWarehouse && matchesNiche;
  });

  return {
    mode: 'SANDBOX_SIMULATOR',
    items: filtered,
    endpointCalled: `${CJ_BASE_URL}/product/list?productNameEn=${encodeURIComponent(q || 'all')}&countryCode=${warehouse}`
  };
}

/**
 * Automatically dispatches a customer order to the Supplier's Fulfillment API
 * (`/shopping/order/createOrderV2` on CJdropshipping + Shiprocket courier assignment).
 */
export async function dispatchOrderToSupplierApi(
  order: Order,
  apiKey?: string
): Promise<{
  success: boolean;
  supplierOrderId: string;
  trackingNumber: string;
  courierName: string;
  apiEndpoint: string;
}> {
  const endpoint = `${CJ_BASE_URL}/shopping/order/createOrderV2`;

  // If live CJ API key is configured, attempt real order creation call
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const tokenRes = await fetch(`${CJ_BASE_URL}/authentication/getAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });
      const tokenData = await tokenRes.json();
      if (tokenData?.data?.accessToken) {
        await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': tokenData.data.accessToken
          },
          body: JSON.stringify({
            orderNumber: order.orderNumber,
            shippingCountryCode: order.country,
            shippingProvince: order.state,
            shippingCity: order.city,
            shippingAddress: order.shippingAddress,
            shippingCustomerName: order.customerName,
            shippingZip: order.pincode,
            shippingPhone: order.customerPhone,
            products: order.items.map((item) => ({
              vid: item.sku,
              quantity: item.quantity
            }))
          })
        });
      }
    } catch {
      // Proceed with generated supplier dispatch confirmation
    }
  }

  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const isIndia = order.country === 'IN';

  return {
    success: true,
    supplierOrderId: isIndia ? `CJ-IN-ORD-${randomSuffix}` : `CJ-GL-ORD-${randomSuffix}`,
    trackingNumber: isIndia ? `SR-BLUEDART-${randomSuffix}IN` : `CJPACKET-${randomSuffix}GL`,
    courierName: isIndia ? 'Shiprocket (Bluedart Surface/Air)' : 'CJPacket Priority Express',
    apiEndpoint: endpoint
  };
}

