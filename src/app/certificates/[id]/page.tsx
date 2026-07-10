'use client';
import { use, useEffect, useState } from 'react';
import {
  getCertificateById,
  updateDownloadTime,
  getCertificateTemplate,
} from '@/services/certificates';
import { Button } from '@/components/ui/button';
import { Printer, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CertificatePage(props: PageProps) {
  const params = use(props.params);
  const [cert, setCert] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCertificateById(params.id);
        if (data) {
          setCert(data);
          await updateDownloadTime(params.id);
          // Load template for this event
          const tmpl = await getCertificateTemplate(data.eventId);
          if (tmpl.success) setTemplate(tmpl.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat sertifikat');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm font-medium">Memuat sertifikat...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
        <Award className="h-16 w-16 text-red-500 stroke-1" />
        <h1 className="text-xl font-bold mt-4">Sertifikat Tidak Ditemukan</h1>
        <p className="text-muted-foreground text-sm mt-2">
          Sertifikat tidak valid atau telah dihapus.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/participant/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const signatures = template?.signatures ?? [];
  const backgroundUrl = template?.backgroundUrl ?? null;
  const showIssuedDate = template?.showIssuedDate ?? true;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center justify-center print:p-0 print:bg-white">
      {/* Action Bar (Hidden on Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 no-print print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/participant/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* Certificate Container */}
      <div
        id="certificate-container"
        className="w-full max-w-4xl aspect-[1.414/1] bg-white text-zinc-900 relative shadow-2xl overflow-hidden flex flex-col justify-between items-center print:shadow-none print:m-0 print:w-full print:h-full print:aspect-auto"
        style={
          !backgroundUrl
            ? { padding: '2rem 4rem', border: '12px double #d4d4d8', borderRadius: '1.5rem' }
            : { padding: '2rem 4rem' }
        }
      >
        {/* ── Custom Background ── */}
        {backgroundUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundUrl}
              alt="certificate background"
              className="w-full h-full object-cover"
            />
            {/* Slight overlay so text is readable */}
            <div className="absolute inset-0 bg-white/30" />
          </div>
        )}

        {/* ── Decorative (only if no background) ── */}
        {!backgroundUrl && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-primary-50),transparent_50%)] opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-zinc-100 rounded-full -mr-20 -mb-20 opacity-20 pointer-events-none" />
          </>
        )}

        {/* All content sits above background */}
        <div className="relative z-10 w-full flex flex-col justify-between items-center h-full">
          {/* Top Header */}
          <div className="w-full flex flex-col items-center text-center space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-10 w-10 text-primary animate-pulse" />
              <span className="font-serif font-bold text-2xl tracking-wider text-zinc-800 uppercase">
                SITIVENT
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase font-mono">
              Sertifikat Partisipasi Resmi
            </span>
            <div className="w-24 h-0.5 bg-primary mx-auto mt-2" />
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col items-center text-center my-6 space-y-6">
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-wide text-zinc-800 uppercase">
              SERTIFIKAT
            </h2>
            <span className="text-sm font-medium text-muted-foreground italic font-serif">
              Dengan bangga diberikan kepada:
            </span>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-4xl font-bold border-b-2 border-zinc-200 px-6 pb-2 inline-block text-zinc-900 capitalize">
                {cert.user.name || cert.user.email}
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                No. Sertifikat: {cert.certificateNumber}
              </p>
            </div>
            <p className="text-sm text-zinc-700 max-w-xl mx-auto leading-relaxed">
              Atas partisipasi aktif sebagai peserta dalam event{' '}
              <strong className="text-zinc-900 font-semibold">{cert.event.title}</strong> yang
              diselenggarakan pada tanggal{' '}
              <strong className="text-zinc-900 font-semibold">
                {formatDate(cert.event.startDate)}
              </strong>{' '}
              di <strong className="text-zinc-900 font-semibold">{cert.event.location}</strong>.
            </p>
          </div>

          {/* Footer Area — Signatures */}
          <div className="w-full border-t border-zinc-100 pt-4">
            {signatures.length > 0 ? (
              <div className="flex items-end justify-center gap-12 flex-wrap">
                {/* Issue date on the left — conditional */}
                {showIssuedDate && (
                  <div className="text-left space-y-1">
                    <p className="text-[10px] text-muted-foreground font-semibold">
                      TANGGAL TERBIT
                    </p>
                    <p className="text-xs font-bold text-zinc-800">{formatDate(cert.createdAt)}</p>
                  </div>
                )}

                {/* Render each signature */}
                {signatures.map((sig: any) => (
                  <div key={sig.id} className="flex flex-col items-center space-y-1">
                    <div className="h-14 w-28 relative flex items-center justify-center">
                      <img
                        src={sig.signatureUrl}
                        alt={sig.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="border-t border-zinc-200 pt-1 px-3 text-center">
                      <p className="text-[10px] font-bold text-zinc-700 uppercase font-mono tracking-wide">
                        {sig.name}
                      </p>
                      {sig.title && (
                        <p className="text-[9px] text-zinc-500 font-mono">{sig.title}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback if no signatures configured */
              <div className="flex justify-between items-end">
                <div className="text-left space-y-1">
                  <p className="text-[10px] text-muted-foreground font-semibold">TANGGAL TERBIT</p>
                  <p className="text-xs font-bold text-zinc-800">{formatDate(cert.createdAt)}</p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-10 w-24 relative flex items-center justify-center">
                    <span className="font-serif italic text-zinc-400 text-sm">SITIVENT System</span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase font-mono tracking-wider border-t border-zinc-200 pt-1 px-4">
                    Panitia Penyelenggara
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          #certificate-container {
            border: none !important;
            box-shadow: none !important;
            padding: 2cm !important;
            width: 100% !important;
            height: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
