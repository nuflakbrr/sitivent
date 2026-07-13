import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getSupportMessagesAction } from '@/services/support';

export const useSupportMessagesList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['support-messages', page, limit, debouncedSearch, statusFilter],
    queryFn: async () => {
      const res = await getSupportMessagesAction(page, limit, debouncedSearch, statusFilter);
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal mengambil data.');
      }
      return res;
    },
  });

  const messages = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  const handleStatusFilterChange = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    messages,
    meta,
    isLoading,
    handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
  };
};
