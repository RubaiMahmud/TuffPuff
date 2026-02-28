import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const similar = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { category: product.category },
          { brand: product.brand },
        ],
      },
      take: 6,
    });

    return NextResponse.json({ success: true, data: similar });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
