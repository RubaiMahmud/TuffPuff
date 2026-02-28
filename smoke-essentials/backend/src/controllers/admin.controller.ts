import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

// ---- Product Management ----

export async function getAllProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 50 } = req.query as Record<string, any>;
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.product.count(),
    ]);

    res.json({
      success: true,
      data: products,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
}

// ---- Order Management ----

export async function getAllOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, page = 1, limit = 20 } = req.query as Record<string, any>;
    const where: any = {};
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
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
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: req.params.id as string },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: { include: { product: true } },
        address: true,
      },
    });

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
}

// ---- User Management ----

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = 1, limit = 20 } = req.query as Record<string, any>;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true, name: true, email: true, phone: true, role: true,
          ageVerified: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: users,
      meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId as string },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
}

// ---- Dashboard Stats ----

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
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

    res.json({
      success: true,
      data: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue._sum.finalAmount || 0,
        recentOrders,
        ordersByStatus: ordersByStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count.id }), {}),
      },
    });
  } catch (error) {
    next(error);
  }
}
