import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTenant } from '@/services/tenants';
import type { Tenant } from '@/interfaces/features/tenants';

export const useCellAction = (data: Tenant) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteTenant(data.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus tenant.');
        return;
      }
      toast.success(res.message || 'Tenant berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      setOpenDelete(false);
      router.refresh();
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  return { openDelete, setOpenDelete, onDelete, isDeletePending };
};
