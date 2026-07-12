import Link from 'next/link';
import type { FC } from 'react';
import { Award, ArrowRight } from 'lucide-react';

const CTABanner: FC = () => {
  return (
    <section className="relative py-16 overflow-hidden" style={{ background: '#141413' }}>
      {/* Warm decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-16 right-0 w-64 h-64 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #D97757 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-8 left-0 w-48 h-48 rounded-full opacity-20 blur-2xl"
          style={{ background: 'radial-gradient(circle, #788C5D 0%, transparent 70%)' }}
        />
        {/* Warm grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FAF9F5 1px, transparent 1px), linear-gradient(to bottom, #FAF9F5 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-3">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Award className="w-4 h-4" style={{ color: '#D97757' }} />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                color: '#87867F',
              }}
            >
              Dapatkan Sertifikat Digital
            </span>
          </div>
          <h2
            className="leading-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#FAF9F5',
              letterSpacing: '-0.01em',
            }}
          >
            Ikuti event, tingkatkan kompetensi, <br className="hidden md:block" />
            raih sertifikat resmi.
          </h2>
          <p className="text-base" style={{ color: '#87867F' }}>
            Gratis daftar akun. Bayar hanya untuk event yang kamu pilih.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/register"
            id="cta-banner-register"
            className="px-7 py-3.5 font-semibold rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-2"
            style={{
              background: '#D97757',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(217,119,87,0.4)',
              fontSize: '14px',
            }}
          >
            Buat Akun Gratis
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/events"
            id="cta-banner-events"
            className="px-7 py-3.5 font-semibold rounded-xl border transition-all duration-200 hover:scale-[1.02]"
            style={{
              color: '#F0EEE6',
              borderColor: 'rgba(240,238,230,0.2)',
              background: 'rgba(240,238,230,0.05)',
              fontSize: '14px',
            }}
          >
            Jelajahi Event
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
