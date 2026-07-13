import { type FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import type { Route } from 'next';

const GalleryBento: FC = async () => {
  const galleries = await prisma.gallery.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  if (galleries.length === 0) return null;

  // Pattern layout bento untuk 5 item
  const getBentoSpans = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-2 h-[280px] md:h-full', // Item 1 (Utama, besar)
      'md:col-span-1 md:row-span-1 h-[180px] md:h-full', // Item 2 (Kecil)
      'md:col-span-1 md:row-span-2 h-[220px] md:h-full', // Item 3 (Vertikal tinggi)
      'md:col-span-1 md:row-span-1 h-[180px] md:h-full', // Item 4 (Kecil)
      'md:col-span-2 md:row-span-1 h-[180px] md:h-full', // Item 5 (Lebar mendatar)
    ];
    return patterns[index % patterns.length];
  };

  return (
    <section
      id="galeri-unggulan"
      className="py-16 border-t"
      style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest block mb-3"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                color: '#87867F',
              }}
            >
              Dokumentasi Kegiatan
            </span>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                color: '#141413',
                letterSpacing: '-0.01em',
              }}
            >
              Kilas Balik Kemeriahan Event
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#87867F' }}>
              Momen-momen terbaik dan antusiasme peserta yang tertangkap kamera dalam berbagai
              kegiatan kami.
            </p>
          </div>
          <Link
            href={'/gallery' as Route}
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
            style={{ color: '#D97757' }}
          >
            Lihat Galeri Lengkap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {galleries.map((item, idx) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border shadow-xs transition-all duration-300 hover:shadow-md ${getBentoSpans(idx)}`}
              style={{ borderColor: '#E3DACC', background: '#FFFFFF' }}
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              />
              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(to top, rgba(20, 20, 19, 0.85) 0%, rgba(20, 20, 19, 0.3) 50%, transparent 100%)',
                }}
              />

              {/* Title & Description Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end text-white">
                <span
                  className="text-[9px] font-bold tracking-wider uppercase opacity-75 mb-1"
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    color: '#E3DACC',
                  }}
                >
                  Dokumentasi
                </span>
                <h3 className="text-sm font-bold line-clamp-1 leading-snug">{item.title}</h3>
                {item.description && (
                  <p className="text-xs text-zinc-300 line-clamp-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-sm">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryBento;
