import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAuth } from '@/server/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const order = await prisma.order.findFirst({
      where: { id, userId: authResult.userId },
      include: { items: { include: { product: true } }, address: true },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
