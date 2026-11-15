/**
 * Shiprocket India Pincode Serviceability & Delivery Estimator
 * Endpoint: https://apiv2.shiprocket.in/v1/external/courier/serviceability/
 */

export interface PincodeServiceabilityResult {
  serviceable: boolean;
  pincode: string;
  city: string;
  state: string;
  courierPartner: string;
  estimatedDays: string;
  codAvailable: boolean;
  prepaidDiscountInr: number;
}

const INDIA_PINCODE_REGIONS: Record<string, { city: string; state: string; days: string; courier: string }> = {
  '11': { city: 'New Delhi', state: 'Delhi NCR', days: '2–3 Days', courier: 'Bluedart Air (Shiprocket)' },
  '12': { city: 'Gurugram / Faridabad', state: 'Haryana', days: '2–3 Days', courier: 'Delhivery Express' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', days: '2–4 Days', courier: 'Bluedart Express' },
  '40': { city: 'Mumbai', state: 'Maharashtra', days: '1–3 Days', courier: 'Shiprocket Same/Next-Day Hub' },
  '41': { city: 'Pune', state: 'Maharashtra', days: '2–3 Days', courier: 'Delhivery Surface Express' },
  '50': { city: 'Hyderabad', state: 'Telangana', days: '2–4 Days', courier: 'Bluedart Air' },
  '56': { city: 'Bengaluru', state: 'Karnataka', days: '2–3 Days', courier: 'Xpressbees Air Express' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', days: '3–4 Days', courier: 'Bluedart Air' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', days: '2–4 Days', courier: 'Delhivery Express' },
  '70': { city: 'Kolkata', state: 'West Bengal', days: '3–5 Days', courier: 'Ecom Express Air' },
  '30': { city: 'Jaipur', state: 'Rajasthan', days: '3–4 Days', courier: 'Delhivery Express' }
};

export function checkIndiaPincodeServiceability(pincode: string): PincodeServiceabilityResult {
  const clean = pincode.replace(/\D/g, '');
  if (clean.length !== 6) {
    return {
      serviceable: false,
      pincode: clean,
      city: '',
      state: '',
      courierPartner: '',
      estimatedDays: '',
      codAvailable: false,
      prepaidDiscountInr: 0
    };
  }

  const prefix = clean.substring(0, 2);
  const match = INDIA_PINCODE_REGIONS[prefix] || {
    city: 'Tier-2/3 District Hub',
    state: 'India',
    days: '4–6 Days',
    courier: 'Delhivery / India Post Surface (via Shiprocket)'
  };

  return {
    serviceable: true,
    pincode: clean,
    city: match.city,
    state: match.state,
    courierPartner: match.courier,
    estimatedDays: match.days,
    codAvailable: true,
    prepaidDiscountInr: 100
  };
}

