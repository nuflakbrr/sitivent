'use client';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { ChevronRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const slides = [
  {
    id: 1,
    eyebrow: 'Workshop Terbaru',
    headline: 'Kuasai Next.js 15 dari Nol hingga Deploy',
    sub: 'Intensif 2 hari bersama praktisi industri. Sertifikat resmi tersedia.',
    cta: 'Lihat Workshop',
    href: '/events',
    tag: 'Online',
    tagColor: '#788C5D',
    // Warm dark with clay bloom
    bg: 'linear-gradient(135deg, #1A1410 0%, #2A1E14 100%)',
    bloom: '#D97757',
    accent: '#D97757',
  },
  {
    id: 2,
    eyebrow: 'Seminar Eksklusif',
    headline: 'Karier di Bidang AI: Peluang & Tantangan 2025',
    sub: 'Diskusi panel bersama engineer dari startup unicorn Indonesia.',
    cta: 'Daftar Seminar',
    href: '/events',
    tag: 'Offline · Jakarta',
    tagColor: '#3D3D3A',
    // Deep slate with olive bloom
    bg: 'linear-gradient(135deg, #141413 0%, #1F1E1B 100%)',
    bloom: '#788C5D',
    accent: '#788C5D',
  },
  {
    id: 3,
    eyebrow: 'Bootcamp Gratis',
    headline: 'Belajar UI/UX Design Gratis Selama 30 Hari',
    sub: 'Program intensif terbuka untuk semua. Kuota terbatas, daftar sekarang.',
    cta: 'Daftar Gratis',
    href: '/events',
    tag: 'Gratis',
    tagColor: '#D97757',
    // Warm ivory tone with rust bloom
    bg: 'linear-gradient(135deg, #1E1814 0%, #2C1F15 100%)',
    bloom: '#B04A3F',
    accent: '#D97757',
  },
];

const SLIDE_HEIGHT = 'clamp(420px, 60vh, 600px)';

const autoplayPlugin = Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true });

const HeroBanner: FC = () => {
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
              <div className="max-w-2xl space-y-6 pt-28 pb-16">
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
                  className="leading-[1.1] tracking-tight"
                  style={{
                    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                    fontWeight: 500,
                    fontSize: 'clamp(1.9rem, 4.5vw, 3.25rem)',
                    color: '#FAF9F5',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {s.headline}
                </h1>

                <p
                  className="text-base md:text-lg max-w-xl leading-relaxed"
                  style={{ color: 'rgba(240,238,230,0.7)' }}
                >
                  {s.sub}
                </p>

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
