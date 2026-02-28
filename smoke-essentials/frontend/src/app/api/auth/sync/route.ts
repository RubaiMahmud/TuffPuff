import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { firebaseAdmin } from '@/server/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided for sync' }, { status: 401 });
    }

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    const body = await request.json();
    const { name, phone, ageVerified, termsAccepted } = body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: decodedToken.uid },
          { email: decodedToken.email },
        ],
      },
    });

    if (existingUser) {
      if (!existingUser.firebaseUid) {
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: { firebaseUid: decodedToken.uid },
          select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
        });
        return NextResponse.json({ success: true, data: updated });
      }
      const { password: _, ...userWithoutPassword } = existingUser;
      return NextResponse.json({ success: true, data: userWithoutPassword });
    }

    // Check if phone is already used
    if (phone) {
      const phoneExists = await prisma.user.findFirst({ where: { phone } });
      if (phoneExists) {
        return NextResponse.json({ success: false, error: 'Phone number already in use' }, { status: 409 });
      }
    }

    // First user gets ADMIN role
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;

    const newUser = await prisma.user.create({
      data: {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        name: name || decodedToken.name || 'Firebase User',
        phone: phone || '',
        ageVerified: ageVerified || false,
        termsAccepted: termsAccepted || false,
        role: isFirstUser ? 'ADMIN' : 'USER',
      },
      select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Sync failed' }, { status: 500 });
  }
}
