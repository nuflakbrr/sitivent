import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import HeroBanner from './_components/HeroBanner';
import CategoryLinks from './_components/CategoryLinks';
import FeaturedEvents from './_components/FeaturedEvents';
import Features from './_components/Features';
import Stats from './_components/Stats';
import CTABanner from './_components/CTABanner';
import Steps from './_components/Steps';
import GalleryBento from './_components/GalleryBento';
import type { EventCategory } from '@/interfaces/features/event-categories';
import type { Event } from '@/interfaces/features/events';

export const metadata: Metadata = {
  title: 'SITIVENT — Platform Manajemen Event & Tiket',
  description:
    'Temukan dan daftar seminar, workshop, webinar, serta bootcamp teknologi terbaik di Indonesia. Satu platform untuk semua event.',
};

export default async function HomePage() {
  const [events, categories] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      take: 8,
      orderBy: { startDate: 'asc' },
      include: {
        category: true,
        registrations: {
          where: { status: { not: 'CANCELLED' } },
          select: { id: true },
        },
      },
    }),
    // Explicitly await categories to ensure they're not typed as any
    prisma.eventCategory
      .findMany({
        orderBy: { name: 'asc' },
      })
      .then((categories) => categories as EventCategory[]),
  ]);

  // Take minimum 3 and maximum 5 for HeroBanner, fallback if fewer
  const heroEvents = events.slice(0, 5);

  return (
    <div className="w-full">
      {heroEvents.length >= 3 && <HeroBanner events={heroEvents as Event[]} />}
      <CategoryLinks categories={categories} />
      <FeaturedEvents events={events} />
      <Stats />
      <GalleryBento />
      <Features />
      <CTABanner />
      {/* <Steps /> */}
    </div>
  );
}
