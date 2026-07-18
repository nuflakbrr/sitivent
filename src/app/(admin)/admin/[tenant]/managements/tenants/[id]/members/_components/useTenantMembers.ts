'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { getTenantMembers } from '@/services/tenant-members';

export const useTenantMembers = (tenantId: string) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tenant-members', tenantId, debouncedSearch],
    queryFn: () => getTenantMembers(tenantId),
    enabled: !!tenantId,
  });

  const members = data?.data || [];
  const total = data?.meta?.total || 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setDebouncedSearch(value);
  };

  return { search, setSearch, isLoading, refetch, handleSearchChange, members, total };
};
