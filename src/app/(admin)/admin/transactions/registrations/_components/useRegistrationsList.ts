import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import moment from 'moment';
import 'moment/locale/id';

import { useDebounce } from '@/hooks/useDebounce';
import {
  getRegistrations,
  getEventsForFilter,
  exportRegistrationsData,
} from '@/services/registrations';

export const useRegistrationsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useDebounce('', 500);
  const [limit, setLimit] = useState(5);
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const res = await exportRegistrationsData(search, eventId, statusFilter);
      if (!res.success || !res.data) {
        toast.error(res.error || 'Gagal mengeksport data.');
        return;
      }

      if (res.data.length === 0) {
        toast.error('Tidak ada data registrasi untuk dieksport.');
        return;
      }

      const statusLabels: Record<string, string> = {
        WAITING_PAYMENT: 'Menunggu Pembayaran',
        REGISTERED: 'Terdaftar',
        CANCELLED: 'Dibatalkan',
        CHECKED_IN: 'Hadir',
      };

      const selectedEventTitle = events.find((e) => e.id === eventId)?.title || 'Semua Event';
      const selectedStatusLabel = statusLabels[statusFilter || ''] || 'Semua Status';
      const exportDate = moment().locale('id').format('DD MMMM YYYY, HH:mm');

      const escapeXml = (str: string | number) => {
        if (str === null || str === undefined) return '';
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      };

      const rowsXml = res.data
        .map((item, index) => {
          const num = index + 1;
          const regNo = escapeXml(item.registrationNumber);
          const name = escapeXml(item.user?.name || '-');
          const email = escapeXml(item.user?.email || '-');
          const eventTitle = escapeXml(item.event?.title || '-');
          const eventType = escapeXml(item.event?.price > 0 ? 'Berbayar' : 'Gratis');
          const price = escapeXml(
            item.event?.price ? `Rp ${item.event.price.toLocaleString('id-ID')}` : 'Rp 0'
          );
          const status = escapeXml(statusLabels[item.status] || item.status);
          const date = escapeXml(moment(item.createdAt).locale('id').format('DD MMMM YYYY, HH:mm'));

          return `   <Row ss:Height="20">
    <Cell ss:StyleID="CenterCell"><Data ss:Type="Number">${num}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${regNo}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${name}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${email}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${eventTitle}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${eventType}</Data></Cell>
    <Cell ss:StyleID="DataCell"><Data ss:Type="String">${price}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${status}</Data></Cell>
    <Cell ss:StyleID="CenterCell"><Data ss:Type="String">${date}</Data></Cell>
   </Row>`;
        })
        .join('\n');

      const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#141413"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="MetaLabel">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#87867F"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="MetaValue">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#141413"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#D97757" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
   </Borders>
  </Style>
  <Style ss:ID="DataCell">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#141413"/>
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
   </Borders>
  </Style>
  <Style ss:ID="CenterCell">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#141413"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E3DACC"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Laporan Pendaftaran">
  <Table>
   <Column ss:Width="40"/>
   <Column ss:Width="160"/>
   <Column ss:Width="180"/>
   <Column ss:Width="200"/>
   <Column ss:Width="240"/>
   <Column ss:Width="100"/>
   <Column ss:Width="120"/>
   <Column ss:Width="160"/>
   <Column ss:Width="160"/>
   <Row ss:Height="30">
    <Cell ss:StyleID="Title" ss:MergeAcross="8"><Data ss:Type="String">LAPORAN REKAPITULASI PENDAFTARAN EVENT - SITIVENT</Data></Cell>
   </Row>
   <Row><Cell ss:StyleID="MetaLabel" ss:MergeAcross="1"><Data ss:Type="String">Filter Event:</Data></Cell><Cell ss:StyleID="MetaValue" ss:MergeAcross="6"><Data ss:Type="String">${escapeXml(selectedEventTitle)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="MetaLabel" ss:MergeAcross="1"><Data ss:Type="String">Filter Status:</Data></Cell><Cell ss:StyleID="MetaValue" ss:MergeAcross="6"><Data ss:Type="String">${escapeXml(selectedStatusLabel)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="MetaLabel" ss:MergeAcross="1"><Data ss:Type="String">Tanggal Export:</Data></Cell><Cell ss:StyleID="MetaValue" ss:MergeAcross="6"><Data ss:Type="String">${escapeXml(exportDate)}</Data></Cell></Row>
   <Row><Cell ss:StyleID="MetaLabel" ss:MergeAcross="1"><Data ss:Type="String">Total Data:</Data></Cell><Cell ss:StyleID="MetaValue" ss:MergeAcross="6"><Data ss:Type="String">${res.data.length} Peserta</Data></Cell></Row>
   <Row></Row>
   <Row ss:Height="25">
    <Cell ss:StyleID="Header"><Data ss:Type="String">No.</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">No. Registrasi</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Peserta</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Email</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Nama Event</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Tipe Event</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Harga Tiket</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Status Pendaftaran</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Tanggal Pendaftaran</Data></Cell>
   </Row>
${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

      const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const sanitizedTitle = selectedEventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      const dateStr = moment().format('YYYY-MM-DD');

      link.href = url;
      link.setAttribute('download', `laporan-pendaftaran-${sanitizedTitle}-${dateStr}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Berhasil meng-export ${res.data.length} data pendaftaran!`);
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat meng-export data.');
    } finally {
      setIsExporting(false);
    }
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
    isExporting,
    handleExportExcel,
  };
};
