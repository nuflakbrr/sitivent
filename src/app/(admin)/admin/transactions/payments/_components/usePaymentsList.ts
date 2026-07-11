import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getPayments } from '@/services/payments';

export const usePaymentsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);

  const { data, isLoading } = useQuery({
    queryKey: ['payments', page, limit, debouncedSearch],
    queryFn: () => getPayments(page, limit, debouncedSearch),
  });

  const payments = data?.data || [];
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
    payments,
    meta,
    isLoading,
    handleSearchChange,
  };
};
