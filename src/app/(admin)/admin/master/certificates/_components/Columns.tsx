'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, CalendarDays } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { CertificateResponse } from '@/services/certificates';
import CellAction from './CellAction';

const Columns: ColumnDef<CertificateResponse>[] = [
  {
    accessorKey: 'certificateNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nomor Sertifikat
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <span className="font-mono text-xs text-zinc-900 dark:text-zinc-100">
          {row.original.certificateNumber}
        </span>
      );
    },
  },
  {
    accessorKey: 'event.title',
    header: 'Event',
    cell: ({ row }) => {
      return (
        <div className="flex flex-col text-left">
          <span className="font-medium text-foreground">{row.original.event.title}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {row.original.registration.registrationNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'user.name',
    header: 'Penerima',
    cell: ({ row }) => {
      const u = row.original.user;
      return (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-foreground capitalize">{u.name || '-'}</span>
          <span className="text-xs text-muted-foreground">{u.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Terbit',
    cell: ({ row }) => {
      const formatted = moment(row.original.createdAt).locale('id').format('DD MMMM YYYY, HH:mm');
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: 'downloadTime',
    header: 'Status Unduh',
    cell: ({ row }) => {
      const t = row.original.downloadTime;
      if (!t) {
        return (
          <Badge variant="outline" className="bg-zinc-500/10 text-zinc-600 border-zinc-200">
            Belum Diunduh
          </Badge>
        );
      }
      const formatted = moment(t).locale('id').format('DD/MM/YYYY HH:mm');
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
          Diunduh ({formatted})
        </Badge>
      );
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];

export default Columns;
