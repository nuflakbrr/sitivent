'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/id';

import type { Registration } from '@/interfaces/features/registrations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RegistrationStatus } from '@/generated/prisma/enums';
import CellAction from './CellAction';

const Columns: ColumnDef<Registration>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        No. Registrasi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.registrationNumber}</span>,
  },
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original.event;
      return (
        <div className="flex flex-col">
          <span className="text-sm">{event?.title}</span>
          {event?.price > 0 ? (
            <span className="text-xs text-indigo-600 font-medium">Berbayar</span>
          ) : (
            <span className="text-xs text-emerald-600 font-medium">Gratis</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: 'Peserta',
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm">{user?.name || '-'}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
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
           case RegistrationStatus.WAITING_PAYMENT:
             return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30';
           case RegistrationStatus.REGISTERED:
             return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
           case RegistrationStatus.CANCELLED:
             return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
           case RegistrationStatus.CHECKED_IN:
             return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
           default:
             return '';
         }
       };
       const getStatusLabel = (val: typeof status) => {
         switch (val) {
           case RegistrationStatus.WAITING_PAYMENT:
             return 'Menunggu Pembayaran';
           case RegistrationStatus.REGISTERED:
             return 'Terdaftar';
           case RegistrationStatus.CANCELLED:
             return 'Dibatalkan';
           case RegistrationStatus.CHECKED_IN:
             return 'Hadir';
           default:
             return val;
         }
       };
       return (
         <Badge variant="outline" className={`font-semibold px-1.5 py-0.5 text-xs sm:text-sm ${getStatusClass(status)}`}>
           {getStatusLabel(status)}
         </Badge>
       );
     },
   },
   {
     accessorKey: 'createdAt',
     header: 'Tanggal',
     cell: ({ row }) => {
       const formattedDate = moment(row.original.createdAt)
         .clone()
         .locale('id')
         .tz('Asia/Jakarta')
         .format('DD MMM, HH:mm');
       return <span className="text-xs sm:text-sm">{formattedDate}</span>;
     },
   },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Daftar',
    cell: ({ row }) => {
      const formattedDate = moment(row.original.createdAt)
        .clone()
        .locale('id')
        .tz('Asia/Jakarta')
        .format('DD MMM YYYY, HH:mm');
      return <span className="text-sm">{formattedDate}</span>;
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
