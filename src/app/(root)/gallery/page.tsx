import { prisma } from '@/lib/prisma';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Metadata } from 'next';
import GalleryHeader from './_components/GalleryHeader';
import GalleryGrid from './_components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Galeri Foto - SITIVENT',
  description:
    'Lihat dokumentasi foto keseruan dan kenangan indah dari event-event teknologi terbaik kami.',
};

export default async function PublicGalleryPage() {
  // 1. Fetch data from DB (Clean database query concern)
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
  });

  // 2. Map data to client schema
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

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      {/* SOLID: Extracted Gallery Header component */}
      <GalleryHeader />

      {/* Grid Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {mapped.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Foto Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                Saat ini belum ada dokumentasi foto yang ditambahkan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <GalleryGrid initialItems={mapped} />
        )}
      </div>
    </section>
  );
}
