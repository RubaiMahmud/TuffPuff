import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { productQuerySchema } from '@/server/schemas';

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = productQuerySchema.safeParse(searchParams);
    const query = parsed.success ? parsed.data : searchParams;

    const { category, brand, minPrice, maxPrice, search, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = query as Record<string, any>;

    const where: Record<string, any> = { isActive: true };
    if (category) where.category = category;
    if (brand) where.brand = { contains: brand, mode: 'insensitive' };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy as string]: sortOrder },
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
