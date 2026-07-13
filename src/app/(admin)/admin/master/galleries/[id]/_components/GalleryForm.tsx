'use client';
import { useState, type FC, useEffect } from 'react';
import { Trash, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { Gallery } from '@/interfaces/features/galleries';
import { usePermission } from '@/providers/PermissionProvider';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { uploadImage } from '@/services/uploads';
import { createGallery, updateGallery, deleteGallery } from '@/services/galleries';
import { getAllEvents } from '@/services/events';
import { gallerySchema, type GalleryValues } from '@/schemas/galleries';
import ImageUpload from './ImageUpload';
import DragOverlay from './DragOverlay';
import type { Route } from 'next';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  initialData: Gallery | null;
};

const GalleryForm: FC<Props> = ({ initialData }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();

  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const isNew = !initialData;
  const title = initialData ? 'Ubah Foto' : 'Tambah Foto';
  const description = initialData
    ? 'Perbarui detail foto galeri.'
    : 'Tambahkan dokumentasi foto baru ke galeri.';
  const action = initialData ? 'Simpan Perubahan' : 'Tambah Foto';

  // Fetch list of events for dropdown selection
  const { data: events = [] } = useQuery({
    queryKey: ['all-events-dropdown'],
    queryFn: () => getAllEvents(),
  });

  const form = useForm<GalleryValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '',
      featured: initialData?.featured || false,
      eventId: initialData?.eventId || null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description || '',
        imageUrl: initialData.imageUrl,
        featured: initialData.featured,
        eventId: initialData.eventId || null,
      });
    }
  }, [initialData, form]);

  const submitMutation = useMutation({
    mutationFn: (values: GalleryValues) =>
      isNew ? createGallery(values) : updateGallery(initialData.id, values),
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

  const deleteMutation = useMutation({
    mutationFn: () => deleteGallery(initialData!.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus foto.');
        return;
      }
      toast.success('Foto berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['galleries'] });
      router.push('/admin/master/galleries' as Route);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await uploadImage(file, 'galleries');
      if (res.success && res.url) {
        form.setValue('imageUrl', res.url, { shouldValidate: true, shouldDirty: true });
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, onChange: (url: string) => void) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB.');
        return;
      }

      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        URL.revokeObjectURL(img.src);

        if (width < 400 || height < 400) {
          toast.error(`Ukuran gambar terlalu kecil (${width}x${height}px). Minimal 400x400px.`);
          return;
        }

        handleImageUpload(file);
      };
    }
  };

  return (
    <section className="space-y-6">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && hasPermission('galleries.delete') && (
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant="destructive"
            size="sm"
            onClick={() => setIsAlertOpen(true)}
            aria-label="Hapus Foto"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <form
        onSubmit={form.handleSubmit((v) => submitMutation.mutate(v))}
        className="space-y-8 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kiri: Detail Informasi Foto */}
          <div className="space-y-6">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Judul Foto <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="Masukkan judul foto dokumentasi" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Deskripsi (opsional)</FieldLabel>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="Tulis penjelasan singkat mengenai foto..."
                      className="h-28"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="eventId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Event Terkait (opsional)</FieldLabel>
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="featured"
                control={form.control}
                render={({ field }) => (
                  <Field
                    orientation="horizontal"
                    className="justify-between items-center border p-4 rounded-xl"
                  >
                    <div className="flex flex-col gap-1">
                      <FieldLabel className="text-sm font-semibold">
                        Tampilkan di Landing Page
                      </FieldLabel>
                      <span className="text-xs text-muted-foreground">
                        Jadikan foto unggulan pada Bento Grid Landing Page.
                      </span>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Kanan: Foto Galeri Upload */}
          <div className="space-y-6">
            <FieldGroup>
              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field.onChange)}
                  >
                    <ImageUpload
                      value={field.value}
                      isUploading={isUploading}
                      onUpload={handleImageUpload}
                      onSelect={(url: string) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                    <DragOverlay isDragging={isDragging} isReplacing={!!field.value} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                )}
              />
            </FieldGroup>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href={'/admin/master/galleries' as Route}>Batal</Link>
          </Button>
          <Button type="submit" disabled={submitMutation.isPending || isUploading}>
            {submitMutation.isPending ? 'Menyimpan...' : action}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default GalleryForm;
