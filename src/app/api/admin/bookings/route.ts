import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/bookings - List all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const where: { type?: string; status?: string } = {};
    if (type && type !== 'all') where.type = type;
    if (status && status !== 'all') where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        ship: true,
        course: true,
        trip: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}