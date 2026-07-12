'use client';
import { useState, type FC, useEffect } from 'react';
import {
  Trash,
  Calendar as CalendarIcon,
  Globe,
  Landmark,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import type { Event } from '@/interfaces/features/events';
import { usePermission } from '@/providers/PermissionProvider';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { formatLocalTime } from '@/lib/formatLocalTime';
import { cn } from '@/lib/utils';
import RichTextEditor from '@/components/Common/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { uploadImage } from '@/services/uploads';
import ImageUpload from './ImageUpload';
import DragOverlay from './DragOverlay';
import { useEventForm } from './useEventForm';
import { toast } from 'sonner';
import { EventStatus, EventType } from '@/generated/prisma/enums';
import { slugify } from '@/lib/slugify';
import { getAllEventCategories } from '@/services/event-categories';

type Props = {
  initialData: Event | null;
};

const EventForm: FC<Props> = ({ initialData }) => {
  const { hasPermission, hasRole } = usePermission();
  const { form, onSubmit, onDelete, isAlertOpen, setIsAlertOpen, submitMutation, deleteMutation } =
    useEventForm(initialData);

  const [isUploading, setIsUploading] = useState(false);

  const isCompleted = initialData?.status === EventStatus.COMPLETED;
  const isSuper = hasRole('superadmin');
  const canEdit = !isCompleted || isSuper;

  const { data: categories } = useQuery({
    queryKey: ['event-categories'],
    queryFn: () => getAllEventCategories(),
  });

  const title = initialData ? 'Ubah Event' : 'Tambah Event';
  const description = initialData ? 'Ubah data event yang ada.' : 'Buat event baru';
  const action = initialData ? 'Simpan Perubahan' : 'Buat Event';

  // Auto generate slug from title when creating
  const eventTitle = form.watch('title');
  useEffect(() => {
    if (!initialData && eventTitle) {
      form.setValue('slug', slugify(eventTitle), { shouldValidate: true });
    }
  }, [eventTitle, initialData, form]);

  const [isDragging, setIsDragging] = useState(false);

  const handleBannerUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const res = await uploadImage(file, 'events');
      if (res.success && res.url) {
        form.setValue('banner', res.url, { shouldValidate: true, shouldDirty: true });
        toast.success('Banner berhasil diunggah.');
      } else {
        toast.error(res.error || 'Gagal mengunggah banner.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah banner.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, onChange: (url: string) => void) => {
    e.preventDefault();
    setIsDragging(false);
    if (!canEdit) return;

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

        handleBannerUpload(file);
      };
    }
  };

  const toDateString = (date?: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  };

  return (
    <section className="space-y-6">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={onDelete}
        loading={deleteMutation.isPending}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/master/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Heading title={title} description={description} />
        </div>
        {initialData && hasPermission('events.delete') && (
          <Button
            disabled={submitMutation.isPending || deleteMutation.isPending}
            variant="destructive"
            size="sm"
            onClick={() => setIsAlertOpen(true)}
            aria-label="Hapus Event"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      {isCompleted && !isSuper && (
        <div className="bg-amber-500/10 text-amber-600 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3 text-sm font-medium">
          Informasi: Event ini sudah selesai. Hanya Superadmin yang dapat melakukan pengubahan data.
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kiri: Detail Informasi Event */}
          <div className="space-y-6">
            <FieldGroup>
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Nama Event <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="Masukkan nama event" disabled={!canEdit} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Slug Event <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input {...field} placeholder="contoh-slug-event" disabled={!canEdit} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Kategori Event */}
              <Controller
                name="categoryId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Kategori Event</FieldLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {(categories || []).map((category) => {
                        const isSelected = field.value === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            disabled={!canEdit}
                            onClick={() => {
                              field.onChange(isSelected ? null : category.id);
                            }}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                              isSelected
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-transparent hover:border-zinc-500',
                              !canEdit && 'opacity-60 cursor-not-allowed'
                            )}
                          >
                            {category.name}
                          </button>
                        );
                      })}
                      {(!categories || categories.length === 0) && (
                        <p className="text-xs text-muted-foreground italic">
                          Belum ada kategori.{' '}
                          <Link
                            href="/admin/master/event-categories"
                            className="underline hover:text-foreground"
                          >
                            Buat kategori
                          </Link>
                        </p>
                      )}
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="eventType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Tipe Event <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EventType.ONLINE}>
                            <span className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-emerald-500" /> Online
                            </span>
                          </SelectItem>
                          <SelectItem value={EventType.OFFLINE}>
                            <span className="flex items-center gap-2">
                              <Landmark className="h-4 w-4 text-blue-500" /> Offline
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Status <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                        disabled={!canEdit}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EventStatus.DRAFT}>Draft</SelectItem>
                          <SelectItem value={EventStatus.PUBLISHED}>Published</SelectItem>
                          <SelectItem value={EventStatus.CLOSED}>Closed</SelectItem>
                          <SelectItem value={EventStatus.COMPLETED}>Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Lokasi / Tautan Ruangan <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Input
                      {...field}
                      placeholder="Masukkan alamat fisik atau link Zoom"
                      disabled={!canEdit}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="quota"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Kuota Peserta <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Kuota peserta"
                        disabled={!canEdit}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Biaya (IDR) <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Masukkan harga tiket"
                        disabled={!canEdit}
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="certificateEnabled"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="horizontal"
                    className="justify-between items-center border p-4 rounded-xl"
                  >
                    <div className="flex flex-col gap-1">
                      <FieldLabel className="text-sm font-semibold">
                        Aktifkan Sertifikat Elektronik
                      </FieldLabel>
                      <span className="text-xs text-muted-foreground">
                        Berikan sertifikat otomatis setelah event diselesaikan.
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!canEdit}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Kanan: Jadwal, Deadline & Banner */}
          <div className="space-y-6">
            <FieldGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="startDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Tanggal Mulai <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!canEdit}
                            className={cn(
                              'w-full justify-between text-left font-normal h-11 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-50 hover:bg-muted/50',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span>
                              {field.value ? formatLocalTime(field.value) : 'Pilih Tanggal Mulai'}
                            </span>
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date || undefined)}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="startTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Waktu Mulai <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Input {...field} type="time" disabled={!canEdit} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Tanggal Selesai <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            disabled={!canEdit}
                            className={cn(
                              'w-full justify-between text-left font-normal h-11 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-50 hover:bg-muted/50',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span>
                              {field.value ? formatLocalTime(field.value) : 'Pilih Tanggal Selesai'}
                            </span>
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date || undefined)}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="endTime"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        Waktu Selesai <span className="text-red-600">*</span>
                      </FieldLabel>
                      <Input {...field} type="time" disabled={!canEdit} />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="registrationDeadline"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      Batas Akhir Pendaftaran <span className="text-red-600">*</span>
                    </FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={!canEdit}
                          className={cn(
                            'w-full justify-between text-left font-normal h-11 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background text-zinc-900 dark:text-zinc-50 hover:bg-muted/50',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <span>
                            {field.value
                              ? formatLocalTime(field.value)
                              : 'Pilih Batas Akhir Pendaftaran'}
                          </span>
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date || undefined)}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="banner"
                control={form.control}
                render={({ field, fieldState }) => (
                  <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, field.onChange)}
                  >
                    <ImageUpload
                      value={field.value || ''}
                      isUploading={isUploading}
                      onUpload={handleBannerUpload}
                      onSelect={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                      disabled={!canEdit}
                      disabledMessage="Event ini sudah selesai dan tidak dapat diubah."
                    />
                    <DragOverlay isDragging={isDragging} isReplacing={!!field.value} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </div>
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Deskripsi Lengkap Event (RichTextEditor) */}
        <div className="space-y-4">
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Deskripsi Detail Event <span className="text-red-600">*</span>
                </FieldLabel>
                <div className={!canEdit ? 'pointer-events-none opacity-80' : ''}>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    folderName="events"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" type="button" asChild>
            <Link href="/admin/master/events">Batal</Link>
          </Button>
          {canEdit && (
            <Button type="submit" disabled={submitMutation.isPending || isUploading}>
              {submitMutation.isPending ? 'Menyimpan...' : action}
            </Button>
          )}
        </div>
      </form>
    </section>
  );
};

export default EventForm;
