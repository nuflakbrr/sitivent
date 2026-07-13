import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Metadata, Route } from 'next';
import Link from 'next/link';
import GalleryGrid from './_components/GalleryGrid';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: 'Galeri Foto - SITIVENT',
  description:
    'Lihat dokumentasi foto keseruan dan kenangan indah dari event-event teknologi terbaik kami.',
};

export default async function PublicGalleryPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const where = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
            { event: { title: { contains: q, mode: 'insensitive' as const } } },
          ],
        }
      : {}),
  };

  const galleries = await prisma.gallery.findMany({
    where,
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
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-28 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      {/* Header Banner */}
      <div className="py-12 border-b" style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}>
        <div className="container mx-auto px-4 max-w-6xl text-center space-y-6">
          <div className="space-y-2">
            <h1
              className="tracking-tight"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#141413',
              }}
            >
              Galeri Foto Event
            </h1>
            <p
              className="max-w-xl mx-auto font-medium text-sm md:text-base"
              style={{ color: '#87867F' }}
            >
              Kumpulan dokumentasi momen keseruan dan kemeriahan event-event yang diselenggarakan.
            </p>
          </div>

          <form action="/gallery" method="get" className="flex max-w-md gap-2 mx-auto relative">
            <div className="relative flex-1">
              <Input
                name="q"
                type="text"
                placeholder="Cari momen atau judul foto..."
                defaultValue={q || ''}
                className="w-full pl-10 h-11 rounded-xl shadow-xs"
                style={{ borderColor: '#D1CFC5', background: '#FFFFFF' }}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              type="submit"
              className="h-11 px-6 rounded-xl font-semibold text-white"
              style={{ background: '#D97757' }}
            >
              Cari
            </Button>
          </form>
        </div>
      </div>

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
                {q
                  ? `Tidak ada dokumentasi foto yang cocok dengan pencarian "${q}".`
                  : 'Saat ini belum ada dokumentasi foto yang ditambahkan.'}
              </EmptyDescription>
            </EmptyHeader>
            {q && (
              <Button asChild className="mt-4 text-white" style={{ background: '#D97757' }}>
                <Link href={'/gallery' as Route}>Lihat Semua Foto</Link>
              </Button>
            )}
          </Empty>
        ) : (
          <GalleryGrid initialItems={mapped} />
        )}
      </div>
    </section>
  );
}
