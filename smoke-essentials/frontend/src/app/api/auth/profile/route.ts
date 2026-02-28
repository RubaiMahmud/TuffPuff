import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAuth } from '@/server/auth';
import { updateProfileSchema } from '@/server/schemas';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const user = await prisma.user.findUnique({
    where: { id: authResult.userId },
    select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: user });
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
  }

  const { name, phone } = parsed.data;
  const user = await prisma.user.update({
    where: { id: authResult.userId },
    data: { ...(name && { name }), ...(phone && { phone }) },
    select: { id: true, name: true, email: true, phone: true, role: true, ageVerified: true, termsAccepted: true, createdAt: true, updatedAt: true },
  });

  return NextResponse.json({ success: true, data: user });
}
