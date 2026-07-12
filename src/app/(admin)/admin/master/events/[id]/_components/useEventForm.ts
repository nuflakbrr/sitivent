'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import type { Event } from '@/interfaces/features/events';
import { createEvent, deleteEvent, updateEvent, type EventValues } from '@/services/events';
import { eventSchema, refinedEventSchema } from '@/schemas/events';

export const useEventForm = (initialData: Event | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(refinedEventSchema) as Resolver<z.infer<typeof eventSchema>>,
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      banner: initialData?.banner || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      location: initialData?.location || '',
      eventType: initialData?.eventType || 'OFFLINE',
      registrationDeadline: initialData?.registrationDeadline
        ? new Date(initialData.registrationDeadline)
        : new Date(),
      quota: initialData?.quota ?? 0,
      price: initialData?.price ?? 0,
      status: initialData?.status || 'DRAFT',
      certificateEnabled: initialData?.certificateEnabled || false,
      categoryId: initialData?.categoryId || '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: EventValues) => {
      return initialData ? await updateEvent(initialData.id, data) : await createEvent(data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        router.refresh();
        router.push('/admin/master/events');
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        router.refresh();
        router.push('/admin/master/events');
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = (data: EventValues) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};
