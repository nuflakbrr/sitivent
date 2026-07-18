import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteEventCategory } from '@/services/event-categories';
import type { EventCategory } from '@/interfaces/features/event-categories';

export const useCellAction = (data: EventCategory) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteEventCategory(data.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus kategori.');
        return;
      }
      toast.success('Kategori berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  return { openDelete, setOpenDelete, onDelete, isDeletePending };
};
