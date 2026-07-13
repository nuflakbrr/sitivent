'use client';
import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronsUpDown, Star, Search } from 'lucide-react';
import Image from 'next/image';

import type { Gallery } from '@/interfaces/features/galleries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import CellAction from './CellAction';

const Columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Foto',
    cell: ({ row }) => <PhotoCell row={row} />,
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
          <span className="text-xs text-muted-foreground line-clamp-1 font-sans">
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

const PhotoCell = ({ row }: { row: { original: Gallery } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const gallery = row.original;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={gallery.imageUrl}
        title={gallery.title}
        aspectRatio="video"
      />
      <div
        className="relative h-10 w-16 min-w-[64px] rounded-md overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
        onClick={() => gallery.imageUrl && setIsPreviewOpen(true)}
      >
        <Image
          src={gallery.imageUrl}
          alt={gallery.title}
          loading="lazy"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          fill
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Search className="h-4 w-4 text-white" />
        </div>
      </div>
    </>
  );
};

export default Columns;
