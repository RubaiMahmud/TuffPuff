import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, brand, minPrice, maxPrice, search, page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as Record<string, any>;

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

    res.json({
      success: true,
      data: products,
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

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function getSimilarProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id as string } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const similar = await prisma.product.findMany({
      where: {
        isActive: true,
        id: { not: product.id },
        OR: [
          { category: product.category },
          { brand: product.brand },
        ],
      },
      take: 6,
    });

    res.json({ success: true, data: similar });
  } catch (error) {
    next(error);
  }
}

export async function getBrands(req: Request, res: Response, next: NextFunction) {
  try {
    const brands = await prisma.product.findMany({
      where: { isActive: true },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });

    res.json({ success: true, data: brands.map((b: { brand: string }) => b.brand) });
  } catch (error) {
    next(error);
  }
}

export async function getCategories(_req: Request, res: Response) {
  const categories = ['CIGARETTES', 'LIGHTERS', 'ROLLING_PAPERS', 'BEVERAGES', 'SNACKS', 'ESSENTIALS'];
  res.json({ success: true, data: categories });
}

// ---- Admin Product CRUD ----

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: req.body,
    });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.product.update({
      where: { id: req.params.id as string },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Product deactivated' });
  } catch (error) {
    next(error);
  }
}
