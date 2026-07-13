'use client';
import { useState, type FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Tag } from 'lucide-react';
import type { Gallery } from '@/interfaces/features/galleries';

interface GalleryGridProps {
  initialItems: Gallery[];
}

const GalleryGrid: FC<GalleryGridProps> = ({ initialItems }) => {
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  const getBentoSpans = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-2 h-[280px] md:h-full',
      'md:col-span-1 md:row-span-1 h-[180px] md:h-full',
      'md:col-span-1 md:row-span-2 h-[220px] md:h-full',
      'md:col-span-1 md:row-span-1 h-[180px] md:h-full',
      'md:col-span-2 md:row-span-1 h-[180px] md:h-full',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
        {initialItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`group relative overflow-hidden rounded-2xl border shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 ${getBentoSpans(idx)}`}
            style={{ borderColor: '#E3DACC', background: '#FFFFFF' }}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
            />
            {/* Hover visual cue */}
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full border bg-white text-zinc-950 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                style={{
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                  borderColor: '#E3DACC',
                }}
              >
                Lihat Detail
              </span>
            </div>
            {/* Title Overlay */}
            <div
              className="absolute bottom-0 inset-x-0 p-4 text-white opacity-90 group-hover:opacity-0 transition-opacity duration-300"
              style={{
                background:
                  'linear-gradient(to top, rgba(20, 20, 19, 0.85) 0%, rgba(20, 20, 19, 0.3) 50%, transparent 100%)',
              }}
            >
              <h3 className="text-sm font-bold truncate">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent
          className="sm:max-w-7xl p-0 overflow-hidden rounded-2xl border-none shadow-xl"
          style={{ background: '#FFFFFF' }}
        >
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Image side - Huge, centered display */}
              <div className="relative flex-1 bg-zinc-950 min-h-[300px] md:h-[600px] flex items-center justify-center">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info side - Right panel */}
              <div
                className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l shrink-0"
                style={{ borderColor: '#E3DACC', background: '#FFFFFF' }}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
                      style={{
                        fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                        background: '#F0EEE6',
                        borderColor: '#D1CFC5',
                        color: '#87867F',
                      }}
                    >
                      Dokumentasi
                    </span>
                    {selectedItem.featured && (
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border bg-amber-500/10 text-amber-600"
                        style={{
                          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                          borderColor: 'rgba(245,158,11,0.25)',
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <DialogTitle
                      className="text-xl font-bold leading-snug"
                      style={{
                        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                        color: '#141413',
                      }}
                    >
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="hidden">
                      Detail foto {selectedItem.title}
                    </DialogDescription>
                    {selectedItem.description && (
                      <p
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: '#3D3D3A' }}
                      >
                        {selectedItem.description}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className="space-y-3 pt-6 border-t mt-6 text-xs"
                  style={{ borderColor: '#E3DACC', color: '#87867F' }}
                >
                  {selectedItem.event && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 shrink-0" style={{ color: '#D97757' }} />
                      <span className="font-semibold" style={{ color: '#3D3D3A' }}>
                        {selectedItem.event.title}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: '#788C5D' }} />
                    <span>
                      {new Date(selectedItem.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
