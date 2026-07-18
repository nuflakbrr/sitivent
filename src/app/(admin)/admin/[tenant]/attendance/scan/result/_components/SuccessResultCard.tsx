import { type FC } from 'react';
import { User, Calendar, Clock, QrCode } from 'lucide-react';
import { formatTime } from '@/lib/formatTime';

type Props = {
  name?: string;
  email?: string;
  number?: string;
  event?: string;
  time?: string;
};

export const SuccessResultCard: FC<Props> = ({ name, email, number, event, time }) => {
  return (
    <div className="space-y-4 text-left text-sm bg-white/60 dark:bg-zinc-950/40 p-5 rounded-2xl border">
      <div className="flex items-start gap-3">
        <User className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Peserta
          </p>
          <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <QrCode className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            No. Registrasi
          </p>
          <p className="font-mono text-xs text-zinc-900 dark:text-white mt-0.5 font-bold">
            {number}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Calendar className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Event
          </p>
          <p className="font-semibold text-zinc-900 dark:text-white mt-0.5 leading-snug line-clamp-2">
            {event}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Clock className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Waktu Kehadiran
          </p>
          <p className="font-semibold text-zinc-900 dark:text-white mt-0.5">{formatTime(time)}</p>
        </div>
      </div>
    </div>
  );
};
