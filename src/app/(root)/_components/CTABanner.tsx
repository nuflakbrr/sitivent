import Link from 'next/link';
import type { FC } from 'react';
import { Award } from 'lucide-react';

const CTABanner: FC = () => {
  return (
    <section className="relative py-16 overflow-hidden bg-indigo-600">
      {/* Subtle decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      <div className="relative container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-indigo-200 text-sm font-semibold uppercase tracking-widest">
              Dapatkan Sertifikat Digital
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Ikuti event, tingkatkan kompetensi, <br className="hidden md:block" />
            raih sertifikat resmi.
          </h2>
          <p className="text-indigo-200 text-base font-medium">
            Gratis daftar akun. Bayar hanya untuk event yang kamu pilih.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <Link
            href="/register"
            id="cta-banner-register"
            className="px-7 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-indigo-900/20 text-sm"
          >
            Buat Akun Gratis
          </Link>
          <Link
            href="/events"
            id="cta-banner-events"
            className="px-7 py-3.5 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all duration-200 text-sm"
          >
            Jelajahi Event
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
