import type { FC } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';
import RegisterForm from './_components/RegisterForm';
import Image from 'next/image';

export const metadata: Metadata = genPageMetadata({
  title: 'Daftar Akun',
  description: 'Buat akun Sitivent gratis dan mulai temukan event terbaik untukmu.',
});

const perks = [
  'Akses ratusan event gratis maupun berbayar',
  'Tiket digital langsung di dashboard kamu',
  'Notifikasi event terbaru sesuai minatmu',
  'Sertifikat keikutsertaan digital',
];

const Register: FC = () => {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ── LEFT PANEL — branding ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] xl:w-[55%] p-12 xl:p-16 relative overflow-hidden"
        style={{ background: '#141413' }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -right-32 w-115 h-115 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #788C5D, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -left-20 w-[320px] h-80 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #D97757, transparent 70%)' }}
        />

        {/* Logo */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 group"
            aria-label="Beranda Sitivent"
          >
            <Image
              className="w-auto h-25"
              src={'/assets/img/SITIVENT-PRIMARY.png'}
              alt="Logo"
              width={120}
              height={40}
              loading="lazy"
            />
            {/* <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg shadow-lg"
              style={{ background: '#D97757' }}
            >
              S
            </span>
            <span
              className="font-serif text-2xl font-bold tracking-tight"
              style={{ color: '#FAF9F5' }}
            >
              Sitivent
            </span> */}
          </Link>
        </div>

        {/* Hero copy */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                borderColor: 'rgba(120,140,93,0.4)',
                color: '#788C5D',
                background: 'rgba(120,140,93,0.08)',
              }}
            >
              ✦ Gratis Selamanya
            </div>

            <h1
              className="font-serif text-4xl xl:text-5xl font-bold leading-[1.15]"
              style={{ color: '#FAF9F5' }}
            >
              Mulai perjalanan <span style={{ color: '#788C5D' }}>event</span>-mu{' '}
              <span style={{ color: '#D97757' }}>hari ini</span>.
            </h1>

            <p className="text-base leading-relaxed max-w-md" style={{ color: '#87867F' }}>
              Daftar akun gratis dan dapatkan akses ke ratusan event pilihan — dari workshop kreatif
              hingga seminar nasional.
            </p>
          </div>

          {/* Perk list */}
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckCircle2 size={18} style={{ color: '#788C5D', flexShrink: 0 }} />
                <span className="text-sm" style={{ color: '#D1CFC5' }}>
                  {perk}
                </span>
              </li>
            ))}
          </ul>

          {/* Testimonial card */}
          <div
            className="rounded-2xl p-5 space-y-3"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-sm italic leading-relaxed" style={{ color: '#D1CFC5' }}>
              &ldquo;Sitivent bikin aku nemu event-event keren yang nggak pernah aku tahu
              sebelumnya. Highly recommended!&rdquo;
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm font-serif"
                style={{ background: '#D97757' }}
              >
                A
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#FAF9F5' }}>
                  Anisa R.
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: '#87867F' }}
                >
                  Peserta aktif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px]" style={{ color: '#3D3D3A' }}>
          &copy; {new Date().getFullYear()} Sitivent. Hak cipta dilindungi.
        </p>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-20">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 flex flex-col items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Beranda">
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg shadow"
              style={{ background: '#D97757' }}
            >
              S
            </span>
            <span
              className="font-serif text-2xl font-bold tracking-tight"
              style={{ color: '#141413' }}
            >
              Sitivent
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-md rounded-3xl p-8 xl:p-10 shadow-2xl"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #E3DACC',
            boxShadow: '0 20px 60px rgba(20,20,19,0.10)',
          }}
        >
          {/* Heading */}
          <div className="mb-8">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{
                color: '#788C5D',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Bergabung sekarang — gratis
            </p>
            <h2 className="font-serif text-3xl font-bold" style={{ color: '#141413' }}>
              Buat akun baru
            </h2>
            <p className="text-sm mt-2" style={{ color: '#87867F' }}>
              Isi data di bawah dan mulai ikuti event favoritmu.
            </p>
          </div>

          <RegisterForm />
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center" style={{ color: '#87867F' }}>
          Dengan mendaftar, kamu menyetujui{' '}
          <Link
            href="/terms"
            className="font-semibold hover:underline"
            style={{ color: '#D97757' }}
          >
            Syarat &amp; Ketentuan
          </Link>{' '}
          dan{' '}
          <Link
            href="/privacy"
            className="font-semibold hover:underline"
            style={{ color: '#D97757' }}
          >
            Kebijakan Privasi
          </Link>{' '}
          kami.
        </p>
      </div>
    </div>
  );
};

export default Register;
