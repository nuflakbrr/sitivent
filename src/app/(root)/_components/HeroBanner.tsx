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
  CarouselPrevious,
  CarouselNext,
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
    badge: 'Online',
    badgeColor: 'bg-emerald-400',
    from: '#1e1b4b',
    to: '#312e81',
    accent: '#818cf8',
  },
  {
    id: 2,
    eyebrow: 'Seminar Eksklusif',
    headline: 'Karier di Bidang AI: Peluang & Tantangan 2025',
    sub: 'Diskusi panel bersama engineer dari startup unicorn Indonesia.',
    cta: 'Daftar Seminar',
    href: '/events',
    badge: 'Offline · Jakarta',
    badgeColor: 'bg-blue-400',
    from: '#0c1a2e',
    to: '#0e3a5c',
    accent: '#38bdf8',
  },
  {
    id: 3,
    eyebrow: 'Bootcamp Gratis',
    headline: 'Belajar UI/UX Design Gratis Selama 30 Hari',
    sub: 'Program intensif terbuka untuk semua. Kuota terbatas, daftar sekarang.',
    cta: 'Daftar Gratis',
    href: '/events',
    badge: 'Gratis',
    badgeColor: 'bg-amber-400',
    from: '#1a1200',
    to: '#3b2800',
    accent: '#fbbf24',
  },
];

const SLIDE_HEIGHT = 'clamp(400px, 58vh, 580px)';

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
              background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
            }}
          >
            {/* Decorative glows */}
            <div
              className="absolute right-[-8%] top-[-15%] w-[50%] aspect-square rounded-full opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${s.accent} 0%, transparent 70%)` }}
            />
            <div
              className="absolute left-[30%] bottom-[-20%] w-[35%] aspect-square rounded-full opacity-10 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${s.accent} 0%, transparent 70%)` }}
            />

            {/* Slide content */}
            <div className="relative z-10 container mx-auto px-4 max-w-6xl h-full flex items-center">
              <div className="max-w-2xl space-y-5 pt-24 pb-14">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-slate-900 ${s.badgeColor}`}
                  >
                    {s.badge}
                  </span>
                  <span className="text-sm font-medium text-white/70">{s.eyebrow}</span>
                </div>

                <h1
                  className="font-extrabold text-white leading-[1.08]"
                  style={{
                    fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
                    textShadow: '0 2px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  {s.headline}
                </h1>

                <p className="text-white/70 text-base md:text-lg font-medium max-w-lg leading-relaxed">
                  {s.sub}
                </p>

                <Link
                  href={s.href as Route}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-slate-900 font-bold rounded-xl text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg"
                  style={{ background: s.accent }}
                >
                  {s.cta}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Prev / Next — override default -left-12 / -right-12 positioning to sit inside */}
      {/* <CarouselPrevious
        variant="ghost"
        className="left-4 top-1/2 border-none bg-black/30 hover:bg-black/50 text-white hover:text-white backdrop-blur-sm"
      />
      <CarouselNext
        variant="ghost"
        className="right-4 top-1/2 border-none bg-black/30 hover:bg-black/50 text-white hover:text-white backdrop-blur-sm"
      /> */}

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
              background: i === current ? slide.accent : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </Carousel>
  );
};

export default HeroBanner;
