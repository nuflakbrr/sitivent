'use client';
import { useState, useEffect, useRef, useCallback, type FC } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calendar, Tag } from 'lucide-react';
import type { Gallery } from '@/interfaces/features/galleries';

interface GalleryGridProps {
  initialItems: Gallery[];
}

const GalleryGrid: FC<GalleryGridProps> = ({ initialItems }) => {
  const [items, setItems] = useState<Gallery[]>(initialItems);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(initialItems.length === 8);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  const observerRef = useRef<HTMLDivElement>(null);

  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/gallery?page=${nextPage}&limit=8`);
      const json = await res.json();
      if (json.success && json.data) {
        const newItems = json.data;
        if (newItems.length < 8) {
          setHasMore(false);
        }
        setItems((prev) => [...prev, ...newItems]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, page, loading, loadNextPage]);

  const getBentoSpans = (index: number) => {
    const patterns = [
      'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 h-[240px] sm:h-[300px] md:h-full',
      'col-span-1 md:col-span-1 md:row-span-1 h-[200px] md:h-full',
      'col-span-1 md:col-span-1 md:row-span-2 h-[220px] md:h-full',
      'col-span-1 md:col-span-1 md:row-span-1 h-[200px] md:h-full',
      'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1 h-[200px] md:h-full',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2 md:auto-rows-45">
        {items.map((item, idx) => (
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

      {/* Infinite Scroll Trigger Indicator */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center items-center py-10 mt-6">
          <div
            className="w-6 h-6 border-2 border-t-transparent animate-spin rounded-full"
            style={{ borderColor: '#D97757', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent
          className="w-[calc(100vw-2rem)] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl p-0 overflow-hidden rounded-2xl border-none shadow-xl max-h-[90vh]"
          style={{ background: '#FFFFFF' }}
        >
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
              {/* Image side - Huge, centered display */}
              <div className="relative w-full md:flex-1 bg-zinc-950 min-h-55 sm:min-h-75 md:h-137.5 flex items-center justify-center shrink-0">
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
                className="w-full md:w-80 p-5 sm:p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l shrink-0 overflow-y-auto"
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
