import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const galleries = await prisma.gallery.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      skip,
      take: limit,
    });

    const mapped = galleries.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      featured: item.featured,
      eventId: item.eventId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      event: item.event,
    }));

    return NextResponse.json({ success: true, data: mapped });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
