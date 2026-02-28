import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export async function syncCart(req: Request, res: Response, next: NextFunction) {
  try {
    const { items } = req.body;

    // Validate all products exist and have stock
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const validatedItems = items
      .map((item: any) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          product,
          quantity: Math.min(item.quantity, product.stock),
        };
      })
      .filter(Boolean);

    // Calculate totals
    const subtotal = validatedItems.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
    const deliveryFee = subtotal >= 50 ? 0 : 4.99;

    res.json({
      success: true,
      data: {
        items: validatedItems,
        subtotal,
        deliveryFee,
        discount: 0,
        total: subtotal + deliveryFee,
      },
    });
  } catch (error) {
    next(error);
  }
}
