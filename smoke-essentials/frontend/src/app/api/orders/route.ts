import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAuth } from '@/server/auth';
import { createOrderSchema } from '@/server/schemas';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { addressId, deliveryNotes, items } = parsed.data;
    const userId = authResult.userId;

    const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

    if (products.length !== productIds.length) {
      return NextResponse.json({ success: false, error: 'One or more products not found or inactive' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p: any) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });

    const deliveryFee = totalAmount >= 50 ? 0 : 4.99;
    const discount = 0;
    const finalAmount = totalAmount + deliveryFee - discount;

    const order = await prisma.$transaction(async (tx: any) => {
      const createdOrder = await tx.order.create({
        data: {
          userId, addressId, totalAmount, deliveryFee, discount, finalAmount, deliveryNotes,
          estimatedDelivery: '30-45 minutes',
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } }, address: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { status, page = '1', limit = '20' } = searchParams;

    const where: any = { userId: authResult.userId };
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } }, address: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
