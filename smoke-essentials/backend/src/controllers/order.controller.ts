import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const { addressId, deliveryNotes, items } = req.body;
    const userId = req.user!.userId;

    // Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });
    if (!address) {
      throw new AppError('Address not found', 404);
    }

    // Fetch products and validate stock
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new AppError('One or more products not found or inactive', 400);
    }

    let totalAmount = 0;
    const orderItems = items.map((item: any) => {
      const product = products.find((p: any) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }
      const lineTotal = product.price * item.quantity;
      totalAmount += lineTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Calculate delivery fee (free over $50)
    const deliveryFee = totalAmount >= 50 ? 0 : 4.99;
    const discount = 0; // Future ready
    const finalAmount = totalAmount + deliveryFee - discount;

    // Create order and update stock in a transaction
    const order = await prisma.$transaction(async (tx: any) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          addressId,
          totalAmount,
          deliveryFee,
          discount,
          finalAmount,
          deliveryNotes,
          estimatedDelivery: '30-45 minutes',
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
          address: true,
        },
      });

      // Deduct stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { status, page = 1, limit = 20 } = req.query as Record<string, any>;

    const where: any = { userId };
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: { include: { product: true } },
          address: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: orders,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id as string, userId: req.user!.userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}
