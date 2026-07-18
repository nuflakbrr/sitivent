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
  Sparkles,
  User,
  Briefcase,
  AtSign,
  Code2,
  Link2,
  ExternalLink,
} from 'lucide-react';

import { formatCurrency } from '@/lib/formatCurrency';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { EventBenefit, EventSpeaker } from '@/interfaces/features/events';
import { getEventRegistrationStatus } from '@/services/registrations';
import RegisterButton from './_components/RegisterButton';
import type { Metadata } from 'next';
import { GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/Common/CustomIcons';

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
      speakers: {
        orderBy: { order: 'asc' },
      },
      benefits: {
        orderBy: { order: 'asc' },
      },
      createdBy: {
        select: {
          name: true,
          image: true,
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
    <article className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans antialiased pt-28 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Eyebrow Breadcrumb */}
        <div className="mb-4">
          <p
            className="text-[10px] font-bold uppercase tracking-widest font-mono"
            style={{ color: '#D97757' }}
          >
            Jelajahi · Detail Event
          </p>
        </div>

        {/* Banner Area */}
        <div
          className="relative w-full aspect-video md:aspect-3/1 rounded-3xl overflow-hidden border shadow-xs mb-8"
          style={{ borderColor: '#D1CFC5' }}
        >
          {event.banner ? (
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#141413] text-center p-8">
              <span
                className="text-[10px] font-bold uppercase tracking-widest font-mono mb-3"
                style={{ color: '#D97757' }}
              >
                SITIVENT · EVENT
              </span>
              <h1
                className="font-serif text-2xl md:text-4xl font-bold leading-tight max-w-2xl"
                style={{ color: '#FAF9F5' }}
              >
                {event.title}
              </h1>
            </div>
          )}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="outline"
              className="font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-xs border"
              style={
                event.eventType === 'ONLINE'
                  ? {
                      backgroundColor: 'rgba(120, 140, 93, 0.08)',
                      borderColor: 'rgba(120, 140, 93, 0.3)',
                      color: '#788C5D',
                    }
                  : {
                      backgroundColor: 'rgba(217, 119, 87, 0.08)',
                      borderColor: 'rgba(217, 119, 87, 0.3)',
                      color: '#D97757',
                    }
              }
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
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Title & Description (col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#141413] leading-tight">
                {event.title}
              </h1>
              <div
                className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-mono uppercase tracking-wider"
                style={{ color: '#87867F' }}
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 shrink-0" style={{ color: '#D97757' }} />{' '}
                  {formattedStartDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 shrink-0" style={{ color: '#D97757' }} />{' '}
                  {event.startTime} - {event.endTime} WIB
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" style={{ color: '#D97757' }} />
                  <span className="line-clamp-1">{event.location}</span>
                </span>
              </div>
            </div>

            <Separator style={{ backgroundColor: '#E3DACC' }} />

            {/* Description HTML content */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#141413]">Detail Event</h2>
              <div
                className="prose max-w-none text-[#3D3D3A] leading-relaxed min-h-[150px] focus:outline-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            {/* Benefits Section */}
            {event.benefits.length > 0 && (
              <div className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-[#141413]">Benefit Event</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.benefits.map((benefit, idx) => (
                    <div
                      key={benefit.id || idx}
                      className="flex items-start gap-3 p-4 rounded-xl border bg-white"
                      style={{ borderColor: '#E3DACC' }}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: '#D97757' }}
                      >
                        {benefit.icon ? (
                          <span className="text-base">{benefit.icon}</span>
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-[#141413]">{benefit.title}</p>
                        {benefit.description && (
                          <p className="text-xs text-[#87867F] leading-relaxed">
                            {benefit.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Registration (col-span-1) */}
          <div className="sticky top-20 self-start lg:col-span-1 space-y-4">
            <Card
              className="py-0 border shadow-xs bg-white overflow-hidden rounded-2xl"
              style={{ borderColor: '#D1CFC5' }}
            >
              <CardContent className="p-6 space-y-6">
                {/* Price block */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#87867F] font-mono uppercase tracking-widest">
                    Biaya Pendaftaran
                  </span>
                  <div className="flex items-baseline gap-1">
                    {isFree ? (
                      <span className="text-3xl font-serif font-bold text-[#788C5D]">Gratis</span>
                    ) : (
                      <span className="text-3xl font-serif font-bold text-[#141413]">
                        {formatCurrency(event.price)}
                      </span>
                    )}
                  </div>
                </div>

                <Separator style={{ backgroundColor: '#E3DACC' }} />

                {/* Key stats details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                    <span className="text-[#87867F] flex items-center gap-1.5">
                      <Users className="h-4 w-4" style={{ color: '#D97757' }} /> Sisa Kuota
                    </span>
                    <span className="font-bold text-[#141413]">
                      {slotsLeft} / {event.quota} Kursi
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                    <span className="text-[#87867F] flex items-center gap-1.5">
                      <Clock className="h-4 w-4" style={{ color: '#D97757' }} /> Batas Pendaftaran
                    </span>
                    <span className="font-bold text-[#141413] text-right">{formattedDeadline}</span>
                  </div>
                </div>

                {/* Register Action Button */}
                <div className="pt-2">
                  {event.status !== 'PUBLISHED' ? (
                    <Button
                      disabled
                      className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
                      style={{
                        backgroundColor: '#87867F',
                        color: '#FAF9F5',
                      }}
                    >
                      <BadgeAlert className="h-5 w-5" /> Pendaftaran Ditutup
                    </Button>
                  ) : (
                    <RegisterButton
                      eventId={event.id}
                      isAuthenticated={isAuthenticated}
                      isEmailVerified={session?.user?.emailVerified ?? false}
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

            {/* Creator Card */}
            {event.createdBy && (
              <Card
                className="py-0 border shadow-xs bg-white overflow-hidden rounded-2xl"
                style={{ borderColor: '#D1CFC5' }}
              >
                <CardContent className="p-6 space-y-3">
                  <span className="text-[10px] font-bold text-[#87867F] font-mono uppercase tracking-widest">
                    Diselenggarakan Oleh
                  </span>
                  <div className="flex mt-2 items-center gap-3">
                    {event.createdBy.image ? (
                      <img
                        src={event.createdBy.image}
                        alt={event.createdBy.name || 'Penyelenggara'}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-11 w-11 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(217, 119, 87, 0.1)', color: '#D97757' }}
                      >
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <p className="font-semibold text-sm text-[#141413]">
                      {event.createdBy.name || 'SITIVENT'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Speakers Card */}
            {event.speakers.length > 0 && (
              <Card
                className="py-0 border shadow-xs bg-white overflow-hidden rounded-2xl"
                style={{ borderColor: '#D1CFC5' }}
              >
                <CardContent className="p-6 space-y-4">
                  <span className="text-[10px] font-bold text-[#87867F] font-mono uppercase tracking-widest">
                    Pemateri
                  </span>
                  <div className="space-y-4 mt-2">
                    {event.speakers.map((speaker, idx) => (
                      <div key={speaker.id || idx} className="flex gap-3">
                        {speaker.avatar ? (
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="h-12 w-12 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div
                            className="h-12 w-12 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: 'rgba(120, 140, 93, 0.1)', color: '#788C5D' }}
                          >
                            <User className="h-5 w-5" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-sm text-[#141413]">{speaker.name}</p>
                          {speaker.title && (
                            <p className="text-xs text-[#87867F] flex items-center gap-1">
                              <Briefcase className="h-3 w-3" /> {speaker.title}
                            </p>
                          )}
                          {speaker.company && (
                            <div className="flex items-center gap-1">
                              <Landmark className="h-3 w-3" />{' '}
                              {speaker.companyUrl ? (
                                <a
                                  href={speaker.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#87867F] hover:text-[#D97757] hover:underline flex items-center gap-0.5 text-[11px]"
                                >
                                  {speaker.company}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <p className="text-xs ">{speaker.company}</p>
                              )}
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {speaker.github && (
                              <a
                                href={speaker.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#141413] hover:underline flex items-center gap-0.5 text-[11px]"
                              >
                                <GitHubIcon className="w-3 h-3" /> GitHub
                              </a>
                            )}
                            {speaker.instagram && (
                              <a
                                href={speaker.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#D97757] hover:underline flex items-center gap-0.5 text-[11px]"
                              >
                                <InstagramIcon className="h-3 w-3" /> Instagram
                              </a>
                            )}
                            {speaker.linkedIn && (
                              <a
                                href={speaker.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#1D4ED8] hover:underline flex items-center gap-0.5 text-[11px]"
                              >
                                <LinkedInIcon className="h-3 w-3" /> LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
