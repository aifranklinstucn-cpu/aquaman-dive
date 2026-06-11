import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/courses - List all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        prices: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/admin/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description, image, duration, maxStudents, price, isActive, displayOrder } = body;

    const course = await prisma.course.create({
      data: {
        code,
        name,
        description,
        image,
        duration,
        maxStudents: maxStudents ?? 4,
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

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Failed to create course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}