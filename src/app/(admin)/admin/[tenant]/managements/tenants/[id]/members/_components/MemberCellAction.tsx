'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { removeTenantMember } from '@/services/tenant-members';
import { useState } from 'react';

interface MemberCellActionProps {
  tenantId: string;
  userId: string;
  userName?: string | null;
}

export function MemberCellAction({ tenantId, userId, userName }: MemberCellActionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => removeTenantMember(tenantId, userId),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus member.');
        return;
      }
      toast.success(res.message || 'Member dihapus.');
      queryClient.invalidateQueries({ queryKey: ['tenant-members', tenantId] });
      setOpen(false);
    },
    onError: () => toast.error('Terjadi kesalahan.'),
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => mutation.mutate()}
        loading={mutation.isPending}
        title="Hapus Member"
        desc={`Hapus ${userName || 'user ini'} dari keanggotaan tenant? User masih bisa diundang ke tenant lain.`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Hapus dari Tenant
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
