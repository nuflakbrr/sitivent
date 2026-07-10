import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import moment from 'moment';
import 'moment/locale/id';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ShieldCheck,
  Tag,
  Globe,
  Landmark,
  BadgeAlert,
} from 'lucide-react';

import { formatCurrency } from '@/lib/formatCurrency';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getEventRegistrationStatus } from '@/services/registrations';
import RegisterButton from './_components/RegisterButton';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findFirst({
    where: { slug, deletedAt: null },
  });

  if (!event) {
    return {
      title: 'Event Tidak Ditemukan - SITIVENT',
    };
  }

  return {
    title: `${event.title} - SITIVENT`,
    description: event.description.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;

  // Retrieve event details
  const event = await prisma.event.findFirst({
    where: { slug, deletedAt: null },
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

  if (!event) {
    return notFound();
  }

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!(session && session.user);
  let isRegistered = false;
  let registrationStatus: string | null = null;

  if (isAuthenticated && session?.user?.id) {
    const reg = await getEventRegistrationStatus(event.id);
    if (reg) {
      isRegistered = true;
      registrationStatus = reg.status;
    }
  }

  const totalRegistered = event.registrations.length;
  const slotsLeft = Math.max(0, event.quota - totalRegistered);
  const isQuotaFull = slotsLeft <= 0;
  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFree = event.price === 0;

  const formattedStartDate = moment(event.startDate).locale('id').format('DD MMMM YYYY');
  const formattedDeadline = moment(event.registrationDeadline)
    .locale('id')
    .format('DD MMMM YYYY, HH:mm');

  return (
    <article className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Banner Area */}
        <div className="relative w-full aspect-video md:aspect-3/1 rounded-3xl overflow-hidden border shadow-lg bg-muted mb-8">
          {event.banner ? (
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6">
              <h1 className="text-3xl md:text-5xl font-extrabold text-center leading-tight max-w-2xl">
                {event.title}
              </h1>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="outline"
              className={`font-semibold text-xs px-3 py-1 shadow-sm ${
                event.eventType === 'ONLINE'
                  ? 'bg-emerald-500/90 text-white border-emerald-400'
                  : 'bg-blue-500/90 text-white border-blue-400'
              }`}
            >
              {event.eventType === 'ONLINE' ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Landmark className="h-3.5 w-3.5" /> Offline
                </span>
              )}
            </Badge>

            <Badge
              variant="outline"
              className={`font-semibold text-xs px-3 py-1 shadow-sm ${
                event.status === 'PUBLISHED'
                  ? 'bg-emerald-500/90 text-white border-emerald-400'
                  : event.status === 'CLOSED'
                    ? 'bg-rose-500/90 text-white border-rose-400'
                    : event.status === 'COMPLETED'
                      ? 'bg-blue-500/90 text-white border-blue-400'
                      : 'bg-zinc-500/90 text-white border-zinc-400'
              }`}
            >
              {event.status}
            </Badge>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Title & Description (col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> {formattedStartDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> {event.startTime} - {event.endTime} WIB
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="line-clamp-1">{event.location}</span>
                </span>
              </div>
            </div>

            <Separator />

            {/* Description HTML content */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Detail Event</h2>
              <div
                className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed min-h-[150px] focus:outline-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </div>

          {/* Right Column: Pricing & Registration (col-span-1) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 border-none shadow-md bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-6 space-y-6">
                {/* Price block */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Biaya Pendaftaran
                  </span>
                  <div className="flex items-baseline gap-1">
                    {isFree ? (
                      <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        Gratis
                      </span>
                    ) : (
                      <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                        {formatCurrency(event.price)}
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Key stats details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="h-4 w-4" /> Sisa Kuota
                    </span>
                    <span className="font-bold text-foreground">
                      {slotsLeft} / {event.quota} Kursi
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> Batas Pendaftaran
                    </span>
                    <span className="font-bold text-foreground text-right">
                      {formattedDeadline}
                    </span>
                  </div>

                  {event.certificateEnabled && (
                    <div className="flex items-center justify-between text-sm border-t pt-3">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" /> Sertifikat
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Tersedia (e-Certificate)
                      </span>
                    </div>
                  )}
                </div>

                {/* Register Action Button */}
                <div className="pt-2">
                  {event.status !== 'PUBLISHED' ? (
                    <Button
                      disabled
                      className="w-full py-6 text-base font-semibold flex items-center justify-center gap-2"
                    >
                      <BadgeAlert className="h-5 w-5" /> Pendaftaran Ditutup
                    </Button>
                  ) : (
                    <RegisterButton
                      eventId={event.id}
                      isAuthenticated={isAuthenticated}
                      isRegistered={isRegistered}
                      registrationStatus={registrationStatus}
                      isDeadlinePassed={isDeadlinePassed}
                      isQuotaFull={isQuotaFull}
                      price={event.price}
                      slug={event.slug}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </article>
  );
}
