'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { Star, MessageSquarePlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  count: number;
}

const TestimonialNoticeBanner: FC<Props> = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <div className="bg-linear-to-r from-[#FFF9F5] via-[#FFF3EB] to-[#FEF3EB] border border-[#FDBA74]/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#D97757]/10 text-[#D97757] shrink-0 mt-0.5 sm:mt-0">
          <Star className="w-5 h-5 fill-[#D97757]" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-semibold text-[#141413] flex items-center gap-2">
            <span>Ulasan Event Tersedia</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#D97757] text-white">
              {count} Event
            </span>
          </h4>
          <p className="text-xs sm:text-sm text-[#87867F] mt-0.5">
            Anda memiliki {count} event selesai yang telah Anda ikuti. Yuk berikan pengalaman &
            ulasan Anda!
          </p>
        </div>
      </div>
      <Link href="/participant/event-history" className="w-full sm:w-auto shrink-0">
        <Button
          size="sm"
          className="w-full sm:w-auto bg-[#D97757] hover:bg-[#c46647] text-white font-medium shadow-xs"
        >
          <MessageSquarePlus className="w-4 h-4 mr-1.5" />
          <span>Isi Testimoni Sekarang</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </Link>
    </div>
  );
};

export default TestimonialNoticeBanner;
