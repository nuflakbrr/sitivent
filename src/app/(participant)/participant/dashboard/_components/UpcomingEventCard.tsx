import type { Route } from 'next';
import Link from 'next/link';
import { AlertCircle, Calendar, Clock, MapPin, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import ShowQrButton from './ShowQrButton';
import { canDownloadCertificate, formatEventDate } from './dashboard-helpers';

interface UpcomingEventCardProps {
  upcomingEvent: {
    id: string;
    title: string;
    banner: string | null;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    eventType?: string;
    meetingLink?: string | null;
    qrToken: string | null;
    status: string;
    registrationNumber?: string;
  } | null;
}

export default function UpcomingEventCard({ upcomingEvent }: UpcomingEventCardProps) {
  return (
    <div className="lg:col-span-1">
      <div
        className="rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200"
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
                    <span>{formatEventDate(upcomingEvent.startDate)}</span>
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

                  {upcomingEvent.meetingLink && (
                    <Button
                      asChild
                      className="w-full mt-1"
                      style={{ background: '#D97757', color: '#FAF9F5', borderColor: '#D97757' }}
                    >
                      <a href={upcomingEvent.meetingLink} target="_blank" rel="noopener noreferrer">
                        <Video className="w-4 h-4 shrink-0" />
                        Gabung Link Zoom
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Empty className="flex-1 border-0 p-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <AlertCircle className="w-6 h-6" />
                </EmptyMedia>
                <EmptyTitle>Belum ada event terdekat</EmptyTitle>
                <EmptyDescription>Belum ada event terdekat yang didaftar.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button asChild className="w-full">
                  <Link href={'/events' as Route}>Jelajahi Event</Link>
                </Button>
              </EmptyContent>
            </Empty>
          )}
        </div>

        {upcomingEvent && upcomingEvent.qrToken && upcomingEvent.eventType !== 'ONLINE' && (
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
  );
}
