'use client';
import { useEffect, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  createEventCategory,
  updateEventCategory,
  getEventCategoryById,
} from '@/services/event-categories';
import { eventCategorySchema, type EventCategoryValues } from '@/schemas/event-categories';
import type { Route } from 'next';

interface CategoryFormProps {
  id: string;
}

const CategoryForm: FC<CategoryFormProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const { data: existing, isLoading } = useQuery({
    queryKey: ['event-category', id],
    queryFn: () => getEventCategoryById(id),
    enabled: !isNew,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventCategoryValues>({
    resolver: zodResolver(eventCategorySchema),
    defaultValues: { name: '', description: '' },
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        name: existing.data.name,
        description: existing.data.description ?? '',
      });
    }
  }, [existing, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: EventCategoryValues) =>
      isNew ? createEventCategory(values) : updateEventCategory(id, values),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Terjadi kesalahan.');
        return;
      }
      toast.success(res.message || 'Berhasil.');
      queryClient.invalidateQueries({ queryKey: ['event-categories'] });
      router.push('/admin/master/event-categories' as Route);
    },
    onError: () => toast.error('Terjadi kesalahan.'),
  });

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-5 max-w-lg">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama Kategori</FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input id="name" placeholder="contoh: Seminar Teknologi" {...field} />
            )}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi (opsional)</FieldLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang kategori ini..."
                rows={3}
                {...field}
              />
            )}
          />
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : isNew ? 'Buat Kategori' : 'Simpan Perubahan'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/master/event-categories' as Route)}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
