import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getTenants } from '@/services/tenants';

export const useTenantsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ['tenants', page, limit, debouncedSearch],
    queryFn: () => getTenants(page, limit, debouncedSearch),
  });

  const tenants = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, lastPage: 0 };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  return { page, setPage, search, limit, setLimit, tenants, meta, isLoading, handleSearchChange };
};
