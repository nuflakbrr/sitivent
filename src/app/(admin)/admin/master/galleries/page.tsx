'use client';
import { type FC } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { usePermission } from '@/providers/PermissionProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';
import { useGalleriesList } from './_components/useGalleriesList';
import type { Route } from 'next';

const GalleriesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const { setPage, search, limit, setLimit, galleries, meta, isLoading, handleSearchChange } =
    useGalleriesList();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`Galeri Foto (${meta.total})`}
          description="Kelola dokumentasi foto event untuk dipublikasikan pada website."
        />
        {hasPermission('galleries.create') && (
          <Button asChild>
            <Link href={'/admin/master/galleries/new' as Route}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Foto
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={galleries}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari judul atau deskripsi foto..."
      />
    </section>
  );
};

export default GalleriesCMS;
