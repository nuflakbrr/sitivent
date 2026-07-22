import type { FC } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Users, Trophy, Sparkles } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';
import LoginForm from './_components/LoginForm';

export const metadata: Metadata = genPageMetadata({
  title: 'Masuk',
  description: 'Masuk ke Sitivent untuk mengelola dan mengikuti event impianmu.',
});

const stats = [
  { icon: CalendarDays, label: 'Event aktif', value: '12+' },
  { icon: Users, label: 'Peserta terdaftar', value: '300+' },
  { icon: Trophy, label: 'Event selesai', value: '12+' },
];

const Login: FC = () => {
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
          className="absolute -top-32 -left-32 w-120 h-120 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #D97757, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-90 h-90 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #788C5D, transparent 70%)' }}
        />

        {/* Logo */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3 group"
            aria-label="Beranda Sitivent"
          >
            <span
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
            </span>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
              style={{
                borderColor: 'rgba(217,119,87,0.4)',
                color: '#D97757',
                background: 'rgba(217,119,87,0.08)',
              }}
            >
              <Sparkles size={11} />
              Platform Event Terpercaya
            </div>

            <h1
              className="font-serif text-4xl xl:text-5xl font-bold leading-[1.15]"
              style={{ color: '#FAF9F5' }}
            >
              Temukan event <span style={{ color: '#D97757' }}>terbaik</span> dan raih pengalaman{' '}
              <span style={{ color: '#788C5D' }}>baru</span>.
            </h1>

            <p className="text-base leading-relaxed max-w-md" style={{ color: '#87867F' }}>
              Bergabung bersama ribuan peserta yang sudah menemukan event impian mereka di Sitivent
              — mulai dari workshop, seminar, hingga kompetisi bergengsi.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl p-4 space-y-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <Icon size={18} style={{ color: '#D97757' }} />
                <p className="font-serif text-2xl font-bold" style={{ color: '#FAF9F5' }}>
                  {value}
                </p>
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: '#87867F' }}
                >
                  {label}
                </p>
              </div>
            ))}
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
                color: '#D97757',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Selamat datang kembali
            </p>
            <h2 className="font-serif text-3xl font-bold" style={{ color: '#141413' }}>
              Masuk ke akun
            </h2>
            <p className="text-sm mt-2" style={{ color: '#87867F' }}>
              Lanjutkan perjalanan event-mu bersama Sitivent.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-center" style={{ color: '#87867F' }}>
          Dengan masuk, kamu menyetujui{' '}
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

export default Login;
