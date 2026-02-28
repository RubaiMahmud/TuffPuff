import { Request, Response, NextFunction } from 'express';
import { firebaseAdmin } from '../lib/firebase';
import prisma from '../lib/prisma';

export interface AuthUser {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    // Check if user exists in database
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: decodedToken.uid },
          { email: decodedToken.email }
        ]
      }
    });

    if (!user) {
      // User is authenticated in Firebase but not synced to SQL yet.
      res.status(401).json({ success: false, error: 'User does not exist in database. Please sync.' });
      return;
    }

    req.user = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, error: 'Admin access required' });
    return;
  }
  next();
}

// Optional auth - sets req.user if token exists, but doesn't block request
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { firebaseUid: decodedToken.uid },
            { email: decodedToken.email }
          ]
        }
      });
      if (user) {
        req.user = { userId: user.id, role: user.role };
      }
    }
  } catch {
    // Token invalid, just continue without auth
  }
  next();
}

