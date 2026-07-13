'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronsUpDown, Star } from 'lucide-react';
import Image from 'next/image';

import type { Gallery } from '@/interfaces/features/galleries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CellAction from './CellAction';

const Columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Foto',
    cell: ({ row }) => (
      <div className="relative w-16 h-10 rounded-lg overflow-hidden border">
        <Image
          src={row.original.imageUrl}
          alt={row.original.title}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Judul Foto
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm line-clamp-1">{row.original.title}</span>
        {row.original.event && (
          <span className="text-xs text-muted-foreground line-clamp-1">
            Event: {row.original.event.title}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'featured',
    header: 'Tampil di Landing',
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge
          variant="default"
          className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 w-fit"
        >
          <Star className="w-3 h-3 fill-white" /> Featured
        </Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground w-fit">
          Standard
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
