'use client';
import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Edit, MoreHorizontal, Trash, Globe } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';
import { usePermission } from '@/providers/PermissionProvider';
import { copyToClipboard } from '@/lib/clipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { EventStatus } from '@/generated/prisma/enums';
import { useCellAction } from './useCellAction';

interface CellActionProps {
  data: Event;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const {
    openDelete,
    setOpenDelete,
    openPublish,
    setOpenPublish,
    onDelete,
    isDeletePending,
    onPublish,
    isPublishPending,
  } = useCellAction(data.id);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
      />
      <AlertModal
        isOpen={openPublish}
        onClose={() => setOpenPublish(false)}
        onConfirm={onPublish}
        loading={isPublishPending}
        title="Publikasikan Event"
        desc="Apakah Anda yakin ingin mempublikasikan event ini? Event yang dipublikasikan akan tampil ke publik."
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard(data.slug)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin Slug
          </DropdownMenuItem>

          {data.status === EventStatus.DRAFT && hasPermission('events.publish') && (
            <DropdownMenuItem
              className="cursor-pointer text-indigo-600 focus:text-indigo-600 focus:bg-indigo-50 dark:focus:bg-indigo-950/20"
              onClick={() => setOpenPublish(true)}
            >
              <Globe className="mr-2 h-4 w-4" /> Publikasikan
            </DropdownMenuItem>
          )}

          {hasPermission('events.update') && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => router.push(`/admin/events/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {hasPermission('events.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
