import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/ships - List all ships
export async function GET() {
  try {
    const ships = await prisma.ship.findMany({
      include: {
        cabins: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(ships);
  } catch (error) {
    console.error('Failed to fetch ships:', error);
    return NextResponse.json({ error: 'Failed to fetch ships' }, { status: 500 });
  }
}

// POST /api/admin/ships - Create new ship
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, facilities, isActive, displayOrder, cabins } = body;

    const ship = await prisma.ship.create({
      data: {
        name,
        description,
        image,
        facilities,
        isActive: isActive ?? true,
        displayOrder: displayOrder ?? 0,
        cabins: {
          create: cabins?.map((cabin: { name: string; maxGuests?: number; description?: string }, index: number) => ({
            name: cabin.name,
            description: cabin.description,
            maxGuests: cabin.maxGuests ?? 2,
            displayOrder: index,
          })) || [],
        },
      },
      include: {
        cabins: true,
      },
    });

    return NextResponse.json(ship, { status: 201 });
  } catch (error) {
    console.error('Failed to create ship:', error);
    return NextResponse.json({ error: 'Failed to create ship' }, { status: 500 });
  }
}