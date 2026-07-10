import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteCertificate } from '@/services/certificates';

export const useCellAction = (certificateId: string) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteCertificate(certificateId),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
        setOpenDelete(false);
      } else {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus sertifikat.');
    },
  });

  return {
    openDelete,
    setOpenDelete,
    onDelete,
    isDeletePending,
  };
};
