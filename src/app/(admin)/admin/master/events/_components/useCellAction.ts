import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteEvent, publishEvent } from '@/services/events';

export const useCellAction = (eventId: string) => {
  const queryClient = useQueryClient();
  const [openDelete, setOpenDelete] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);

  const { mutate: onDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setOpenDelete(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus event.');
    },
  });

  const { mutate: onPublish, isPending: isPublishPending } = useMutation({
    mutationFn: () => publishEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['events'] });
        setOpenPublish(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal mempublikasikan event.');
    },
  });

  return {
    openDelete,
    setOpenDelete,
    openPublish,
    setOpenPublish,
    onDelete,
    isDeletePending,
    onPublish,
    isPublishPending,
  };
};
