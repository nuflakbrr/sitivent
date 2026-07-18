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
import { removeTenantMember } from '@/services/tenant-members';

export function MemberCellAction({ tenantId, userId }: { tenantId: string; userId: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => removeTenantMember(tenantId, userId),
    onSuccess: (res) => {
      if (!res.success) return toast.error(res.error || 'Gagal menghapus member.');
      toast.success(res.message || 'Member dihapus.');
      queryClient.invalidateQueries({ queryKey: ['tenant-members', tenantId] });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-destructive" onClick={() => mutation.mutate()}>
          <Trash2 className="mr-2 h-4 w-4" /> Hapus dari tenant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
