import { NextRequest, NextResponse } from 'next/server';
import { firebaseAdmin } from './firebase-admin';
import prisma from './db';

export interface AuthUser {
  userId: string;
  role: string;
}

/**
 * Verifies the Firebase token from the Authorization header and returns the authenticated user.
 * Returns null if no token or token is invalid.
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) return null;

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: decodedToken.uid },
          { email: decodedToken.email },
        ],
      },
    });

    if (!user) return null;

    return { userId: user.id, role: user.role };
  } catch {
    return null;
  }
}

/**
 * Helper to require authentication — returns a 401 response if not authenticated.
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | NextResponse> {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }
  return user;
}

/**
 * Helper to require admin role — returns a 403 response if not admin.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | NextResponse> {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  if (authResult.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }
  return authResult;
}
