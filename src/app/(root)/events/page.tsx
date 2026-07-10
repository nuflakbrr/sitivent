import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';
import moment from 'moment';
import 'moment/locale/id';
import { Calendar, MapPin, Clock, Users, ArrowRight, Globe, Landmark, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Metadata } from 'next';
import { Separator } from '@/components/ui/separator';

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

  const where = {
    status: 'PUBLISHED' as const,
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
    <section className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-28 pb-16">
      {/* Search Header Banner */}
      <div className="bg-linear-to-br from-blue-600/5 to-indigo-600/5 dark:from-blue-500/10 dark:to-indigo-500/10 py-12 border-b">
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Jelajahi Event Pilihan
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-medium">
              Temukan seminar, workshop, dan webinar berkualitas yang sesuai dengan minat Anda.
            </p>
          </div>

          <form action="/events" method="get" className="flex max-w-md gap-2 mx-auto relative">
            <div className="relative flex-1">
              <Input
                name="q"
                type="text"
                placeholder="Cari event atau lokasi..."
                defaultValue={q || ''}
                className="w-full pl-10 h-11 rounded-xl shadow-xs"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <Button type="submit" className="h-11 px-6 rounded-xl font-semibold">
              Cari
            </Button>
          </form>
        </div>
      </div>

      {/* Main Listing Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {events.length === 0 ? (
          <Empty className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <EmptyHeader>
              <EmptyTitle>Event Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                {q
                  ? `Tidak ada event aktif yang cocok dengan kata kunci "${q}".`
                  : 'Saat ini belum ada event aktif yang tersedia.'}
              </EmptyDescription>
            </EmptyHeader>
            {q && (
              <Button asChild className="mt-4">
                <Link href="/events">Lihat Semua Event</Link>
              </Button>
            )}
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => {
              const totalRegistered = event.registrations.length;
              const slotsLeft = Math.max(0, event.quota - totalRegistered);
              const formattedStartDate = moment(event.startDate)
                .locale('id')
                .format('DD MMMM YYYY');
              const isFree = event.price === 0;

              return (
                <Card
                  key={event.id}
                  className="group flex flex-col justify-between border-none bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Event Banner */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {event.banner ? (
                        <img
                          src={event.banner}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-4">
                          <span className="text-white font-extrabold text-2xl truncate max-w-xs text-center leading-tight">
                            {event.title}
                          </span>
                        </div>
                      )}
                      {/* Badge Top Left overlay */}
                      <Badge
                        variant="outline"
                        className={`absolute top-3 left-3 font-semibold text-[10px] px-2 py-0.5 shadow-xs border-none text-white ${
                          event.eventType === 'ONLINE' ? 'bg-emerald-500/90' : 'bg-blue-500/90'
                        }`}
                      >
                        {event.eventType === 'ONLINE' ? (
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Landmark className="h-3 w-3" /> Offline
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* Card Header Content */}
                    <div className="px-5 pt-1 space-y-3">
                      <h3 className="font-bold text-lg text-zinc-950 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {event.title}
                      </h3>

                      {/* Info details */}
                      <div className="space-y-2 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary shrink-0" />
                          <span>{formattedStartDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary shrink-0" />
                          <span>{event.startTime} WIB</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-4 space-y-4">
                    <Separator />
                    <div className="flex items-center justify-between">
                      {/* Price tag */}
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          Biaya
                        </span>
                        {isFree ? (
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">
                            Gratis
                          </span>
                        ) : (
                          <span className="font-extrabold text-zinc-900 dark:text-white text-base">
                            {formatCurrency(event.price)}
                          </span>
                        )}
                      </div>

                      {/* Quota tag */}
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          Sisa Kursi
                        </span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200 text-sm flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 opacity-60" /> {slotsLeft}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full rounded-xl font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                      asChild
                    >
                      <Link href={`/events/${event.slug}`}>
                        Detail Event{' '}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
