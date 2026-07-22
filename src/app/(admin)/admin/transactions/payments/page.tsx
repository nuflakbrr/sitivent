'use client';
import { type FC } from 'react';

import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';
import { usePaymentsList } from './_components/usePaymentsList';

const PaymentsCMS: FC = () => {
  const { setPage, search, setLimit, payments, meta, isLoading, handleSearchChange } =
    usePaymentsList();

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Transaksi Pembayaran (${meta.total})`}
          description="Verifikasi bukti transfer manual pembayaran pendaftaran event dari peserta."
        />
      </div>
      <Separator />
      <DataTable
        searchKey="registrationNumber"
        columns={Columns}
        data={payments}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari no. registrasi, event, atau peserta..."
      />
    </section>
  );
};

export default PaymentsCMS;
