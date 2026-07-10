'use client';
import { type FC } from 'react';
import { MoreHorizontal, ExternalLink, Copy, Edit, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { usePermission } from '@/providers/PermissionProvider';
import { copyToClipboard } from '@/lib/clipboard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AlertModal from '@/components/Common/Modals/AlertModal';
import type { CertificateResponse } from '@/services/certificates';
import { useCellAction } from './useCellAction';

interface CellActionProps {
  data: CertificateResponse;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { openDelete, setOpenDelete, onDelete, isDeletePending } = useCellAction(data.id);

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
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href={`/certificates/${data.id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Buka di tab baru
            </a>
          </DropdownMenuItem>
          {hasPermission('certificates.delete') && (
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
