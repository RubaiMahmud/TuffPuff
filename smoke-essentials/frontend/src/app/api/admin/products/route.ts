import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAdmin } from '@/server/auth';
import { createProductSchema } from '@/server/schemas';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { page = '1', limit = '50' } = searchParams;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({ orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
