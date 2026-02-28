import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { firebaseAdmin } from '../lib/firebase';

export async function syncUser(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided for sync' });
      return;
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const { name, phone, ageVerified, termsAccepted } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: decodedToken.uid },
          { email: decodedToken.email }
        ]
      }
    });

    if (existingUser) {
      if (!existingUser.firebaseUid) {
        // Link existing user to Firebase UID if they logged in via Google, etc.
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: { firebaseUid: decodedToken.uid },
          select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true }
        });
        res.json({ success: true, data: updated });
        return;
      }
      const { password: _, ...userWithoutPassword } = existingUser;
      res.json({ success: true, data: userWithoutPassword });
      return;
    }

    // Check if phone is already used by someone else
    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) {
        throw new AppError('Phone number already in use', 409);
      }
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        name: name || decodedToken.name || 'Firebase User',
        phone: phone || '',
        ageVerified: ageVerified || false,
        termsAccepted: termsAccepted || false
      },
      select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true }
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, phone } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { ...(name && { name }), ...(phone && { phone }) },
      select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

