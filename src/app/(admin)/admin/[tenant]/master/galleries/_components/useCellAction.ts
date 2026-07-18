import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteGallery } from '@/services/galleries';
import type { Gallery } from '@/interfaces/features/galleries';

export const useCellAction = (data: Gallery) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteGallery(data.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus foto.');
        return;
      }
      toast.success('Foto berhasil dihapus dari galeri.');
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      setOpenDelete(false);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  return { openDelete, setOpenDelete, onDelete, isDeletePending };
};
