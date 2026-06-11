import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/admin/courses/[id] - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { code, name, description, image, duration, maxStudents, price, isActive, displayOrder } = body;

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: {
        name,
        description,
        image,
        duration,
        maxStudents,
        isActive,
        displayOrder,
      },
    });

    // Update price if provided
    if (price !== undefined) {
      await prisma.coursePrice.deleteMany({
        where: { courseId: id },
      });
      await prisma.coursePrice.create({
        data: {
          courseId: id,
          price,
        },
      });
    }

    // Fetch updated course with prices
    const updatedCourse = await prisma.course.findUnique({
      where: { id },
      include: { prices: true },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Failed to update course:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

// DELETE /api/admin/courses/[id] - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}