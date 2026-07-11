import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import HeroBanner from './_components/HeroBanner';
import CategoryLinks from './_components/CategoryLinks';
import FeaturedEvents from './_components/FeaturedEvents';
import Features from './_components/Features';
import CTABanner from './_components/CTABanner';
import Steps from './_components/Steps';

export const metadata: Metadata = {
  title: 'SITIVENT — Platform Manajemen Event & Tiket',
  description:
    'Temukan dan daftar seminar, workshop, webinar, serta bootcamp teknologi terbaik di Indonesia. Satu platform untuk semua event.',
};

export default async function HomePage() {
  const events = await prisma.event.findMany({
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
  });

  return (
    <div className="w-full">
      <HeroBanner />
      <CategoryLinks />
      <FeaturedEvents events={events} />
      <Features />
      <CTABanner />
      {/* <Steps /> */}
    </div>
  );
}
