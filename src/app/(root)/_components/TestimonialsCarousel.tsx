'use client';

import { useState, useEffect, type FC } from 'react';
import Link from 'next/link';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { Testimonial } from '@/interfaces/features/testimonials';

interface Props {
  testimonials: Testimonial[];
}

const autoplayPlugin = Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true });

const TestimonialsCarousel: FC<Props> = ({ testimonials }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      id="testimoni-peserta"
      className="py-16 border-t overflow-hidden relative"
      style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest block mb-3"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                color: '#D97757',
              }}
            >
              Ulasan Peserta
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
              Apa Kata Peserta Event Kami?
            </h2>
            <p className="mt-2 text-sm max-w-xl" style={{ color: '#87867F' }}>
              Pengalaman nyata dan pesan berkesan dari para peserta yang telah mengikuti seminar,
              workshop, dan bootcamp SITIVENT.
            </p>
          </div>

          {/* Carousel Buttons */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              onClick={() => api?.scrollPrev()}
              className="p-2.5 rounded-full border border-[#D1CFC5] text-[#141413] transition-all hover:bg-[#D97757] hover:border-[#D97757] hover:text-white"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="p-2.5 rounded-full border border-[#D1CFC5] text-[#141413] transition-all hover:bg-[#D97757] hover:border-[#D97757] hover:text-white"
              aria-label="Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <Carousel
          opts={{ loop: true, align: 'start' }}
          plugins={[autoplayPlugin]}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((item) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div
                  className="h-full flex flex-col justify-between p-6 rounded-2xl border transition-all duration-300 hover:shadow-md"
                  style={{
                    background: '#FFFFFF',
                    borderColor: '#E3DACC',
                  }}
                >
                  <div className="space-y-4">
                    {/* Top row: Rating & Quote Icon */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-muted text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 opacity-20 text-[#141413]" />
                    </div>

                    {/* Ulasan text */}
                    <p className="text-sm leading-relaxed italic" style={{ color: '#3D3D3A' }}>
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  </div>

                  {/* Bottom User & Event Details */}
                  <div className="mt-6 pt-4 border-t space-y-1" style={{ borderColor: '#F0EBE1' }}>
                    <div className="flex items-center gap-3">
                      {item.user?.image ? (
                        <img
                          src={item.user.image}
                          alt={item.user.name || 'Peserta'}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border"
                          style={{ borderColor: '#E3DACC' }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs"
                          style={{ background: 'rgba(217,119,87,0.1)', color: '#D97757' }}
                        >
                          {item.user?.name ? (
                            item.user.name.charAt(0).toUpperCase()
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-[#141413] truncate">
                          {item.user?.name || 'Peserta Event'}
                        </h4>
                        {item.event && (
                          <Link
                            href={`/events/${item.event.slug}`}
                            className="text-xs truncate block hover:underline"
                            style={{ color: '#87867F' }}
                          >
                            {item.event.title}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
