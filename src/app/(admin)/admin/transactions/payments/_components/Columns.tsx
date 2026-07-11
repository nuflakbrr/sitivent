'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, Search, CreditCard } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import moment from 'moment';
import 'moment/locale/id';

import type { Payment } from '@/interfaces/features/payments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { PaymentStatus } from '@/generated/prisma/enums';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

const Columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        No. Registrasi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.original.registration.registrationNumber}</span>
    ),
  },
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => <span className="text-sm">{row.original.registration.event.title}</span>,
  },
  {
    accessorKey: 'user',
    header: 'Peserta',
    cell: ({ row }) => {
      const user = row.original.registration.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm">{user.name || '-'}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Nominal',
    cell: ({ row }) => (
      <span className="font-medium text-sm">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = (val: typeof status) => {
        switch (val) {
          case PaymentStatus.WAITING:
            return 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-500/30';
          case PaymentStatus.PAID:
            return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
          case PaymentStatus.FAILED:
            return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
          case PaymentStatus.REFUNDED:
            return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
          default:
            return '';
        }
      };
      const getStatusLabel = (val: typeof status) => {
        switch (val) {
          case PaymentStatus.WAITING:
            return 'Menunggu Verifikasi';
          case PaymentStatus.PAID:
            return 'Lunas';
          case PaymentStatus.FAILED:
            return 'Ditolak';
          case PaymentStatus.REFUNDED:
            return 'Dikembalikan';
          default:
            return val;
        }
      };
      return (
        <Badge variant="outline" className={`font-semibold px-2 py-0.5 ${getStatusClass(status)}`}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'proofUrl',
    header: 'Bukti Transfer',
    cell: ({ row }) => <ProofCell row={row} />,
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Transaksi',
    cell: ({ row }) => {
      const formattedDate = moment(row.original.createdAt)
        .locale('id')
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

const ProofCell = ({ row }: { row: { original: Payment } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const payment = row.original;

  return (
    <>
      {payment.proofUrl && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          imageSrc={payment.proofUrl}
          title={`Bukti Transfer - ${payment.registration.registrationNumber}`}
          aspectRatio="3/2"
        />
      )}
      <div
        className="relative h-10 w-16 min-w-[64px] rounded-md overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
        onClick={() => payment.proofUrl && setIsPreviewOpen(true)}
      >
        {payment.proofUrl ? (
          <>
            <Image
              src={payment.proofUrl}
              alt="Bukti Transfer"
              loading="lazy"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              fill
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Search className="h-4 w-4 text-white" />
            </div>
          </>
        ) : (
          <CreditCard className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
    </>
  );
};

export default Columns;
