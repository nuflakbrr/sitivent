'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronsUpDown, Users, CalendarDays, Search } from 'lucide-react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/id';

import type { Event } from '@/interfaces/features/events';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { EventStatus, EventType } from '@/generated/prisma/enums';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

const Columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Event
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    accessorKey: 'eventType',
    header: 'Tipe',
    cell: ({ row }) => {
      const type = row.original.eventType;
      const isOnline = type === EventType.ONLINE;
      return (
        <Badge
          variant="outline"
          className={`font-semibold capitalize px-2 py-0.5 ${
            isOnline
              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30'
          }`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Biaya',
    cell: ({ row }) => {
      const price = row.original.price;
      if (price === 0) {
        return (
          <Badge
            variant="outline"
            className="font-bold bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/30"
          >
            Gratis
          </Badge>
        );
      }
      return <span className="font-medium text-sm">{formatCurrency(price)}</span>;
    },
  },
  {
    accessorKey: 'quota',
    header: 'Peserta',
    cell: ({ row }) => {
      const event = row.original;
      const registered = event._count?.registrations ?? 0;
      const quota = event.quota;
      return (
        <span>
          {registered} / <strong className="text-foreground">{quota}</strong>
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = (val: typeof status) => {
        switch (val) {
          case EventStatus.DRAFT:
            return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/30';
          case EventStatus.PUBLISHED:
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
          case EventStatus.CLOSED:
            return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
          case EventStatus.COMPLETED:
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
          default:
            return '';
        }
      };
      return (
        <Badge
          variant="outline"
          className={`font-semibold capitalize px-2 py-0.5 ${getStatusClass(status)}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Tanggal Mulai',
    cell: ({ row }) => {
      const event = row.original;
      const formattedDate = moment(event.startDate).locale('id').format('DD MMM YYYY');
      return (
        <span>
          {formattedDate}, {event.startTime}
        </span>
      );
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const TitleCell = ({ row }: { row: { original: Event } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const event = row.original;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={event.banner}
        title={event.title}
        aspectRatio="video"
      />
      <div className="flex items-center gap-3">
        <div
          className="relative h-10 w-16 min-w-[64px] rounded-md overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => event.banner && setIsPreviewOpen(true)}
        >
          {event.banner ? (
            <>
              <Image
                src={event.banner}
                alt={event.title}
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                fill
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground font-bold">EVENT</span>
          )}
        </div>
        <div className="flex flex-col text-left max-w-[200px] md:max-w-[300px]">
          <span className="font-semibold truncate leading-snug">{event.title}</span>
          <span className="text-xs text-muted-foreground font-mono truncate">{event.slug}</span>
        </div>
      </div>
    </>
  );
};

export default Columns;
