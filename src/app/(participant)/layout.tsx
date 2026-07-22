import type { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ParticipantNavbar } from '@/components/Mixins/Participant/ParticipantNavbar';
import { ParticipantFooter } from '@/components/Mixins/Participant/ParticipantFooter';
import { ParticipantTourGuide } from '@/components/Mixins/Participant/ParticipantTourGuide';

type Props = {
  children: ReactNode;
};

const ParticipantLayout: FC<Props> = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect('/login');
  }

  return (
    <TooltipProvider>
      <ParticipantTourGuide>
        <div className="min-h-screen bg-background flex flex-col">
          <ParticipantNavbar user={session.user} />
          <main className="flex-1 container py-6 px-4 md:py-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
          <ParticipantFooter />
        </div>
      </ParticipantTourGuide>
    </TooltipProvider>
  );
};

export default ParticipantLayout;
