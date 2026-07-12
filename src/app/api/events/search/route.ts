import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@/generated/prisma/enums';
import type { EventSearchResult, EventSearchResponse } from '@/interfaces/features/events';

export async function GET(request: Request): Promise<NextResponse<EventSearchResponse>> {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const limit = Math.min(Number(searchParams.get('limit') ?? '5'), 10);

  if (q.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const events = await prisma.event.findMany({
    where: {
      status: EventStatus.PUBLISHED,
      deletedAt: null,
      title: { contains: q, mode: 'insensitive' },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      banner: true,
      startDate: true,
      eventType: true,
    },
    orderBy: { startDate: 'asc' },
    take: limit,
  });

  const data: EventSearchResult[] = events.map((e) => ({
    ...e,
    startDate: e.startDate.toISOString(),
  }));

  return NextResponse.json({ data });
}
