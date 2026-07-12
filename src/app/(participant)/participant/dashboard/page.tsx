import type { Route } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Award, CheckCircle2, AlertCircle, FileDown } from 'lucide-react';

import { getParticipantDashboardData } from '@/services/dashboard';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import ShowQrButton from './_components/ShowQrButton';

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Status label & color per warm palette
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'CHECKED_IN':
      return {
        label: 'Hadir',
        bg: 'rgba(120,140,93,0.12)',
        color: '#788C5D',
        border: 'rgba(120,140,93,0.25)',
      };
    case 'REGISTERED':
      return {
        label: 'Terdaftar',
        bg: 'rgba(20,20,19,0.06)',
        color: '#3D3D3A',
        border: 'rgba(20,20,19,0.15)',
      };
    case 'WAITING_PAYMENT':
      return {
        label: 'Menunggu Bayar',
        bg: 'rgba(217,119,87,0.1)',
        color: '#D97757',
        border: 'rgba(217,119,87,0.25)',
      };
    case 'CANCELLED':
      return {
        label: 'Dibatalkan',
        bg: 'rgba(176,74,63,0.1)',
        color: '#B04A3F',
        border: 'rgba(176,74,63,0.2)',
      };
    default:
      return {
        label: status,
        bg: 'rgba(135,134,127,0.1)',
        color: '#87867F',
        border: 'rgba(135,134,127,0.2)',
      };
  }
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
        <p style={{ color: '#87867F' }}>Gagal memuat data dashboard peserta.</p>
      </div>
    );
  }

  const { upcomingEvent, history, summary } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b"
        style={{ borderColor: '#E3DACC' }}
      >
        <div>
          <span
            className="text-[11px] font-bold uppercase tracking-widest block mb-2"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              color: '#87867F',
            }}
          >
            Dashboard Peserta
          </span>
          <h1
            id="dashboard-title"
            className="leading-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: '#141413',
              letterSpacing: '-0.01em',
            }}
          >
            Halo, {session.user.name}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#87867F' }}>
            Selamat datang kembali di dashboard peserta SITIVENT.
          </p>
        </div>
      </div>

      {/* Summary Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Terdaftar */}
        <div
          className="p-6 rounded-xl flex items-center justify-between transition-all duration-200"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #D1CFC5',
            boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
          }}
        >
          <div className="space-y-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: '#87867F',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Total Terdaftar
            </p>
            <h3
              className="text-4xl font-medium mt-1"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                color: '#141413',
              }}
            >
              {summary.totalRegistered}
            </h3>
          </div>
          <div
            className="p-3.5 rounded-xl"
            style={{
              background: 'rgba(217,119,87,0.1)',
              border: '1.5px solid rgba(217,119,87,0.2)',
            }}
          >
            <Calendar className="w-6 h-6" style={{ color: '#D97757' }} />
          </div>
        </div>

        {/* Hadir */}
        <div
          className="p-6 rounded-xl flex items-center justify-between transition-all duration-200"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #D1CFC5',
            boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
          }}
        >
          <div className="space-y-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: '#87867F',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Hadir (Check-In)
            </p>
            <h3
              className="text-4xl font-medium mt-1"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                color: '#141413',
              }}
            >
              {summary.totalCheckedIn}
            </h3>
          </div>
          <div
            className="p-3.5 rounded-xl"
            style={{
              background: 'rgba(120,140,93,0.1)',
              border: '1.5px solid rgba(120,140,93,0.2)',
            }}
          >
            <CheckCircle2 className="w-6 h-6" style={{ color: '#788C5D' }} />
          </div>
        </div>

        {/* Menunggu Pembayaran */}
        <div
          className="p-6 rounded-xl flex items-center justify-between transition-all duration-200"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #D1CFC5',
            boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
          }}
        >
          <div className="space-y-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: '#87867F',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Menunggu Pembayaran
            </p>
            <h3
              className="text-4xl font-medium mt-1"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                color: '#141413',
              }}
            >
              {summary.totalPendingPayment}
            </h3>
          </div>
          <div
            className="p-3.5 rounded-xl"
            style={{
              background: 'rgba(176,74,63,0.08)',
              border: '1.5px solid rgba(176,74,63,0.18)',
            }}
          >
            <Clock className="w-6 h-6" style={{ color: '#B04A3F' }} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming Event Widget */}
        <div className="lg:col-span-1">
          <div
            className="rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D1CFC5',
              boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
            }}
          >
            {/* Card header */}
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
            >
              <Calendar className="w-4.5 h-4.5" style={{ color: '#D97757' }} />
              <h2
                className="text-sm font-semibold"
                style={{
                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  color: '#141413',
                }}
              >
                Event Terdekat
              </h2>
              <p className="ml-auto text-xs" style={{ color: '#87867F' }}>
                Yang akan Anda ikuti
              </p>
            </div>

            <div className="p-6 flex flex-col flex-1">
              {upcomingEvent ? (
                <div className="space-y-5 flex-1">
                  {/* Banner */}
                  <div
                    className="aspect-video w-full rounded-lg overflow-hidden"
                    style={{ background: '#E3DACC', border: '1.5px solid #D1CFC5' }}
                  >
                    {upcomingEvent.banner ? (
                      <img
                        src={upcomingEvent.banner}
                        alt={upcomingEvent.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #E3DACC, #D1CFC5)' }}
                      >
                        <span
                          className="text-2xl font-medium"
                          style={{
                            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                            color: '#3D3D3A',
                          }}
                        >
                          {upcomingEvent.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <h3
                      className="font-semibold text-base leading-snug line-clamp-2"
                      style={{
                        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                        color: '#141413',
                      }}
                    >
                      {upcomingEvent.title}
                    </h3>
                    <div className="space-y-2 text-xs" style={{ color: '#87867F' }}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" style={{ color: '#D1CFC5' }} />
                        <span>{formatDate(upcomingEvent.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" style={{ color: '#D1CFC5' }} />
                        <span>
                          {upcomingEvent.startTime} - {upcomingEvent.endTime} WIB
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0" style={{ color: '#D1CFC5' }} />
                        <span className="line-clamp-1">{upcomingEvent.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="text-center py-12 flex flex-col items-center justify-center gap-3 flex-1"
                  style={{ color: '#87867F' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: '#F0EEE6' }}
                  >
                    <AlertCircle className="w-6 h-6" style={{ color: '#D1CFC5' }} />
                  </div>
                  <p className="text-sm">Belum ada event terdekat yang didaftar.</p>
                  <Link
                    href={'/events' as Route}
                    className="text-sm font-semibold mt-1 transition-colors"
                    style={{ color: '#D97757' }}
                  >
                    Jelajahi Event →
                  </Link>
                </div>
              )}
            </div>

            {upcomingEvent && upcomingEvent.qrToken && (
              <div className="px-6 pb-6 pt-0" style={{ borderTop: '1.5px solid #F0EEE6' }}>
                <div className="pt-4">
                  <ShowQrButton
                    qrToken={upcomingEvent.qrToken}
                    eventTitle={upcomingEvent.title}
                    registrationNumber={upcomingEvent.registrationNumber}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Event Registration History */}
        <div className="lg:col-span-2">
          <div
            className="rounded-xl overflow-hidden h-full"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #D1CFC5',
              boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
            }}
          >
            {/* Card header */}
            <div
              className="px-6 py-4 border-b flex items-center gap-2"
              style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
            >
              <Award className="w-4.5 h-4.5" style={{ color: '#D97757' }} />
              <h2
                className="text-sm font-semibold"
                style={{
                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  color: '#141413',
                }}
              >
                Riwayat Event
              </h2>
              <p className="ml-auto text-xs" style={{ color: '#87867F' }}>
                Seluruh event yang pernah Anda daftarkan
              </p>
            </div>

            <div className="p-6">
              {history.length === 0 ? (
                <div
                  className="text-center py-12 flex flex-col items-center gap-3"
                  style={{ color: '#87867F' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: '#F0EEE6' }}
                  >
                    <Award className="w-6 h-6" style={{ color: '#D1CFC5' }} />
                  </div>
                  <p className="text-sm">Anda belum pernah mendaftar ke event apapun.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr
                        className="text-[10px] font-bold uppercase"
                        style={{
                          color: '#87867F',
                          fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                          letterSpacing: '0.08em',
                          borderBottom: '1.5px solid #E3DACC',
                        }}
                      >
                        <th className="pb-3 pr-4">Event</th>
                        <th className="pb-3 px-4">Tanggal</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4">Kehadiran</th>
                        <th className="pb-3 pl-4 text-right">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => {
                        const canDownloadCert =
                          item.status === 'CHECKED_IN' &&
                          item.event.certificateEnabled &&
                          item.certificates.length > 0;
                        const statusStyle = getStatusStyle(item.status);

                        return (
                          <tr
                            key={item.id}
                            className="group transition-colors duration-150"
                            style={{ borderBottom: '1px solid #F0EEE6' }}
                          >
                            <td className="py-4 pr-4">
                              <p
                                className="font-semibold text-sm line-clamp-1"
                                style={{
                                  color: '#141413',
                                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                                }}
                              >
                                {item.event.title}
                              </p>
                              <p
                                className="text-xs mt-0.5"
                                style={{
                                  color: '#87867F',
                                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                                }}
                              >
                                {item.registrationNumber}
                              </p>
                            </td>
                            <td
                              className="py-4 px-4 whitespace-nowrap text-xs"
                              style={{ color: '#87867F' }}
                            >
                              {formatDate(item.event.startDate)}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                                style={{
                                  background: statusStyle.bg,
                                  color: statusStyle.color,
                                  border: `1px solid ${statusStyle.border}`,
                                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                                }}
                              >
                                {statusStyle.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {item.status === 'CHECKED_IN' ? (
                                <span
                                  className="text-xs font-semibold flex items-center gap-1"
                                  style={{ color: '#788C5D' }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Hadir
                                </span>
                              ) : (
                                <span
                                  className="text-xs flex items-center gap-1"
                                  style={{ color: '#87867F' }}
                                >
                                  <Clock className="w-3.5 h-3.5" /> Belum Hadir
                                </span>
                              )}
                            </td>
                            <td className="py-4 pl-4 text-right whitespace-nowrap">
                              {canDownloadCert ? (
                                <a
                                  href={item.certificates[0].downloadUrl}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-200"
                                  style={{
                                    color: '#D97757',
                                    borderColor: 'rgba(217,119,87,0.3)',
                                    background: 'rgba(217,119,87,0.05)',
                                  }}
                                >
                                  <FileDown className="w-3.5 h-3.5" /> Unduh
                                </a>
                              ) : (
                                <span className="text-xs" style={{ color: '#D1CFC5' }}>
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
