import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/trips - List all trips
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        prices: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(trips);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 });
  }
}

// POST /api/admin/trips - Create new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description, image, type, duration, price, isActive, displayOrder } = body;

    const trip = await prisma.trip.create({
      data: {
        code,
        name,
        description,
        image,
        type,
        duration,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        prices: {
          create: {
            price,
          },
        },
      },
      include: {
        prices: true,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error('Failed to create trip:', error);
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 });
  }
}