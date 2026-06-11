import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/admin/trips/[id] - Update trip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, image, type, duration, price, isActive, displayOrder } = body;

    // Update trip
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        name,
        description,
        image,
        type,
        duration,
        isActive,
        displayOrder,
      },
    });

    // Update price if provided
    if (price !== undefined) {
      await prisma.tripPrice.deleteMany({
        where: { tripId: id },
      });
      await prisma.tripPrice.create({
        data: {
          tripId: id,
          price,
        },
      });
    }

    // Fetch updated trip with prices
    const updatedTrip = await prisma.trip.findUnique({
      where: { id },
      include: { prices: true },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error('Failed to update trip:', error);
    return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 });
  }
}

// DELETE /api/admin/trips/[id] - Delete trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json({ error: 'Failed to delete trip' }, { status: 500 });
  }
}