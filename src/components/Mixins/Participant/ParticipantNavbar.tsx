import type { FC } from 'react';
import Link from 'next/link';
import ParticipantNavbarClient from '@/components/Mixins/Participant/ParticipantNavbarClient';

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
            <span
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
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/participant/dashboard"
              className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 text-[#3D3D3A] hover:text-[#D97757]"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Right: user dropdown */}
        <div className="flex items-center gap-3">
          <ParticipantNavbarClient user={user} />
        </div>
      </div>
    </header>
  );
};
