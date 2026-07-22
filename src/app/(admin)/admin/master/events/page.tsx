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
import { useEventsList } from './_components/useEventsList';

const EventsCMS: FC = () => {
  const { hasPermission } = usePermission();
  const { setPage, search, limit, setLimit, events, meta, isLoading, handleSearchChange } =
    useEventsList();

  return (
    <section>
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <Heading
          title={`Manajemen Event (${meta.total})`}
          description="Kelola daftar seminar, workshop, webinar, dan event lainnya."
        />
        {hasPermission('events.create') && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/master/events/new">
              <Plus className="h-4 w-4 mr-2" /> Tambah Event
            </Link>
          </Button>
        )}
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={events}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari event..."
      />
    </section>
  );
};

export default EventsCMS;
