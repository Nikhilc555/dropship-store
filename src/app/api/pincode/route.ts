import { NextResponse } from 'next/server';
import { checkIndiaPincodeServiceability } from '@/lib/suppliers/shiprocket';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode') || '';
  const result = checkIndiaPincodeServiceability(pincode);
  return NextResponse.json(result);
}

