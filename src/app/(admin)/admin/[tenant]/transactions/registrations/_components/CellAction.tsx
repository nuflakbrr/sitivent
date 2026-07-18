'use client';
import { type FC, useState, useTransition } from 'react';
import { Copy, MoreHorizontal, Ban, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import type { Registration } from '@/interfaces/features/registrations';
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
import { RegistrationStatus } from '@/generated/prisma/enums';
import { cancelRegistration, deleteRegistration } from '@/services/registrations';

interface CellActionProps {
  data: Registration;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();
  const [openCancel, setOpenCancel] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onCancel = () => {
    startTransition(async () => {
      const res = await cancelRegistration(data.id);
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['registrations'] });
      } else {
        toast.error(res.error);
      }
      setOpenCancel(false);
    });
  };

  const onDelete = () => {
    startTransition(async () => {
      const res = await deleteRegistration(data.id);
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['registrations'] });
      } else {
        toast.error(res.error);
      }
      setOpenDelete(false);
    });
  };

  return (
    <>
      <AlertModal
        isOpen={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={onCancel}
        loading={isPending}
        title="Batalkan Pendaftaran"
        desc="Apakah Anda yakin ingin membatalkan pendaftaran ini?"
      />
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isPending}
        title="Hapus Pendaftaran"
        desc="Apakah Anda yakin ingin menghapus pendaftaran ini?"
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
          <DropdownMenuItem
            onClick={() => copyToClipboard(data.registrationNumber)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin No. Registrasi
          </DropdownMenuItem>

          {data.status !== RegistrationStatus.CANCELLED &&
            hasPermission('registrations.update') && (
              <DropdownMenuItem
                variant="warning"
                className="cursor-pointer"
                onClick={() => setOpenCancel(true)}
              >
                <Ban className="mr-2 h-4 w-4" /> Batalkan
              </DropdownMenuItem>
            )}

          {hasPermission('registrations.delete') && (
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
