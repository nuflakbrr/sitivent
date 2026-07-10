import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import {
  getCertificates,
  getCompletedEventsWithCertStats,
  generateCertificatesForEvent,
  generateCertificatesForAllEvents,
  getEventsWithCertificateEnabled,
} from '@/services/certificates';
import { toast } from 'sonner';

export const useCertificatesList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [eventId, setEventId] = useState<string | undefined>(undefined);

  // Certificates list query
  const { data: certsData, isLoading: isCertsLoading } = useQuery({
    queryKey: ['certificates', page, debouncedSearch, limit, eventId],
    queryFn: () => getCertificates(page, limit, debouncedSearch, eventId),
  });

  // Events query for stats
  const { data: eventsData, isLoading: isEventsLoading } = useQuery({
    queryKey: ['completed-events-certs'],
    queryFn: () => getCompletedEventsWithCertStats(),
  });

  // Events query for filter dropdown
  const { data: eventsWithCertData } = useQuery({
    queryKey: ['events-with-cert-enabled'],
    queryFn: () => getEventsWithCertificateEnabled(),
  });

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: (id?: string) =>
      id ? generateCertificatesForEvent(id) : generateCertificatesForAllEvents(),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || 'Sertifikat berhasil diproses.');
        queryClient.invalidateQueries({ queryKey: ['certificates'] });
        queryClient.invalidateQueries({ queryKey: ['completed-events-certs'] });
      } else {
        toast.error(res.error || 'Gagal memproses sertifikat.');
      }
    },
    onError: () => {
      toast.error('Terjadi kesalahan sistem.');
    },
  });

  const certificates = certsData?.data || [];
  const meta = certsData?.meta || { total: 0, page: 1, lastPage: 0 };
  const completedEvents = eventsData?.data || [];
  const eventsWithCert = eventsWithCertData?.data || [];

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setDebouncedSearch(v);
    setPage(1);
  };

  const handleEventChange = (v: string | undefined) => {
    setEventId(v);
    setPage(1);
  };

  const handleGenerate = (id?: string) => {
    generateMutation.mutate(id);
  };

  return {
    page,
    setPage,
    search,
    limit,
    setLimit,
    eventId,
    setEventId,
    certificates,
    meta,
    completedEvents,
    eventsWithCert,
    isLoading: isCertsLoading || isEventsLoading,
    isGenerating: generateMutation.isPending,
    handleSearchChange,
    handleEventChange,
    handleGenerate,
  };
};
