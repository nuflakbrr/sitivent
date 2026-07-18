'use client';

import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { CreditCard, ChevronsUpDown, Search } from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import Heading from '@/components/Common/Heading';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatCurrency';
import { getParticipantPayments } from '@/services/payments';

interface ParticipantPayment {
  id: string;
  registrationId: string;
  amount: number;
  status: string;
  proofUrl?: string | null;
  createdAt: Date;
  deletedAt?: Date | null;
  registration: {
    id: string;
    registrationNumber: string;
    status: string;
    event: {
      id: string;
      title: string;
      slug: string;
    };
  };
}

const columns: ColumnDef<ParticipantPayment>[] = [
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
      const labelMap: Record<string, string> = {
        WAITING: 'Menunggu Verifikasi',
        PAID: 'Lunas',
        FAILED: 'Ditolak',
        REFUNDED: 'Dikembalikan',
      };
      const classMap: Record<string, string> = {
        WAITING: 'bg-amber-500/10 text-amber-600 border-amber-200',
        PAID: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
        FAILED: 'bg-rose-500/10 text-rose-600 border-rose-200',
        REFUNDED: 'bg-blue-500/10 text-blue-600 border-blue-200',
      };

      return (
        <Badge variant="outline" className={`font-semibold px-2 py-0.5 ${classMap[status] || ''}`}>
          {labelMap[status] || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'proofUrl',
    header: 'Bukti Transfer',
    cell: ({ row }) => {
      const proofUrl = row.original.proofUrl;
      return proofUrl ? (
        <a
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline text-sm"
        >
          Lihat Bukti
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Transaksi',
    cell: ({ row }) => (
      <span className="text-sm">
        {moment(row.original.createdAt).locale('id').format('DD MMM YYYY, HH:mm')}
      </span>
    ),
  },
];

export default function PaymentHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['participant-payments'],
    queryFn: getParticipantPayments,
  });

  const payments = data?.data || [];

  return (
    <section className="space-y-4">
      <Heading
        title={`Riwayat Pembayaran (${payments.length})`}
        description="Lihat semua transaksi pembayaran event Anda."
      />
      <Separator />
      {payments.length === 0 && !isLoading ? (
        <div className="rounded-xl border p-6">
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CreditCard className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Belum ada pembayaran</EmptyTitle>
              <EmptyDescription>Belum ada transaksi pembayaran event.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <DataTable
          searchKey="registrationNumber"
          columns={columns}
          data={payments as ParticipantPayment[]}
          isFetching={isLoading}
          pageCount={1}
          placeholderSearch="Cari no. registrasi atau event..."
        />
      )}
    </section>
  );
}
