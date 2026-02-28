import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const { label, fullAddress, lat, lng, isDefault } = req.body;
    const userId = req.user!.userId;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: { userId, label, fullAddress, lat, lng, isDefault: isDefault || false },
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const { label, fullAddress, lat, lng, isDefault } = req.body;
    const userId = req.user!.userId;

    // Check ownership
    const existing = await prisma.address.findFirst({
      where: { id: req.params.id as string, userId },
    });
    if (!existing) {
      throw new AppError('Address not found', 404);
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id: req.params.id as string },
      data: { label, fullAddress, lat, lng, isDefault },
    });

    res.json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    const existing = await prisma.address.findFirst({
      where: { id: req.params.id as string, userId: req.user!.userId },
    });
    if (!existing) {
      throw new AppError('Address not found', 404);
    }

    await prisma.address.delete({ where: { id: req.params.id as string } });
    res.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
}
