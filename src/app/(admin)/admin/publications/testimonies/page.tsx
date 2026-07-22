'use client';

import { useState, type FC } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/Common/Heading';
import Columns from './_components/Columns';
import { useDebounce } from '@/hooks/useDebounce';
import { getTestimonies } from '@/services/testimonials';
import { getEventsForFilter } from '@/services/registrations';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TestimoniesCMS: FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['testimonies', page, limit, debouncedSearch, eventId],
    queryFn: () => getTestimonies(page, limit, debouncedSearch, eventId),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events-for-filter'],
    queryFn: () => getEventsForFilter(),
  });

  const testimonies = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const events = eventsData?.data || [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
    setPage(1);
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 md:mb-4">
        <Heading
          title={`Ulasan & Testimoni (${meta.total})`}
          description="Kelola dan pantau ulasan serta testimoni yang diberikan oleh peserta event."
        />
      </div>
      <Separator />
      <DataTable
        searchKey="comment"
        columns={Columns}
        data={testimonies}
        isFetching={isLoading}
        pageCount={meta.lastPage}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => setLimit(l)}
        onSearchChange={handleSearchChange}
        searchValue={search}
        placeholderSearch="Cari ulasan, nama peserta, atau event..."
        customFilters={
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select
              value={eventId || ''}
              onValueChange={(value) => {
                setEventId(value || undefined);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-50">
                <SelectValue placeholder="Semua Event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Event</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />
    </section>
  );
};

export default TestimoniesCMS;
