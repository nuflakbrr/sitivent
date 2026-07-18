'use client';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { SupportMessage } from '@/interfaces/features/support';
import { updateSupportMessageStatusAction } from '@/services/support';
import CellAction from './CellAction';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: '#B04A3F',
    bg: 'rgba(176,74,63,0.08)',
    border: 'rgba(176,74,63,0.25)',
    icon: AlertCircle,
  },
  PROCESS: {
    label: 'Diproses',
    color: '#D97757',
    bg: 'rgba(217,119,87,0.08)',
    border: 'rgba(217,119,87,0.25)',
    icon: Clock,
  },
  RESOLVED: {
    label: 'Selesai',
    color: '#788C5D',
    bg: 'rgba(120,140,93,0.08)',
    border: 'rgba(120,140,93,0.25)',
    icon: CheckCircle2,
  },
} as const;

const StatusCell = ({ row }: { row: Row<SupportMessage> }) => {
  const queryClient = useQueryClient();
  const data = row.original;

  const { mutate: handleUpdateStatus, isPending } = useMutation({
    mutationFn: async (status: 'PENDING' | 'PROCESS' | 'RESOLVED') => {
      const res = await updateSupportMessageStatusAction(data.id, status);
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal memperbarui status.');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Status pengaduan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const config = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider shrink-0"
        style={{
          background: config.bg,
          borderColor: config.border,
          color: config.color,
        }}
      >
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
      <select
        value={data.status}
        disabled={isPending || data.status === 'RESOLVED'}
        onChange={(e) => handleUpdateStatus(e.target.value as 'PENDING' | 'PROCESS' | 'RESOLVED')}
        className="px-2 py-0.5 text-xs rounded-lg border bg-white dark:bg-zinc-950 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="PENDING" disabled={data.status !== 'PENDING'}>
          Pending
        </option>
        <option value="PROCESS" disabled={data.status === 'RESOLVED'}>
          Proses
        </option>
        <option value="RESOLVED">Selesai</option>
      </select>
    </div>
  );
};

const Columns: ColumnDef<SupportMessage>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {new Date(row.original.createdAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Pengirim',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-muted">
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Subjek & Kronologi',
    cell: ({ row }) => (
      <div className="flex flex-col max-w-xs">
        <span className="font-medium text-sm line-clamp-1">{row.original.title}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {row.original.chronology}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
