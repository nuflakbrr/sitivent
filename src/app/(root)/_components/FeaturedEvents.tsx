import Link from 'next/link';
import type { FC } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowRight, Globe, Landmark } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';
import moment from 'moment';
import 'moment/locale/id';
import { Badge } from '@/components/ui/badge';

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
    <section id="event-unggulan" className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Event Unggulan
            </h2>
            <p className="text-slate-500 text-sm mt-1">Event terpilih yang dibuka untuk umum</p>
          </div>
          <Link
            href="/events"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
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
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-200 transition-all duration-300 flex flex-col"
              >
                {/* Banner */}
                <div className="relative aspect-video w-full overflow-hidden bg-indigo-50 shrink-0">
                  {event.banner ? (
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center p-4">
                      <span className="text-white font-bold text-sm text-center line-clamp-2 leading-snug">
                        {event.title}
                      </span>
                    </div>
                  )}

                  {/* Top badges */}
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white flex items-center gap-1 ${
                        event.eventType === 'ONLINE' ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                    >
                      {event.eventType === 'ONLINE' ? (
                        <Globe className="w-2.5 h-2.5" />
                      ) : (
                        <Landmark className="w-2.5 h-2.5" />
                      )}
                      {event.eventType === 'ONLINE' ? 'Online' : 'Offline'}
                    </span>
                    {isFree && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                        Gratis
                      </span>
                    )}
                  </div>

                  {/* Urgency badge */}
                  {isAlmostFull && (
                    <div className="absolute bottom-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                        Sisa {slotsLeft} kursi
                      </span>
                    </div>
                  )}
                  {isFull && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-sm bg-slate-900/70 px-3 py-1 rounded-full">
                        Kuota Penuh
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {event.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-500 font-medium flex-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {event.startTime} WIB
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    {isFree ? (
                      <span className="text-base font-extrabold text-emerald-600">Gratis</span>
                    ) : (
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(event.price)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      {slotsLeft} tersisa
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile — see all link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Lihat Semua Event <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
