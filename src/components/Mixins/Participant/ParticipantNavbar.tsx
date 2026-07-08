import type { FC } from 'react';
import Link from 'next/link';
import ParticipantNavbarClient from '@/components/Mixins/Participant/ParticipantNavbarClient';

type Props = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export const ParticipantNavbar: FC<Props> = ({ user }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/participant/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-primary">SITIVENT</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/participant/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ParticipantNavbarClient user={user} />
        </div>
      </div>
    </header>
  );
};
