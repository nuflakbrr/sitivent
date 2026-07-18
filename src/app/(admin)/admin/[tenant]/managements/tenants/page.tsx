'use client';

import { type FC } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import { usePermission } from '@/providers/PermissionProvider';
import Columns from './_components/Columns';
import { useTenantsList } from './_components/useTenantsList';
import type { Route } from 'next';

const TenantsCMS: FC = () => {
  const { hasPermission } = usePermission();
  const { tenant } = useParams<{ tenant: string }>();
  const { setPage, search, limit, setLimit, tenants, meta, isLoading, handleSearchChange } =
    useTenantsList();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`Organisasi (${meta.total})`}
          description="Kelola tenant organisasi untuk multi-tenant admin."
        />
        {hasPermission('tenants.create') && (
          <Button asChild>
            <Link href={`/admin/${tenant}/managements/tenants/new` as Route}>
              <Plus className="h-4 w-4 mr-2" /> Tambah Tenant
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={Columns}
        data={tenants}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari tenant..."
      />
    </section>
  );
};

export default TenantsCMS;
