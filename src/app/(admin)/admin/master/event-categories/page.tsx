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
import { useEventCategoriesList } from './_components/useEventCategoriesList';
import type { Route } from 'next';

const EventCategoriesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const { setPage, search, limit, setLimit, categories, meta, isLoading, handleSearchChange } =
    useEventCategoriesList();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`Kategori Event (${meta.total})`}
          description="Kelola kategori untuk mengelompokkan event berdasarkan jenisnya."
        />
        {hasPermission('event.categories.create') && (
          <Button asChild>
            <Link href={'/admin/master/event-categories/new' as Route}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={categories}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari kategori..."
      />
    </section>
  );
};

export default EventCategoriesCMS;
