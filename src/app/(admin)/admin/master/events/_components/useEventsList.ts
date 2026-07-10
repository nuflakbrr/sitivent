import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getEvents } from '@/services/events';

export const useEventsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['events', page, limit, debouncedSearch],
    queryFn: () => getEvents(page, limit, debouncedSearch),
  });

  const events = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    events,
    meta,
    isLoading,
    handleSearchChange,
  };
};
