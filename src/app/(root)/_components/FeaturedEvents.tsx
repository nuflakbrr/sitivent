import Link from 'next/link';
import type { FC } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Globe, Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import moment from 'moment';
import 'moment/locale/id';

type Event = {
  id: string;
  title: string;
  slug: string;
  banner: string | null;
  eventType: string;
  price: number;
  location: string;
  startDate: Date;
  startTime: string;
  quota: number;
  registrations: { id: string }[];
};

type Props = {
  events: Event[];
};

const FeaturedEvents: FC<Props> = ({ events }) => {
  if (events.length === 0) return null;

  return (
    <section id="event-unggulan" className="py-16" style={{ background: '#FAF9F5' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-widest block mb-3"
              style={{
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                color: '#87867F',
              }}
            >
              Event Pilihan
            </span>
            <h2
              className="leading-tight"
              style={{
                fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                fontWeight: 500,
                fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                color: '#141413',
                letterSpacing: '-0.01em',
              }}
            >
              Event Unggulan
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#87867F' }}>
              Event terpilih yang dibuka untuk umum
            </p>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 hover:gap-2.5"
            style={{ color: '#D97757' }}
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {events.map((event) => {
            const totalRegistered = event.registrations.length;
            const slotsLeft = Math.max(0, event.quota - totalRegistered);
            const isFree = event.price === 0;
            const isAlmostFull = slotsLeft > 0 && slotsLeft <= 10;
            const isFull = slotsLeft === 0;
            const formattedDate = moment(event.startDate).locale('id').format('DD MMM YYYY');

            return (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="event-card group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #D1CFC5',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(20,20,19,0.06)',
                }}
              >
                {/* Banner */}
                <div
                  className="relative aspect-video w-full overflow-hidden shrink-0"
                  style={{ background: '#E3DACC' }}
                >
                  {event.banner ? (
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center p-4"
                      style={{
                        background: 'linear-gradient(135deg, #E3DACC 0%, #D1CFC5 100%)',
                      }}
                    >
                      <span
                        className="font-semibold text-sm text-center line-clamp-2 leading-snug"
                        style={{
                          color: '#3D3D3A',
                          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {event.title}
                      </span>
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
                    <span
                      className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      style={{
                        background: 'rgba(255,255,255,0.92)',
                        color: '#3D3D3A',
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      {event.eventType === 'ONLINE' ? (
                        <Globe className="w-3 h-3" style={{ color: '#788C5D' }} />
                      ) : (
                        <Landmark className="w-3 h-3" style={{ color: '#D97757' }} />
                      )}
                      {event.eventType === 'ONLINE' ? 'Online' : 'Offline'}
                    </span>
                    {isFree && (
                      <span
                        className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full"
                        style={{ background: '#788C5D', color: '#FFFFFF' }}
                      >
                        Gratis
                      </span>
                    )}
                  </div>

                  {/* Urgency / full overlay */}
                  {isAlmostFull && (
                    <div className="absolute bottom-2.5 right-2.5 z-10">
                      <span
                        className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full"
                        style={{ background: '#B04A3F', color: '#FFFFFF' }}
                      >
                        Sisa {slotsLeft} kursi
                      </span>
                    </div>
                  )}
                  {isFull && (
                    <div
                      className="absolute inset-0 flex items-center justify-center z-10"
                      style={{ background: 'rgba(20,20,19,0.55)', backdropFilter: 'blur(4px)' }}
                    >
                      <span
                        className="font-semibold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: 'rgba(20,20,19,0.8)',
                          color: '#F0EEE6',
                          border: '1px solid rgba(240,238,230,0.15)',
                        }}
                      >
                        Kuota Penuh
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase"
                    style={{
                      color: '#D97757',
                      fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    }}
                  >
                    {event.eventType} Event
                  </span>
                  <h3
                    className="text-sm font-semibold leading-snug line-clamp-2 transition-colors duration-200"
                    style={{
                      fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                      color: '#141413',
                    }}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 text-xs flex-1" style={{ color: '#87867F' }}>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: '#D1CFC5' }} />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#D1CFC5' }} />
                      {event.startTime} WIB
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#D1CFC5' }} />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between pt-3 border-t"
                    style={{ borderColor: '#F0EEE6' }}
                  >
                    {isFree ? (
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: '#788C5D',
                          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                        }}
                      >
                        Gratis
                      </span>
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{
                          color: '#141413',
                          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {formatCurrency(event.price)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#87867F' }}>
                      <Users className="w-3.5 h-3.5" />
                      {slotsLeft} tersisa
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile see all */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
            style={{ color: '#D97757' }}
          >
            Lihat Semua Event <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
