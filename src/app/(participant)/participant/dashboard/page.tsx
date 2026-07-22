import type { Route } from 'next';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { getParticipantDashboardData } from '@/services/dashboard';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardHeader from './_components/DashboardHeader';
import TestimonialNoticeBanner from './_components/TestimonialNoticeBanner';
import SummaryCards from './_components/SummaryCards';
import UpcomingEventCard from './_components/UpcomingEventCard';
import EventHistoryTable from './_components/EventHistoryTable';

export default async function ParticipantDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect('/login');
  }

  const data = await getParticipantDashboardData();

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p style={{ color: '#87867F' }}>Gagal memuat data dashboard peserta.</p>
      </div>
    );
  }

  const { upcomingEvent, history, summary } = data;

  return (
    <div className="space-y-8 pb-10">
      <DashboardHeader userName={session.user.name} emailVerified={session.user.emailVerified} />

      <TestimonialNoticeBanner count={summary.pendingTestimonials} />

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingEventCard upcomingEvent={upcomingEvent} />
        <div className="lg:col-span-2">
          <EventHistoryTable history={history} />
        </div>
      </div>
    </div>
  );
}
