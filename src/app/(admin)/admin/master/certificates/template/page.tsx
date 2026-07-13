'use client';
import { useState } from 'react';
import { AlertCircle, Settings, CheckCircle2, ChevronRight, ArrowLeft, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getEventsWithCertificateEnabled } from '@/services/certificates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import Heading from '@/components/Common/Heading';
import CertificateTemplateForm from './_components/CertificateTemplateForm';
import { useDebounce } from '@/hooks/useDebounce';

export default function TemplateConfigPage() {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce<string>('', 500);

  const { data } = useQuery({
    queryKey: ['events-with-cert-enabled'],
    queryFn: () => getEventsWithCertificateEnabled(),
  });

  const events = data?.data ?? [];
  const filteredEvents = events.filter((event: any) =>
    event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  const selectedEvent = filteredEvents.find((e: any) => e.id === selectedEventId);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <Heading
          title="Konfigurasi Template Sertifikat"
          description="Kelola template sertifikat per event"
        />
        <Button variant="outline" asChild>
          <Link href="/admin/master/certificates">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
          </Link>
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col lg:flex-row gap-4 items-start mt-4">
        <div className="w-full lg:w-72 shrink-0">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="pb-3 border-b border-foreground/5 px-4 pt-4">
              <CardTitle className="text-sm font-bold">Pilih Event</CardTitle>
              <CardDescription className="text-xs">
                Event dengan sertifikat diaktifkan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari event..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setDebouncedSearchTerm(e.target.value);
                    }}
                    className="pl-8"
                  />
                </div>
              </div>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-muted-foreground">
                  <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
                  <p className="text-xs text-center">
                    Aktifkan fitur sertifikat pada pengaturan event.
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-muted-foreground">
                  <AlertCircle className="h-6 w-6 text-muted-foreground/50" />
                  <p className="text-xs text-center">
                    Tidak ada event yang sesuai dengan pencarian.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-foreground/5">
                  {filteredEvents.map((event: any) => {
                    const isSelected = selectedEventId === event.id;
                    const isConfigured = !!event.certificateTemplate;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-primary/5 border-l-2 border-l-primary'
                            : 'hover:bg-muted/40 border-l-2 border-l-transparent'
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <p
                            className={`text-xs font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}
                          >
                            {event.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {isConfigured ? (
                              <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Terkonfigurasi
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">
                                Belum dikonfigurasi
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 shrink-0 transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="pb-3 border-b border-foreground/5">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base font-bold">Konfigurasi Template</CardTitle>
                  <CardDescription>Background, nomor sertifikat, dan e-signature</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {selectedEventId && selectedEvent ? (
                <CertificateTemplateForm
                  eventId={selectedEventId}
                  eventTitle={selectedEvent.title}
                  eventStartDate={selectedEvent.startDate}
                  eventLocation={selectedEvent.location}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                  <Settings className="h-10 w-10 text-muted-foreground/30" />
                  <p className="text-sm">Pilih event di panel kiri untuk mulai konfigurasi.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
