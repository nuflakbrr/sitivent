'use client';

import { type FC } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
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

interface EventFilterOption {
  id: string;
  title: string;
}

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
    isExporting,
    handleExportExcel,
  } = useRegistrationsList();

  const EventFilterOptions: EventFilterOption[] = events || [];

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Pendaftaran Event (${meta.total})`}
          description="Lihat dan kelola daftar riwayat pendaftaran event seluruh peserta."
        />
        <Button
          onClick={handleExportExcel}
          disabled={isExporting}
          variant="outline"
          className="w-full sm:w-auto font-medium"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Meng-export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4 text-emerald-600" /> Export Excel
            </>
          )}
        </Button>
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={eventId || ''} onValueChange={(value) => setEventId(value || undefined)}>
              <SelectTrigger className="w-full sm:w-50">
                <SelectValue placeholder="Semua Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Event</SelectItem>
                {EventFilterOptions.map((event) => (
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
              <SelectTrigger className="w-full sm:w-50">
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
