import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAdmin } from '@/server/auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const [totalOrders, totalUsers, totalProducts, totalRevenue, recentOrders, ordersByStatus] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.aggregate({ _sum: { finalAmount: true }, where: { status: { not: 'CANCELLED' } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
      prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        recentOrders,
        ordersByStatus: ordersByStatus.reduce((acc: any, s: any) => ({ ...acc, [s.status]: s._count.id }), {}),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
