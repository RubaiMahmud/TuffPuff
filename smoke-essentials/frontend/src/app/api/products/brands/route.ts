import { NextResponse } from 'next/server';
import prisma from '@/server/db';

export async function GET() {
  try {
    const brands = await prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });

    return NextResponse.json({ success: true, data: brands.map((b: { brand: string }) => b.brand) });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
