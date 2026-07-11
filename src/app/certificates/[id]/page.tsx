'use client';
import { use, useEffect, useState } from 'react';
import { getCertificateById, updateDownloadTime, checkUserIsAdmin } from '@/services/certificates';
import { Button } from '@/components/ui/button';
import { Printer, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Loader from '@/components/Common/Loader';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function CertificatePage(props: PageProps) {
  const params = use(props.params);
  const [cert, setCert] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [data, isUserAdmin] = await Promise.all([
          getCertificateById(params.id),
          checkUserIsAdmin(),
        ]);
        setIsAdmin(isUserAdmin);
        if (data) {
          setCert(data);
          await updateDownloadTime(params.id);
          if (data.event?.certificateTemplate) {
            setTemplate(data.event.certificateTemplate);
          }
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
      <div className="flex items-center justify-center w-full h-full min-h-screen">
        <Loader />
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
  const titleFont = template?.titleFont ?? 'Inter';
  const titleColor = template?.titleColor ?? '#000000';
  const contentFont = template?.contentFont ?? 'Inter';
  const contentColor = template?.contentColor ?? '#333333';
  const primaryColor = template?.primaryColor ?? '#3b82f6';
  const showEventDate = template?.showEventDate ?? true;
  const showEventLocation = template?.showEventLocation ?? false;
  const headerText = template?.headerText ?? 'SITIVENT';
  const headerSubtitle = template?.headerSubtitle ?? 'Sertifikat Partisipasi Resmi';
  const headerFont = template?.headerFont ?? 'Times New Roman';
  const headerColor = template?.headerColor ?? '#000000';
  const showHeader = template?.showHeader ?? true;
  const footerMarginBottom = template?.footerMarginBottom ?? 0;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center justify-center print:p-0 print:bg-white">
      {/* Action Bar (Hidden on Print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 no-print print:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={isAdmin ? '/admin/master/certificates' : '/participant/dashboard'}
            className="flex items-center gap-2"
          >
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
            ? {
                padding: '2rem 4rem',
                border: '12px double #d4d4d8',
                borderRadius: '1.5rem',
                color: contentColor,
                fontFamily: contentFont,
              }
            : {
                padding: '2rem 4rem',
                color: contentColor,
                fontFamily: contentFont,
              }
        }
      >
        {/* ── Custom Background ── */}
        {backgroundUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundUrl}
              alt="certificate background"
              className="w-full h-full object-fill"
            />
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
          <div
            className="w-full flex flex-col items-center text-center space-y-2"
            style={{ visibility: showHeader ? 'visible' : 'hidden' }}
          >
            <div className="flex items-center gap-2">
              <Award className="h-10 w-10 animate-pulse" style={{ color: primaryColor }} />
              <span
                className="font-bold text-2xl tracking-wider uppercase"
                style={{ color: headerColor, fontFamily: headerFont }}
              >
                {headerText}
              </span>
            </div>
            <span
              className="text-[10px] font-bold tracking-widest uppercase font-mono"
              style={{ color: headerColor }}
            >
              {headerSubtitle}
            </span>
            <div className="w-24 h-0.5 mx-auto mt-2" style={{ backgroundColor: primaryColor }} />
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col items-center text-center my-6 space-y-6">
            <h2
              className="text-3xl sm:text-5xl font-semibold tracking-wide uppercase"
              style={{ fontFamily: titleFont, color: titleColor }}
            >
              SERTIFIKAT
            </h2>
            <span className="text-sm font-medium italic font-serif">
              Dengan bangga diberikan kepada:
            </span>
            <div className="space-y-1">
              <h1
                className="text-2xl sm:text-4xl font-bold border-b-2 px-6 pb-2 inline-block capitalize"
                style={{
                  fontFamily: titleFont,
                  color: titleColor,
                  borderColor: `${contentColor}33`,
                }}
              >
                {cert.user.name || cert.user.email}
              </h1>
              <p className="text-xs font-mono mt-1">No. Sertifikat: {cert.certificateNumber}</p>
            </div>
            <p className="text-sm max-w-xl mx-auto leading-relaxed">
              Atas partisipasi aktif sebagai peserta dalam{' '}
              <strong className="font-semibold" style={{ color: titleColor }}>
                {cert.event.title}
              </strong>{' '}
              yang diselenggarakan
              {showEventDate && (
                <>
                  {' '}
                  pada tanggal{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {formatDate(cert.event.startDate)}
                  </strong>
                </>
              )}
              {showEventLocation && (
                <>
                  {' '}
                  di{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {cert.event.location}
                  </strong>
                </>
              )}
              .
            </p>
          </div>

          {/* Footer Area — Signatures */}
          <div
            className="w-full border-t pt-4"
            style={{ borderColor: `${contentColor}1a`, marginBottom: `${footerMarginBottom}px` }}
          >
            {signatures.length > 0 ? (
              <div className="flex items-end justify-center gap-12 flex-wrap">
                {/* Issue date on the left — conditional */}
                {showIssuedDate && (
                  <div className="text-left space-y-1">
                    <p className="text-[11px] font-semibold">TANGGAL TERBIT</p>
                    <p className="text-xs font-bold" style={{ color: titleColor }}>
                      {formatDate(cert.createdAt)}
                    </p>
                  </div>
                )}

                {/* Render each signature */}
                {signatures.map((sig: any) => (
                  <div key={sig.id} className="flex flex-col items-center space-y-1">
                    <div className="h-20 w-36 relative flex items-center justify-center">
                      <img
                        src={sig.signatureUrl}
                        alt={sig.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div
                      className="border-t pt-1 px-3 text-center"
                      style={{ borderColor: `${contentColor}33` }}
                    >
                      <p
                        className="text-xs font-bold uppercase font-mono tracking-wide"
                        style={{ color: titleColor }}
                      >
                        {sig.name}
                      </p>
                      {sig.title && <p className="text-[10px] font-mono">{sig.title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Fallback if no signatures configured */
              <div className="flex justify-between items-end">
                <div className="text-left space-y-1">
                  <p className="text-[11px] font-semibold">TANGGAL TERBIT</p>
                  <p className="text-xs font-bold" style={{ color: titleColor }}>
                    {formatDate(cert.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-14 w-32 relative flex items-center justify-center">
                    <span
                      className="font-serif italic text-sm"
                      style={{ color: `${contentColor}66` }}
                    >
                      SITIVENT System
                    </span>
                  </div>
                  <p
                    className="text-xs font-bold uppercase font-mono tracking-wider border-t pt-1 px-4"
                    style={{ borderColor: `${contentColor}33` }}
                  >
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
          @page {
            size: A4 landscape;
            margin: 0;
          }
          * {
            box-sizing: border-box !important;
          }
          html,
          body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden !important;
            font-size: 19px !important;
          }
          .no-print {
            display: none !important;
          }
          #certificate-container {
            width: 100vw !important;
            height: 70.72vw !important;
            max-height: 100vh !important;
            max-width: 141.42vh !important;
            margin: auto !important;
            padding: 3rem 4rem 5rem 4rem !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            position: absolute !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
