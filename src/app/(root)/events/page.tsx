import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import moment from 'moment';
import 'moment/locale/id';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchBanner from './_components/SearchBanner';
import EventCard from './_components/EventCard';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: 'Jelajahi Event - SITIVENT',
  description:
    'Temukan seminar, workshop, webinar, dan bootcamp terbaik untuk meningkatkan keahlian Anda.',
};

export default async function EventsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  // 1. Define DB Filter criteria (Clean query builder)
  const where = {
    status: {
      in: ['PUBLISHED' as const, 'CLOSED' as const, 'COMPLETED' as const],
    },
    deletedAt: null,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { location: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  // 2. Fetch data (Single query database call)
  const events = await prisma.event.findMany({
    where,
    orderBy: {
      startDate: 'asc',
    },
    include: {
      registrations: {
        where: {
          status: {
            not: 'CANCELLED',
          },
        },
      },
    },
  });

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      {/* SOLID: Extracted Header/Hero Banner component */}
      <Suspense
        fallback={
          <div style={{ background: '#141413' }} className="py-28 px-6 text-center">
            <div className="animate-pulse space-y-4 max-w-md mx-auto">
              <div className="h-4 bg-zinc-800 rounded w-1/4 mx-auto" />
              <div className="h-8 bg-zinc-800 rounded w-3/4 mx-auto" />
              <div className="h-4 bg-zinc-800 rounded w-full mx-auto" />
            </div>
          </div>
        }
      >
        <SearchBanner />
      </Suspense>

      {/* Main Listing Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {events.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Event Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                {q
                  ? `Tidak ada event aktif yang cocok dengan kata kunci "${q}".`
                  : 'Saat ini belum ada event aktif yang tersedia.'}
              </EmptyDescription>
            </EmptyHeader>
            {q && (
              <Button asChild className="mt-4 text-white" style={{ background: '#D97757' }}>
                <Link href="/events">Lihat Semua Event</Link>
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => {
              const formattedStartDate = moment(event.startDate)
                .locale('id')
                .format('DD MMMM YYYY');

              return (
                /* SOLID: Extracted Single Event Card component */
                <EventCard key={event.id} event={event} formattedStartDate={formattedStartDate} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
