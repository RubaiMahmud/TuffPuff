import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAdmin } from '@/server/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { userId } = await params;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
