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
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A] pt-24 pb-20">
      {/* Background mesh */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-violet-700/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-500/15 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[50%] w-[25%] h-[25%] bg-amber-500/10 blur-[100px] rounded-full" />
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Live event ticker badge — the signature element */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
            </span>
            <span className="text-violet-200 text-sm font-medium">
              Tersedia:{' '}
              <span
                className="font-bold text-violet-300 transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(-6px)',
                  display: 'inline-block',
                }}
              >
                {eventTypes[currentType]}
              </span>
            </span>
          </div>

          {/* Main headline */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Satu Platform,{' '}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-violet-200">
                  Semua Event
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-linear-to-r from-violet-500 to-transparent rounded-full" />
              </span>{' '}
              Terbaik
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
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
              className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-900/40 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
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
              className="px-8 py-4 text-white font-bold rounded-2xl border border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
            >
              Daftar Sekarang
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-white/10 w-full max-w-2xl">
            {[
              { label: 'Event Tersedia', value: '50+' },
              { label: 'Peserta Terdaftar', value: '2.000+' },
              { label: 'Sertifikat Diterbitkan', value: '1.500+' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-white">{stat.value}</span>
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
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
