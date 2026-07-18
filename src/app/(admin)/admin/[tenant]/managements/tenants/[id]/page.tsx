'use client';

import { use, useState, type FC } from 'react';
import { ArrowLeft, Trash, Users } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import AlertModal from '@/components/Common/Modals/AlertModal';
import TenantForm from './_components/TenantForm';
import { deleteTenant } from '@/services/tenants';
import type { Route } from 'next';

type PageProps = {
  params: Promise<{ tenant: string; id: string }>;
};

const TenantFormPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const { mutate: handleDelete, isPending: isDeletePending } = useMutation({
    mutationFn: () => deleteTenant(params.id),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.error || 'Gagal menghapus tenant.');
        return;
      }
      toast.success(res.message || 'Tenant berhasil dihapus.');
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      router.push(`/admin/${params.tenant}/managements/tenants` as Route);
    },
    onError: () => toast.error('Terjadi kesalahan saat menghapus.'),
  });

  return (
    <section>
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => handleDelete()}
        loading={isDeletePending}
        title="Hapus Tenant"
        desc="Apakah Anda yakin ingin menghapus tenant ini? Semua data terkait akan ikut terhapus."
      />
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={isNew ? 'Tambah Tenant' : 'Ubah Tenant'}
          description={isNew ? 'Buat organisasi baru.' : 'Perbarui informasi organisasi.'}
        />
        <div className="flex gap-2">
          {!isNew && (
            <Button asChild variant="outline">
              <Link
                href={`/admin/${params.tenant}/managements/tenants/${params.id}/members` as Route}
              >
                <Users className="mr-2 h-4 w-4" /> Member
              </Link>
            </Button>
          )}
          {!isNew && (
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeletePending}
              onClick={() => setIsAlertOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Separator className="mb-6" />
      <TenantForm id={params.id} />
    </section>
  );
};

export default TenantFormPage;
