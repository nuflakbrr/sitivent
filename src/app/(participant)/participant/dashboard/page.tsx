import type { Route } from 'next';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  QrCode,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileDown,
} from 'lucide-react';

import { getParticipantDashboardData } from '@/services/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

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
        <p className="text-muted-foreground">Gagal memuat data dashboard peserta.</p>
      </div>
    );
  }

  const { upcomingEvent, history, summary } = data;

  return (
    <div className="space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 id="dashboard-title" className="text-3xl font-extrabold tracking-tight">
            Halo, {session.user.name}
          </h1>
          <p className="text-muted-foreground">
            Selamat datang kembali di dashboard peserta SITIVENT.
          </p>
        </div>
      </div>

      {/* Summary Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-none shadow-md bg-linear-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Total Terdaftar
              </p>
              <h3 className="text-3xl font-extrabold tracking-tight mt-1">
                {summary.totalRegistered}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/15 rounded-xl text-blue-600 dark:text-blue-400">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-linear-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hadir (Check-In)
              </p>
              <h3 className="text-3xl font-extrabold tracking-tight mt-1">
                {summary.totalCheckedIn}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/15 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-linear-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Menunggu Pembayaran
              </p>
              <h3 className="text-3xl font-extrabold tracking-tight mt-1">
                {summary.totalPendingPayment}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/15 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Event Widget (col-span-1) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md border-none ring-0 h-full flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-foreground/5 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" /> Event Terdekat
                </CardTitle>
                <CardDescription>Event terdekat yang akan Anda ikuti</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                {upcomingEvent ? (
                  <div className="space-y-6">
                    <div className="aspect-video w-full rounded-md overflow-hidden bg-muted border border-foreground/10 relative">
                      {upcomingEvent.banner ? (
                        <img
                          src={upcomingEvent.banner}
                          alt={upcomingEvent.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                          {upcomingEvent.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg leading-tight text-foreground">
                        {upcomingEvent.title}
                      </h3>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary shrink-0" />
                          <span>{formatDate(upcomingEvent.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            {upcomingEvent.startTime} - {upcomingEvent.endTime} WIB
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0" />
                          <span className="line-clamp-1">{upcomingEvent.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-muted-foreground/60" />
                    <span>Belum ada event terdekat yang didaftar.</span>
                  </div>
                )}
              </CardContent>
            </div>
            {upcomingEvent && upcomingEvent.qrToken && (
              <div className="p-6 pt-0">
                <Card className="bg-muted/50 border-dashed border-2 border-muted">
                  <CardContent className="p-4 flex items-center gap-4">
                    <QrCode className="w-10 h-10 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-foreground uppercase tracking-wider">
                        Kode QR Kehadiran
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate font-mono">
                        {upcomingEvent.qrToken}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Event Registration History (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="border-b border-foreground/5 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" /> Riwayat Event
              </CardTitle>
              <CardDescription>Daftar seluruh event yang pernah Anda daftarkan</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {history.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Anda belum pernah mendaftar ke event apapun.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/5 text-xs text-muted-foreground uppercase font-semibold">
                        <th className="pb-3 pr-4">Event</th>
                        <th className="pb-3 px-4">Tanggal</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4">Kehadiran</th>
                        <th className="pb-3 pl-4 text-right">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-foreground/5">
                      {history.map((item) => {
                        const canDownloadCert =
                          item.status === 'CHECKED_IN' &&
                          item.event.certificateEnabled &&
                          item.certificates.length > 0;

                        return (
                          <tr key={item.id} className="group">
                            <td className="py-4 pr-4">
                              <p className="font-semibold text-sm text-foreground line-clamp-1">
                                {item.event.title}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                {item.registrationNumber}
                              </p>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-xs text-muted-foreground">
                              {formatDate(item.event.startDate)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <Badge
                                variant={
                                  item.status === 'CHECKED_IN'
                                    ? 'default'
                                    : item.status === 'REGISTERED'
                                      ? 'secondary'
                                      : item.status === 'WAITING_PAYMENT'
                                        ? 'outline'
                                        : 'destructive'
                                }
                                className="text-[10px] px-1.5 py-0"
                              >
                                {item.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {item.status === 'CHECKED_IN' ? (
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> Belum Hadir
                                </span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-right whitespace-nowrap">
                              {canDownloadCert ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 flex items-center gap-1 text-xs"
                                  asChild
                                >
                                  <a
                                    href={item.certificates[0].downloadUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FileDown className="w-3.5 h-3.5" /> Unduh
                                  </a>
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
