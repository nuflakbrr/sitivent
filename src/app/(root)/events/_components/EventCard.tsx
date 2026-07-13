'use client';
import type { FC } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Globe,
  Landmark,
  ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/formatCurrency';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    banner: string | null;
    eventType: 'ONLINE' | 'OFFLINE';
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'COMPLETED';
    startDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    price: number;
    quota: number;
    registrations: any[];
  };
  formattedStartDate: string;
}

export const EventCard: FC<EventCardProps> = ({ event, formattedStartDate }) => {
  const totalRegistered = event.registrations.length;
  const slotsLeft = Math.max(0, event.quota - totalRegistered);
  const isFree = event.price === 0;

  return (
    <Card
      className="group flex p-0 flex-col justify-between border shadow-xs hover:shadow-lg hover:border-[#D97757] transition-all duration-500 rounded-3xl overflow-hidden"
      style={{ borderColor: '#E3DACC', background: '#FFFFFF' }}
    >
      <div className="space-y-4">
        {/* Event Banner */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          {event.banner ? (
            <img
              src={event.banner}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-4 bg-muted/40"
              style={{
                background: 'linear-gradient(135deg, #F0EEE6 0%, #E3DACC 100%)',
              }}
            >
              <ImageIcon className="h-8 w-8 opacity-20 text-[#141413]" />
            </div>
          )}
          {/* Badge Top Left overlay */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="outline"
              className="font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 shadow-xs border rounded-md"
              style={
                event.eventType === 'ONLINE'
                  ? {
                      background: 'rgba(120,140,93,0.12)',
                      borderColor: 'rgba(120,140,93,0.3)',
                      color: '#788C5D',
                    }
                  : {
                      background: 'rgba(217,119,87,0.12)',
                      borderColor: 'rgba(217,119,87,0.3)',
                      color: '#D97757',
                    }
              }
            >
              {event.eventType === 'ONLINE' ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Landmark className="h-3 w-3" /> Offline
                </span>
              )}
            </Badge>

            {event.status !== 'PUBLISHED' && (
              <Badge
                variant="outline"
                className="font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 shadow-xs border rounded-md"
                style={
                  event.status === 'COMPLETED'
                    ? {
                        background: 'rgba(120,140,93,0.12)',
                        borderColor: 'rgba(120,140,93,0.3)',
                        color: '#788C5D',
                      }
                    : {
                        background: 'rgba(217,119,87,0.12)',
                        borderColor: 'rgba(217,119,87,0.3)',
                        color: '#D97757',
                      }
                }
              >
                {event.status === 'COMPLETED' ? 'Selesai' : 'Tutup'}
              </Badge>
            )}
          </div>
        </div>

        {/* Card Header Content */}
        <div className="px-6 pt-1 space-y-3">
          <h3
            className="font-serif font-bold text-lg md:text-xl leading-snug transition-colors line-clamp-2 wrap-break-word"
            style={{ color: '#141413' }}
          >
            <Link
              href={`/events/${event.slug}`}
              className="hover:text-[#D97757] transition-colors duration-300"
            >
              {event.title}
            </Link>
          </h3>

          <div className="space-y-2">
            {/* Date text */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#87867F' }}>
              <Calendar className="h-3.5 w-3.5 shrink-0" style={{ color: '#D97757' }} />
              <span>{formattedStartDate}</span>
            </div>

            {/* Time text */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#87867F' }}>
              <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: '#D97757' }} />
              <span>{event.startTime} WIB</span>
            </div>

            {/* Location text */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#87867F' }}>
              <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: '#D97757' }} />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-5">
        <Separator style={{ borderColor: '#F0EEE6' }} />
        <div className="flex items-center justify-between">
          {/* Price tag */}
          {event.status !== 'COMPLETED' && event.status !== 'CLOSED' && (
            <>
              <div className="flex flex-col">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest font-mono"
                  style={{ color: '#87867F' }}
                >
                  Biaya
                </span>
                {isFree ? (
                  <span className="font-extrabold text-lg mt-0.5" style={{ color: '#788C5D' }}>
                    Gratis
                  </span>
                ) : (
                  <span className="font-extrabold text-lg mt-0.5" style={{ color: '#141413' }}>
                    {formatCurrency(event.price)}
                  </span>
                )}
              </div>

              {/* Quota tag */}
              <div className="flex flex-col items-end">
                <span
                  className="text-[9px] font-bold uppercase tracking-widest font-mono"
                  style={{ color: '#87867F' }}
                >
                  Sisa Kursi
                </span>
                <span
                  className="font-bold text-sm mt-0.5 flex items-center gap-1"
                  style={{ color: '#3D3D3A' }}
                >
                  <Users className="h-3.5 w-3.5 opacity-60" style={{ color: '#D97757' }} />{' '}
                  {slotsLeft}
                </span>
              </div>
            </>
          )}
        </div>

        {event.status === 'PUBLISHED' ? (
          <Button
            className="w-full h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 shadow-xs text-white transition-all duration-300"
            style={{ background: '#D97757' }}
            asChild
          >
            <Link href={`/events/${event.slug}`} className="group-hover:gap-2.5 transition-all">
              Detail Event{' '}
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        ) : (
          <Button
            className="w-full h-11 rounded-xl font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-1.5 shadow-xs border transition-all duration-300"
            style={{
              background: '#F0EEE6',
              borderColor: '#D1CFC5',
              color: '#87867F',
            }}
            disabled
            onClick={(e) => e.preventDefault()}
          >
            {event.status === 'COMPLETED' ? 'Event Selesai' : 'Pendaftaran Ditutup'}{' '}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
