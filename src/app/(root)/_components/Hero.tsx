'use client';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Route } from 'next';

const eventTypes = ['Seminar', 'Workshop', 'Webinar', 'Bootcamp', 'Talk Show'];

const Hero: FC = () => {
  const [currentType, setCurrentType] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentType((prev) => (prev + 1) % eventTypes.length);
        setVisible(true);
      }, 300);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20"
      style={{ background: '#FAF9F5' }}
    >
      {/* Warm background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] w-[45%] h-[55%] rounded-full opacity-40 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #D97757 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[40%] rounded-full opacity-30 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #788C5D 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[50%] left-[40%] w-[20%] h-[25%] rounded-full opacity-20 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #E3DACC 0%, transparent 70%)' }}
        />
        {/* Subtle warm grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #141413 1px, transparent 1px), linear-gradient(to bottom, #141413 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Live event ticker badge */}
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(217,119,87,0.08)',
              borderColor: 'rgba(217,119,87,0.25)',
            }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#D97757' }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: '#D97757' }}
              />
            </span>
            <span className="text-sm font-medium" style={{ color: '#3D3D3A' }}>
              Tersedia:{' '}
              <span
                className="font-bold transition-all duration-300"
                style={{
                  color: '#D97757',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(-6px)',
                  display: 'inline-block',
                }}
              >
                {eventTypes[currentType]}
              </span>
            </span>
          </div>

          {/* Main headline — editorial serif */}
          <div className="space-y-5 max-w-4xl">
            <h1
              className="leading-[1.1] tracking-tight"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                color: '#141413',
                letterSpacing: '-0.02em',
              }}
            >
              Satu Platform,{' '}
              <span className="relative inline-block">
                <span style={{ color: '#D97757' }}>Semua Event</span>
                <span
                  className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(to right, #D97757, transparent)' }}
                />
              </span>{' '}
              Terbaik
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{
                color: '#87867F',
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Temukan, daftar, dan ikuti seminar, workshop, serta webinar teknologi pilihan —
              semuanya dalam satu platform manajemen event yang dirancang untuk peserta dan
              penyelenggara.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href={'/events' as Route}
              id="hero-explore-events"
              className="group px-8 py-4 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
              style={{
                background: '#D97757',
                color: '#FFFFFF',
                boxShadow: '0 8px 32px rgba(217,119,87,0.35)',
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              }}
            >
              Jelajahi Event
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href={'/register' as Route}
              id="hero-register"
              className="px-8 py-4 font-semibold rounded-xl border transition-all duration-300 hover:scale-[1.02]"
              style={{
                color: '#141413',
                background: 'transparent',
                borderColor: '#D1CFC5',
                fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#E3DACC';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap items-center justify-center gap-8 pt-6 w-full max-w-2xl border-t"
            style={{ borderColor: '#D1CFC5' }}
          >
            {[
              { label: 'Event Tersedia', value: '50+' },
              { label: 'Peserta Terdaftar', value: '2.000+' },
              { label: 'Sertifikat Diterbitkan', value: '1.500+' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                    color: '#141413',
                  }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-xs font-medium uppercase tracking-wider mt-0.5"
                  style={{
                    color: '#87867F',
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
