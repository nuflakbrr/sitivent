'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown } from 'lucide-react';

import type { EventCategory } from '@/interfaces/features/event-categories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CellAction from './CellAction';

const Columns: ColumnDef<EventCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Kategori
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold">{row.original.name}</span>
        <span className="text-xs text-muted-foreground font-mono">{row.original.slug}</span>
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
    accessorKey: '_count',
    header: 'Jumlah Event',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-semibold">
        {row.original._count?.events ?? 0} event
      </Badge>
    ),
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
