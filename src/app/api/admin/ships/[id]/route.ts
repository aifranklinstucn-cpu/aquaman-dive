import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/admin/ships/[id] - Update ship
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image, facilities, isActive, displayOrder, cabins } = body;

    // Update ship
    const ship = await prisma.ship.update({
      where: { id },
      data: {
        name,
        description,
        image,
        facilities,
        isActive,
        displayOrder,
      },
    });

    // If cabins are provided, update them
    if (cabins) {
      // Delete existing cabins
      await prisma.cabin.deleteMany({
        where: { shipId: id },
      });

      // Create new cabins
      for (let i = 0; i < cabins.length; i++) {
        const cabin = cabins[i];
        await prisma.cabin.create({
          data: {
            shipId: id,
            name: cabin.name,
            description: cabin.description || null,
            maxGuests: cabin.maxGuests || 2,
            displayOrder: i,
          },
        });
      }
    }

    // Fetch updated ship with cabins
    const updatedShip = await prisma.ship.findUnique({
      where: { id },
      include: { cabins: true },
    });

    return NextResponse.json(updatedShip);
  } catch (error) {
    console.error('Failed to update ship:', error);
    return NextResponse.json({ error: 'Failed to update ship' }, { status: 500 });
  }
}

// DELETE /api/admin/ships/[id] - Delete ship
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.ship.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete ship:', error);
    return NextResponse.json({ error: 'Failed to delete ship' }, { status: 500 });
  }
}