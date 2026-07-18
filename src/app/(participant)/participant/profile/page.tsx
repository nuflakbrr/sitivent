import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/lib/auth';
import ProfileForm from './_components/ProfileForm';

export const metadata: Metadata = {
  title: 'Profil Saya | SITIVENT',
  description: 'Kelola informasi profil dan keamanan akun SITIVENT Anda.',
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 pb-6 border-b" style={{ borderColor: '#E3DACC' }}>
        <Link
          href="/participant/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors w-fit"
          style={{ color: '#87867F' }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Kembali ke Dashboard
        </Link>

        <div>
          {/* <span
            className="text-[11px] font-bold uppercase tracking-widest block mb-2"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              color: '#87867F',
            }}
          >
            Akun Peserta
          </span> */}
          <h1
            className="leading-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: '#141413',
              letterSpacing: '-0.01em',
            }}
          >
            Profil Saya
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#87867F' }}>
            Kelola informasi profil dan keamanan akun Anda.
          </p>
        </div>
      </div>

      <ProfileForm user={{ name: session.user.name, email: session.user.email }} />
    </div>
  );
}
