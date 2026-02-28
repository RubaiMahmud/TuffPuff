import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAuth } from '@/server/auth';
import { createAddressSchema } from '@/server/schemas';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  const addresses = await prisma.address.findMany({
    where: { userId: authResult.userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ success: true, data: addresses });
}

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const body = await request.json();
    const parsed = createAddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { label, fullAddress, lat, lng, isDefault } = parsed.data;
    const userId = authResult.userId;

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    const address = await prisma.address.create({
      data: { userId, label, fullAddress, lat, lng, isDefault: isDefault || false },
    });

    return NextResponse.json({ success: true, data: address }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
