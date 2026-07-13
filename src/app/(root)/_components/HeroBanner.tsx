'use client';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight, CalendarDays } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { Event } from '@/interfaces/features/events';
import { EventType } from '@/generated/prisma/enums';

interface Props {
  events: Event[];
}

const SLIDE_HEIGHT = 'clamp(420px, 60vh, 600px)';

const autoplayPlugin = Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true });

const DESIGNS = [
  {
    // 1. Oren (Orange/Clay)
    bg: 'linear-gradient(135deg, #1F1510 0%, #2F1E15 100%)',
    bloom: '#D97757',
    accent: '#D97757',
  },
  {
    // 2. Hijau (Green/Olive)
    bg: 'linear-gradient(135deg, #121A15 0%, #1A281F 100%)',
    bloom: '#788C5D',
    accent: '#788C5D',
  },
  {
    // 3. Biru Cyan (Cyan/Teal)
    bg: 'linear-gradient(135deg, #0F171A 0%, #15252D 100%)',
    bloom: '#06B6D4',
    accent: '#06B6D4',
  },
  {
    // 4. Kuning (Amber/Gold)
    bg: 'linear-gradient(135deg, #1A1710 0%, #2A2415 100%)',
    bloom: '#D9A757',
    accent: '#D9A757',
  },
  {
    // 5. Merah (Rust/Crimson)
    bg: 'linear-gradient(135deg, #1E1111 0%, #2F1A1A 100%)',
    bloom: '#B04A3F',
    accent: '#B04A3F',
  },
];

const HeroBanner: FC<Props> = ({ events }) => {
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

  if (!events || events.length === 0) return null;

  const slides = events.map((e, index) => {
    const design = DESIGNS[index % DESIGNS.length];
    return {
      id: e.id,
      eyebrow: e.category?.name || 'Event Terbaru',
      headline: e.title,
      sub: e.description,
      cta: 'Lihat Event',
      href: `/events/${e.slug}`,
      tag: e.eventType === EventType.ONLINE ? 'Online' : 'Offline',
      tagColor: design.accent,
      bg: design.bg,
      bloom: design.bloom,
      accent: design.accent,
      image: e.banner || null,
    };
  });

  const slide = slides[current];

  return (
    <Carousel
      opts={{ loop: true }}
      plugins={[autoplayPlugin]}
      setApi={setApi}
      className="w-full"
      style={{ height: SLIDE_HEIGHT }}
    >
      <CarouselContent className="ml-0 h-full" style={{ height: SLIDE_HEIGHT }}>
        {slides.map((s) => (
          <CarouselItem
            key={s.id}
            className="pl-0 relative overflow-hidden"
            style={{
              height: SLIDE_HEIGHT,
              background: s.bg,
            }}
          >
            {/* Color bloom */}
            <div
              className="absolute right-[-5%] top-[-10%] w-[45%] aspect-square rounded-full opacity-30 pointer-events-none blur-3xl"
              style={{ background: `radial-gradient(circle, ${s.bloom} 0%, transparent 70%)` }}
            />
            <div
              className="absolute left-[10%] bottom-[-15%] w-[30%] aspect-square rounded-full opacity-15 pointer-events-none blur-3xl"
              style={{ background: `radial-gradient(circle, ${s.bloom} 0%, transparent 70%)` }}
            />
            {/* Warm grid */}
            <div
              className="absolute inset-0 opacity-[0.025] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #FAF9F5 1px, transparent 1px), linear-gradient(to bottom, #FAF9F5 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 max-w-6xl h-full flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full pt-28 pb-16">
                {/* Left col: texts */}
                <div
                  className={
                    s.image ? 'col-span-12 md:col-span-6 space-y-6' : 'col-span-12 space-y-6'
                  }
                >
                  {/* Eyebrow */}
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                      style={{
                        background: s.tagColor,
                        color: '#FFFFFF',
                        fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                      }}
                    >
                      {s.tag}
                    </span>
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'rgba(240,238,230,0.7)' }}
                    >
                      {s.eyebrow}
                    </span>
                  </div>

                  {/* Headline — editorial serif */}
                  <h1
                    className="leading-[1.1] tracking-tight line-clamp-2"
                    style={{
                      fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                      fontWeight: 500,
                      fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                      color: '#FAF9F5',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {s.headline}
                  </h1>

                  <div
                    className="text-sm md:text-base max-w-xl leading-relaxed line-clamp-3"
                    style={{ color: 'rgba(240,238,230,0.7)' }}
                    dangerouslySetInnerHTML={{ __html: s.sub }}
                  />

                  <div className="pt-1">
                    <Link
                      href={s.href as Route}
                      className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl text-sm transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
                      style={{
                        background: s.accent,
                        color: '#FFFFFF',
                        boxShadow: `0 8px 24px ${s.accent}55`,
                      }}
                    >
                      {s.cta}
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>

                {/* Right col: image */}
                {s.image && (
                  <div className="hidden md:block md:col-span-6 relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image src={s.image} alt={s.headline} fill priority className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              background: i === current ? slide.accent : 'rgba(240,238,230,0.3)',
            }}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default HeroBanner;
