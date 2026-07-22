'use client';
import { type FC, useState } from 'react';
import Link from 'next/link';
import { Plus, Settings, RefreshCw } from 'lucide-react';

import { usePermission } from '@/providers/PermissionProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';
import { useCertificatesList } from './_components/useCertificatesList';
import AlertModal from '@/components/Common/Modals/AlertModal';
import type { EventStatus } from '@/generated/prisma/enums';

interface EventWithCertTyped {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  location: string;
  status: EventStatus;
  certificateTemplate?: {
    id: string;
    backgroundUrl: string | null;
    numberTemplate: string;
  } | null;
}

const CertificatesCMS: FC = () => {
  const { hasPermission } = usePermission();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const {
    setPage,
    search,
    limit,
    setLimit,
    certificates,
    meta,
    isLoading,
    handleSearchChange,
    eventsWithCert,
    eventId,
    handleEventChange,
    handleGenerate,
    isGenerating,
  } = useCertificatesList();

  return (
    <section>
      <AlertModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          handleGenerate(eventId);
          setIsConfirmOpen(false);
        }}
        loading={isGenerating}
        title="Apakah Anda yakin?"
        desc={
          eventId
            ? 'Apakah Anda yakin ingin menyinkronkan sertifikat untuk event ini? Jika format template berubah, nomor sertifikat akan diperbarui dan status unduhan peserta akan di-reset.'
            : 'Apakah Anda yakin ingin menyinkronkan sertifikat untuk SEMUA event? Proses ini akan memproses semua data event yang aktif.'
        }
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Manajemen Sertifikat (${meta.total})`}
          description="Pantau dan kelola sertifikat elektronik untuk peserta event."
        />
        <div className="flex flex-wrap items-center gap-2 mt-3 sm:mt-0">
          {hasPermission('certificates.create') && (
            <Button
              onClick={() => setIsConfirmOpen(true)}
              disabled={isGenerating || isLoading}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {eventId ? 'Sinkronisasi Event Ini' : 'Sinkronisasi Semua Event'}
            </Button>
          )}
          {hasPermission('certificates.create') && (
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/master/certificates/template">
                <Settings className="h-4 w-4 mr-2" /> Konfigurasi Template
              </Link>
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <DataTable
        searchKey="certificateNumber"
        columns={Columns}
        data={certificates}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari No. Sertifikat, Event, atau Nama..."
        customFilters={
          <Select
            value={eventId || ''}
            onValueChange={(value) => handleEventChange(value || undefined)}
          >
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue placeholder="Semua Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Event</SelectItem>
              {eventsWithCert.map((event: EventWithCertTyped) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />
    </section>
  );
};

export default CertificatesCMS;
