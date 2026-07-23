'use client';

import type { FC } from 'react';
import Link from 'next/link';
import ParticipantNavbarClient from '@/components/Mixins/Participant/ParticipantNavbarClient';
import Image from 'next/image';

interface Props {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export const ParticipantNavbar: FC<Props> = ({ user }) => {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderColor: '#E3DACC',
      }}
    >
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/participant/dashboard" className="inline-flex items-center gap-2">
            <Image
              className="w-auto h-25"
              src={'/assets/img/SITIVENT-PRIMARY.png'}
              alt="Logo"
              width={120}
              height={40}
            />
            {/* <span
              className="flex items-center justify-center w-7 h-7 rounded-md font-black text-xs shadow-sm"
              style={{ background: '#D97757', color: '#FFFFFF' }}
            >
              S
            </span>
            <span
              className="text-lg font-extrabold tracking-tight"
              style={{ fontFamily: 'ui-serif, Georgia, serif', color: '#141413' }}
            >
              SITIVENT
            </span> */}
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-2">
            <Link
              href="/participant/dashboard"
              data-tour-desktop="step-dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3D3A] hover:text-[#141413] hover:bg-[#FAF9F5] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/participant/event-history"
              data-tour-desktop="step-history"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3D3A] hover:text-[#141413] hover:bg-[#FAF9F5] transition-colors"
            >
              Riwayat Event
            </Link>
            <Link
              href="/participant/payment-history"
              data-tour-desktop="step-payments"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3D3A] hover:text-[#141413] hover:bg-[#FAF9F5] transition-colors"
            >
              Riwayat Pembayaran
            </Link>
          </nav>
        </div>

        {/* Right: user dropdown */}
        <div className="flex items-center gap-3" data-tour-desktop="step-profile">
          <ParticipantNavbarClient user={user} />
        </div>
      </div>
    </header>
  );
};
