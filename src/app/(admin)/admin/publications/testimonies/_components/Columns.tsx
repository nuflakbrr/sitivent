'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Star, ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import type { Testimonial } from '@/interfaces/features/testimonials';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CellAction from './CellAction';

const Columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: 'user',
    header: 'Peserta',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || '-'}</span>
          <span className="text-xs text-muted-foreground">{user?.email || '-'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original.event;
      return <span className="text-sm">{event?.title || '-'}</span>;
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Rating
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <Badge
          variant="outline"
          className="font-semibold px-2 py-0.5 border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400 gap-1"
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {rating} / 5
        </Badge>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: 'Ulasan',
    cell: ({ row }) => (
      <span className="text-xs sm:text-sm line-clamp-2 max-w-md">{row.original.comment}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => {
      const formattedDate = moment(row.original.createdAt)
        .locale('id')
        .format('DD MMM YYYY, HH:mm');
      return <span className="text-xs sm:text-sm">{formattedDate}</span>;
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
