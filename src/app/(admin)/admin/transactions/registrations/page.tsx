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
import { useRegistrationsList } from './_components/useRegistrationsList';

const RegistrationsCMS: FC = () => {
  const {
    setPage,
    search,
    setLimit,
    registrations,
    meta,
    isLoading,
    handleSearchChange,
    eventId,
    setEventId,
    statusFilter,
    setStatusFilter,
    events,
  } = useRegistrationsList();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title={`Pendaftaran Event (${meta.total})`}
          description="Lihat dan kelola daftar riwayat pendaftaran event seluruh peserta."
        />
      </div>
      <Separator />
      <DataTable
        searchKey="registrationNumber"
        columns={Columns}
        data={registrations}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari no. registrasi, event, atau peserta..."
        customFilters={
          <div className="flex gap-2">
            <Select value={eventId || ''} onValueChange={(value) => setEventId(value || undefined)}>
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Semua Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Event</SelectItem>
                {events.map((event: any) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter || ''}
              onValueChange={(value) => setStatusFilter(value || undefined)}
            >
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Status</SelectItem>
                <SelectItem value="WAITING_PAYMENT">Menunggu Pembayaran</SelectItem>
                <SelectItem value="REGISTERED">Terdaftar</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                <SelectItem value="CHECKED_IN">Hadir</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />
    </section>
  );
};

export default RegistrationsCMS;
