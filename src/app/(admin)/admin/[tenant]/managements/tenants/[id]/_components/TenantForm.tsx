'use client';

import { useEffect, useMemo, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { createTenant, updateTenant, getTenantById } from '@/services/tenants';
import { tenantSchema, type TenantValues } from '@/schemas/tenants';
import { slugify } from '@/lib/slugify';
import type { Route } from 'next';

interface TenantFormProps {
  id: string;
}

const TenantForm: FC<TenantFormProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const { data: existing, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: () => getTenantById(id),
    enabled: !isNew,
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TenantValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: { name: '', slug: '', description: '' },
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        name: existing.data.name,
        slug: existing.data.slug,
        description: existing.data.description ?? '',
      });
    }
  }, [existing, reset]);

  const nameValue = useWatch({ control, name: 'name' });
  const autoSlug = useMemo(() => (nameValue ? slugify(nameValue) : ''), [nameValue]);

  useEffect(() => {
    if (isNew) {
      setValue('slug', autoSlug, { shouldValidate: true });
    }
  }, [autoSlug, isNew, setValue]);

  const { mutate: submitMutation, isPending: submitPending } = useMutation({
    mutationFn: (values: TenantValues) => (isNew ? createTenant(values) : updateTenant(id, values)),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Terjadi kesalahan.');
        return;
      }
      toast.success(res.message || 'Berhasil.');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      router.push('/admin/master/tenants' as Route);
    },
    onError: () => toast.error('Terjadi kesalahan.'),
  });

  // Live update slug from name (mirip EventForm: selalu update dari name)
  const name = watch('name');
  useEffect(() => {
    if (name) {
      setValue('slug', slugify(name), { shouldValidate: true });
    }
  }, [name, setValue]);

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((v) => submitMutation(v))} className="space-y-5 max-w-lg">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama Tenant</FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input id="name" placeholder="contoh: SITIVENT" {...field} />}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Input
                id="slug"
                placeholder="sitivent"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                readOnly={!isNew}
                className={!isNew ? 'bg-muted cursor-not-allowed' : ''}
              />
            )}
          />
          {errors.slug && <FieldError>{errors.slug.message}</FieldError>}
          {isNew && (
            <p className="text-xs text-muted-foreground">
              Slug otomatis diperbarui mengikuti nama tenant.
            </p>
          )}
          {!isNew && (
            <p className="text-xs text-muted-foreground">
              Slug tidak dapat diubah setelah pembuatan.
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi (opsional)</FieldLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Deskripsi singkat..."
                rows={3}
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.description && <FieldError>{errors.description.message}</FieldError>}
        </Field>
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/master/tenants' as Route)}
        >
          Batal
        </Button>
        <Button type="submit" disabled={submitPending}>
          {submitPending ? 'Menyimpan...' : isNew ? 'Buat Tenant' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
};

export default TenantForm;
