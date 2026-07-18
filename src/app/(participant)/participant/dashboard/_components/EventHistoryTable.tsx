import { Award, FileDown, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { canDownloadCertificate, formatEventDate, getStatusStyle } from './dashboard-helpers';

interface EventHistoryTableProps {
  history: Array<{
    id: string;
    registrationNumber: string;
    status: string;
    event: {
      title: string;
      startDate: Date;
      eventType: string;
      meetingLink: string | null;
      certificateEnabled: boolean;
    };
    certificates: Array<{ id: string; downloadUrl: string }>;
  }>;
}

export default function EventHistoryTable({ history }: EventHistoryTableProps) {
  if (history.length === 0) {
    return (
      <div
        className="rounded-xl overflow-hidden h-full"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #D1CFC5',
          boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
        }}
      >
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
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Award className="w-6 h-6" />
              </EmptyMedia>
              <EmptyTitle>Belum ada riwayat event</EmptyTitle>
              <EmptyDescription>Anda belum pernah mendaftar ke event apapun.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden h-full"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #D1CFC5',
        boxShadow: '0 2px 8px rgba(20,20,19,0.05)',
      }}
    >
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
                <th className="pb-3 px-4">Link Meeting</th>
                <th className="pb-3 pl-4 text-right">Sertifikat</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const canDownloadCert = canDownloadCertificate(
                  item.status,
                  item.event.certificateEnabled,
                  item.certificates
                );
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
                      {formatEventDate(item.event.startDate)}
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
                      {item.event.eventType === 'ONLINE' && item.event.meetingLink ? (
                        <Button asChild variant="outline" size="xs" className="h-8 gap-1.5">
                          <a
                            href={item.event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="w-3.5 h-3.5" /> Gabung
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs" style={{ color: '#D1CFC5' }}>
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      {canDownloadCert ? (
                        <Button asChild variant="outline" size="xs" className="h-8 gap-1.5">
                          <a
                            href={item.certificates[0].downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileDown className="w-3.5 h-3.5" /> Unduh
                          </a>
                        </Button>
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
      </div>
    </div>
  );
}
