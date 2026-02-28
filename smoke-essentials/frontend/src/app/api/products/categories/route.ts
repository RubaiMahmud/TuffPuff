import { NextResponse } from 'next/server';

export async function GET() {
  const categories = ['CIGARETTES', 'LIGHTERS', 'ROLLING_PAPERS', 'BEVERAGES', 'SNACKS', 'ESSENTIALS'];
  return NextResponse.json({ success: true, data: categories });
}
