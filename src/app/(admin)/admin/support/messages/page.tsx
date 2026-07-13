'use client';

import { type FC } from 'react';

import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Columns from './_components/Columns';
import { useSupportMessagesList } from './_components/useSupportMessagesList';

const SupportMessagesPage: FC = () => {
  const {
    setPage,
    search,
    setLimit,
    messages,
    meta,
    isLoading,
    handleSearchChange,
    statusFilter,
    setStatusFilter,
  } = useSupportMessagesList();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`Inbox Pengaduan (${meta.total})`}
          description="Kelola aduan bantuan pelanggan dan hubungi langsung via WhatsApp."
        />
      </div>
      <Separator />
      <DataTable
        searchKey="title"
        columns={Columns}
        data={messages}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari nama, email, subjek..."
        customFilters={
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || 'ALL')}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESS">Proses</SelectItem>
                <SelectItem value="RESOLVED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </section>
  );
};

export default SupportMessagesPage;
