'use client';
import { useEffect, useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createGallery, updateGallery, getGalleryById } from '@/services/galleries';
import { getAllEvents } from '@/services/events';
import { uploadImage } from '@/services/uploads';
import { gallerySchema, type GalleryValues } from '@/schemas/galleries';
import ImageUpload from './ImageUpload';
import type { Route } from 'next';

interface GalleryFormProps {
  id: string;
}

const GalleryForm: FC<GalleryFormProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = id === 'new';
  const [isUploading, setIsUploading] = useState(false);

  // Fetch list of events for dropdown selection
  const { data: events = [] } = useQuery({
    queryKey: ['all-events-dropdown'],
    queryFn: () => getAllEvents(),
  });

  // Fetch existing gallery item if modifying
  const { data: existing, isLoading } = useQuery({
    queryKey: ['gallery-item', id],
    queryFn: () => getGalleryById(id),
    enabled: !isNew,
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GalleryValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      featured: false,
      eventId: null,
    },
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        title: existing.data.title,
        description: existing.data.description || '',
        imageUrl: existing.data.imageUrl,
        featured: existing.data.featured,
        eventId: existing.data.eventId || null,
      });
    }
  }, [existing, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: GalleryValues) =>
      isNew ? createGallery(values) : updateGallery(id, values),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Terjadi kesalahan.');
        return;
      }
      toast.success(res.message || 'Berhasil menyimpan foto.');
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      router.push('/admin/master/galleries' as Route);
    },
    onError: () => toast.error('Terjadi kesalahan saat menyimpan.'),
  });

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await uploadImage(file, 'galleries');
      if (res.success && res.url) {
        setValue('imageUrl', res.url, { shouldValidate: true, shouldDirty: true });
        toast.success('Foto berhasil diunggah.');
      } else {
        toast.error(res.error || 'Gagal mengunggah foto.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-6 max-w-xl">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Judul Foto</FieldLabel>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input id="title" placeholder="contoh: Sesi Pembukaan Seminar" {...field} />
            )}
          />
          {errors.title && <FieldError>{errors.title.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi (opsional)</FieldLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Tulis penjelasan singkat mengenai foto..."
                className="h-24"
                {...field}
                value={field.value || ''}
              />
            )}
          />
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="eventId">Event Terkait (opsional)</FieldLabel>
          <Controller
            name="eventId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || 'none'}
                onValueChange={(val) => field.onChange(val === 'none' ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih event terkait..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {events.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.eventId && <FieldError>{errors.eventId.message}</FieldError>}
        </Field>

        <Field className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
          <div className="space-y-0.5">
            <FieldLabel className="text-sm font-semibold">Tampilkan di Landing Page</FieldLabel>
            <p className="text-xs text-muted-foreground">
              Jadikan foto ini sebagai dokumentasi unggulan (Featured) pada Bento Grid Landing Page.
            </p>
          </div>
          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </Field>

        <Controller
          name="imageUrl"
          control={control}
          render={({ field, fieldState }) => (
            <div className="relative">
              <ImageUpload
                value={field.value}
                isUploading={isUploading}
                onUpload={handleImageUpload}
                onSelect={(url: string) => field.onChange(url)}
                onRemove={() => field.onChange('')}
              />
              {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
            </div>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/master/galleries' as Route)}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isPending || isUploading}>
          {isPending ? 'Menyimpan...' : 'Simpan Foto'}
        </Button>
      </div>
    </form>
  );
};

export default GalleryForm;
