'use client';

import { type FC } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

import type { Tenant } from '@/interfaces/features/tenants';
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
import { useCellAction } from './useCellAction';
import type { Route } from 'next';

interface CellActionProps {
  data: Tenant;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { tenant } = useParams<{ tenant: string }>();
  const { hasPermission } = usePermission();
  const { openDelete, setOpenDelete, onDelete, isDeletePending } = useCellAction(data);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
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
          {hasPermission('tenants.update') && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() =>
                router.push(`/admin/${tenant}/managements/tenants/${data.id}` as Route)
              }
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('tenants.delete') && (
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
