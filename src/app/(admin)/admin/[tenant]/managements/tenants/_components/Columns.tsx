'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Building2, ChevronsUpDown } from 'lucide-react';

import type { Tenant } from '@/interfaces/features/tenants';
import { Button } from '@/components/ui/button';
import CellAction from './CellAction';

const Columns: ColumnDef<Tenant>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Tenant <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.name}</span>
          <span className="text-xs text-muted-foreground font-mono">/{row.original.slug}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) => (
      <span className="text-sm">
        {new Date(row.original.createdAt).toLocaleDateString('id-ID')}
      </span>
    ),
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
