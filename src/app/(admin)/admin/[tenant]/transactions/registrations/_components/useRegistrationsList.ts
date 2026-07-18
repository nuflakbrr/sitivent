import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getRegistrations, getEventsForFilter } from '@/services/registrations';

export const useRegistrationsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['registrations', page, limit, debouncedSearch, eventId, statusFilter],
    queryFn: () => getRegistrations(page, limit, debouncedSearch, eventId, statusFilter),
  });

  const { data: eventsData } = useQuery({
    queryKey: ['events-for-filter'],
    queryFn: () => getEventsForFilter(),
  });

  const registrations = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };
  const events = eventsData?.data || [];

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  const handleEventChange = (id: string | undefined) => {
    setEventId(id);
    setPage(1);
  };

  const handleStatusChange = (status: string | undefined) => {
    setStatusFilter(status);
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    eventId,
    setEventId: handleEventChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    events,
    registrations,
    meta,
    isLoading,
    handleSearchChange,
  };
};
