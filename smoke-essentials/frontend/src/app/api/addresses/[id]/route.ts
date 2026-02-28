import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/db';
import { requireAuth } from '@/server/auth';
import { updateAddressSchema } from '@/server/schemas';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const userId = authResult.userId;

    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateAddressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: parsed.error.issues }, { status: 400 });
    }

    const { label, fullAddress, lat, lng, isDefault } = parsed.data;

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } });
    }

    const address = await prisma.address.update({
      where: { id },
      data: { label, fullAddress, lat, lng, isDefault },
    });

    return NextResponse.json({ success: true, data: address });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;

  try {
    const { id } = await params;
    const existing = await prisma.address.findFirst({ where: { id, userId: authResult.userId } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
