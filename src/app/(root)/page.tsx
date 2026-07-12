import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import HeroBanner from './_components/HeroBanner';
import CategoryLinks from './_components/CategoryLinks';
import FeaturedEvents from './_components/FeaturedEvents';
import Features from './_components/Features';
import CTABanner from './_components/CTABanner';
import Steps from './_components/Steps';
import type { EventCategory } from '@/interfaces/features/event-categories';

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
        registrations: {
          where: { status: { not: 'CANCELLED' } },
          select: { id: true },
        },
      },
    }),
    prisma.eventCategory.findMany({
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="w-full">
      <HeroBanner />
      <CategoryLinks categories={categories as EventCategory[]} />
      <FeaturedEvents events={events} />
      <Features />
      <CTABanner />
      {/* <Steps /> */}
    </div>
  );
}
