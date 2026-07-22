'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import {
  Award,
  ChevronsUpDown,
  FileDown,
  Video,
  Star,
  MessageSquarePlus,
  Edit3,
} from 'lucide-react';
import moment from 'moment';
import 'moment/locale/id';

import Heading from '@/components/Common/Heading';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getParticipantRegistrations } from '@/services/registrations';
import TestimonialModal from './_components/TestimonialModal';

interface RegistrationWithParticipant {
  id: string;
  registrationNumber: string;
  status: string;
  createdAt: Date;
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    status: string;
    certificateEnabled: boolean;
    eventType: string;
    meetingLink: string | null;
  };
  certificates: Array<{ id: string; downloadUrl: string }>;
  testimonial?: {
    id: string;
    rating: number;
    comment: string;
  } | null;
}

const getColumns = (
  onOpenTestimonial: (registration: RegistrationWithParticipant) => void
): ColumnDef<RegistrationWithParticipant>[] => [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        No. Registrasi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-mono text-sm">{row.original.registrationNumber}</span>,
  },
  {
    accessorKey: 'event',
    header: 'Event',
    cell: ({ row }) => {
      const event = row.original.event;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{event.title}</span>
          <span className="text-xs text-muted-foreground">{event.location}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const labelMap: Record<string, string> = {
        WAITING_PAYMENT: 'Menunggu Pembayaran',
        REGISTERED: 'Terdaftar',
        CANCELLED: 'Dibatalkan',
        CHECKED_IN: 'Hadir',
      };
      const classMap: Record<string, string> = {
        WAITING_PAYMENT: 'bg-amber-500/10 text-amber-600 border-amber-200',
        REGISTERED: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
        CANCELLED: 'bg-rose-500/10 text-rose-600 border-rose-200',
        CHECKED_IN: 'bg-blue-500/10 text-blue-600 border-blue-200',
      };

      return (
        <Badge variant="outline" className={`font-semibold px-2 py-0.5 ${classMap[status] || ''}`}>
          {labelMap[status] || status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Daftar',
    cell: ({ row }) => (
      <span className="text-sm">
        {moment(row.original.createdAt).locale('id').format('DD MMM YYYY, HH:mm')}
      </span>
    ),
  },
  {
    accessorKey: 'certificate',
    header: 'Sertifikat',
    cell: ({ row }) => {
      const certificate = row.original.certificates[0];
      const canDownload =
        row.original.status === 'CHECKED_IN' &&
        row.original.event.certificateEnabled &&
        certificate;

      return canDownload ? (
        <Button asChild variant="outline" size="xs">
          <a href={certificate.downloadUrl} target="_blank" rel="noopener noreferrer">
            <FileDown className="mr-1 h-3.5 w-3.5" /> Unduh
          </a>
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'meetingLink',
    header: 'Link Meeting',
    cell: ({ row }) => {
      const event = row.original.event;
      return event.eventType === 'ONLINE' && event.meetingLink ? (
        <Button asChild variant="outline" size="xs">
          <a href={event.meetingLink} target="_blank" rel="noopener noreferrer">
            <Video className="mr-1 h-3.5 w-3.5" /> Gabung
          </a>
        </Button>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: 'testimonial',
    header: 'Testimoni',
    cell: ({ row }) => {
      const isEligible =
        row.original.status === 'CHECKED_IN' && row.original.event.status === 'COMPLETED';

      if (!isEligible) {
        return <span className="text-xs text-muted-foreground">—</span>;
      }

      const existing = row.original.testimonial;

      return existing ? (
        <Button
          variant="outline"
          size="xs"
          className="gap-1 border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400"
          onClick={() => onOpenTestimonial(row.original)}
        >
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span>{existing.rating}/5</span>
          <Edit3 className="h-3 w-3 ml-0.5 opacity-60" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="xs"
          className="gap-1 text-xs"
          onClick={() => onOpenTestimonial(row.original)}
        >
          <MessageSquarePlus className="h-3.5 w-3.5 text-amber-500" />
          Beri Ulasan
        </Button>
      );
    },
  },
];

export default function EventHistoryPage() {
  const [selectedReg, setSelectedReg] = useState<RegistrationWithParticipant | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['participant-registrations'],
    queryFn: getParticipantRegistrations,
  });

  const registrations = (data?.data as RegistrationWithParticipant[]) || [];

  return (
    <section className="space-y-4">
      <Heading
        title={`Riwayat Event (${registrations.length})`}
        description="Lihat seluruh event yang pernah Anda daftarkan dan berikan testimoni event yang telah selesai."
      />
      <Separator />
      {registrations.length === 0 && !isLoading ? (
        <div className="rounded-xl border p-6">
          <Empty className="border-0 p-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Award className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Belum ada riwayat event</EmptyTitle>
              <EmptyDescription>Anda belum pernah mendaftar ke event apapun.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <DataTable
          searchKey="registrationNumber"
          columns={getColumns(setSelectedReg)}
          data={registrations}
          isFetching={isLoading}
          pageCount={1}
          placeholderSearch="Cari no. registrasi atau event..."
        />
      )}

      {selectedReg && (
        <TestimonialModal
          isOpen={Boolean(selectedReg)}
          onClose={() => setSelectedReg(null)}
          registrationId={selectedReg.id}
          eventTitle={selectedReg.event.title}
          existingTestimonial={selectedReg.testimonial}
        />
      )}
    </section>
  );
}
