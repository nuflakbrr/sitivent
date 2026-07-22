import type { FC } from 'react';
import { Star, MessageSquare, User } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import { getEventTestimonials } from '@/services/testimonials';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Props {
  eventId: string;
}

const EventTestimonials: FC<Props> = async ({ eventId }) => {
  const { testimonials, averageRating, totalCount } = await getEventTestimonials(eventId);

  return (
    <div className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#141413]">
            Ulasan & Testimoni Peserta
          </h2>
          <p className="text-xs text-[#87867F] mt-1">
            Ulasan resmi dari peserta yang telah menghadiri event ini.
          </p>
        </div>

        {totalCount > 0 && (
          <div
            className="flex items-center gap-3 bg-white p-3 rounded-xl border shrink-0"
            style={{ borderColor: '#E3DACC' }}
          >
            <div className="text-2xl font-bold font-serif text-[#141413]">{averageRating}</div>
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-[#87867F]">{totalCount} Ulasan</span>
            </div>
          </div>
        )}
      </div>

      {totalCount === 0 ? (
        <Card
          className="py-6 border shadow-xs bg-white text-center rounded-2xl"
          style={{ borderColor: '#E3DACC' }}
        >
          <CardContent className="p-6 flex flex-col items-center space-y-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#FAF9F5] border"
              style={{ borderColor: '#E3DACC' }}
            >
              <MessageSquare className="w-5 h-5 text-[#87867F]" />
            </div>
            <p className="text-sm font-semibold text-[#141413]">Belum Ada Ulasan</p>
            <p className="text-xs text-[#87867F] max-w-sm">
              Event ini belum memiliki ulasan dari peserta. Ulasan dapat diberikan oleh peserta yang
              hadir setelah event selesai.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border bg-white space-y-3"
              style={{ borderColor: '#E3DACC' }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {item.user?.image ? (
                    <img
                      src={item.user.image}
                      alt={item.user.name || 'Peserta'}
                      className="w-8 h-8 rounded-full object-cover border"
                      style={{ borderColor: '#E3DACC' }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                      style={{ background: 'rgba(217,119,87,0.1)', color: '#D97757' }}
                    >
                      {item.user?.name ? (
                        item.user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#141413]">
                      {item.user?.name || 'Peserta Event'}
                    </p>
                    <p className="text-[10px] text-[#87867F]">
                      {moment(item.createdAt).locale('id').format('DD MMM YYYY')}
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 bg-[#FAF9F5] px-2.5 py-1 rounded-full border text-xs font-semibold"
                  style={{ borderColor: '#E3DACC' }}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.rating} / 5</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#3D3D3A] leading-relaxed">
                &ldquo;{item.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventTestimonials;
