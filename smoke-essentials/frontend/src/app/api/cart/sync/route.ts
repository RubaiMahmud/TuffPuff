import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { getAuthUser } from '@/server/auth';
import { syncCartSchema } from '@/server/schemas';

export async function POST(request: NextRequest) {
  // Optional auth — cart works for guests too
  await getAuthUser(request);

  try {
    const body = await request.json();
    const parsed = syncCartSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { items } = parsed.data;

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const validatedItems = items
      .map((item) => {
        const product = products.find((p: any) => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          product,
          quantity: Math.min(item.quantity, product.stock),
        };
      })
      .filter(Boolean);

    const subtotal = validatedItems.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = subtotal >= 50 ? 0 : 4.99;

    return NextResponse.json({
      success: true,
      data: {
        items: validatedItems,
        subtotal,
        deliveryFee,
        discount: 0,
        total: subtotal + deliveryFee,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
