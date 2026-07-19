'use client';

import { use } from 'react';
import { type FC } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/Common/Heading';
import { DataTable } from '@/components/ui/data-table';
import Columns from './_components/Columns';
import { useTenantMembers } from './_components/useTenantMembers';
import { AddMemberDialog } from './_components/AddMemberDialog';
import type { Route } from 'next';

type PageProps = {
  params: Promise<{ tenant: string; id: string }>;
};

const TenantMembersPage: FC<PageProps> = (props) => {
  const params = use(props.params);
  const { members, total, isLoading, handleSearchChange, search, refetch } = useTenantMembers(
    params.id
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Heading
          title={`Member Tenant (${total})`}
          description="Kelola pengguna yang tergabung pada tenant ini. 1 user bisa masuk banyak tenant."
        />
        <div className="flex items-center gap-2">
          <AddMemberDialog tenantId={params.id} onSuccess={refetch} />
          <Button asChild variant="outline">
            <Link href={`/admin/${params.tenant}/managements/tenants/${params.id}` as Route}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Link>
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable
        searchKey="user.email"
        columns={Columns}
        data={members}
        isFetching={isLoading}
        pageCount={1}
        placeholderSearch="Cari user..."
        onSearchChange={handleSearchChange}
        searchValue={search}
      />
    </section>
  );
};

export default TenantMembersPage;
