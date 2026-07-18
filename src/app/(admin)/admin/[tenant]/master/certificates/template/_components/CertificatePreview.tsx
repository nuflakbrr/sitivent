'use client';
import React from 'react';
import { Award } from 'lucide-react';
import { CertNumberMode } from '@/generated/prisma/enums';
import type { CertificateSignature } from '@/interfaces/features/certificates';

type Signature = Pick<CertificateSignature, 'id' | 'name' | 'title' | 'signatureUrl'>;

type Props = {
  backgroundUrl?: string | null;
  numberTemplate: string;
  numberMode?: CertNumberMode;
  showIssuedDate?: boolean;
  signatures?: Signature[];
  eventTitle: string;
  titleFont?: string;
  titleColor?: string;
  contentFont?: string;
  contentColor?: string;
  primaryColor?: string;
  showEventDate?: boolean;
  showEventLocation?: boolean;
  headerText?: string;
  headerSubtitle?: string;
  headerFont?: string;
  headerColor?: string;
  showHeader?: boolean;
  footerMarginBottom?: number;
  eventStartDate?: Date | string;
  eventLocation?: string;
};

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function renderNumber(template: string, eventTitle: string) {
  const slug = slugify(eventTitle).toUpperCase();
  const regNo = 'REG123';
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const seq = '001';
  const eventId = 'EVT-100';
  const regId = 'REG-200';
  const rand = '8D3F';

  return template
    .replace(/\{SLUG\}/g, slug)
    .replace(/\{REG_NO\}/g, regNo)
    .replace(/\{YEAR\}/g, year)
    .replace(/\{MONTH\}/g, month)
    .replace(/\{DAY\}/g, day)
    .replace(/\{SEQ\}/g, seq)
    .replace(/\{EVENT_ID\}/g, eventId)
    .replace(/\{REG_ID\}/g, regId)
    .replace(/\{RAND\}/g, rand);
}

export default function CertificatePreview({
  backgroundUrl,
  numberTemplate,
  showIssuedDate = true,
  signatures = [],
  eventTitle,
  titleFont = 'Inter',
  titleColor = '#000000',
  contentFont = 'Inter',
  contentColor = '#333333',
  primaryColor = '#3b82f6',
  showEventDate = true,
  showEventLocation = false,
  headerText = 'SITIVENT',
  headerSubtitle = 'Sertifikat Partisipasi Resmi',
  headerFont = 'Times New Roman',
  headerColor = '#000000',
  showHeader = true,
  footerMarginBottom = 0,
  eventStartDate,
  eventLocation,
}: Props) {
  const certNumber = renderNumber(numberTemplate || 'CERT/{SLUG}/{REG_NO}', eventTitle);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formattedDate = eventStartDate ? formatDate(eventStartDate) : '10 Juli 2026';
  const locationText = eventLocation || 'MCC';

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full max-w-4xl aspect-[1.414/1] bg-white relative shadow-2xl overflow-hidden flex flex-col justify-between items-center"
        style={{
          padding: '2rem 4rem',
          color: contentColor,
          fontFamily: contentFont,
        }}
      >
        {/* Background */}
        {backgroundUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={backgroundUrl}
              alt="certificate background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/30" />
          </div>
        ) : (
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
                Nama Peserta
              </h1>
              <p className="text-xs font-mono mt-1">No. Sertifikat: {certNumber}</p>
            </div>
            <p className="text-sm max-w-xl mx-auto leading-relaxed">
              Atas partisipasi aktif sebagai peserta dalam{' '}
              <strong className="font-semibold" style={{ color: titleColor }}>
                {eventTitle}
              </strong>{' '}
              yang diselenggarakan
              {showEventDate && (
                <>
                  {' '}
                  pada tanggal{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {formattedDate}
                  </strong>
                </>
              )}
              {showEventLocation && (
                <>
                  {' '}
                  di{' '}
                  <strong className="font-semibold" style={{ color: titleColor }}>
                    {locationText}
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
                    <p className="text-[10px] font-semibold">TANGGAL TERBIT</p>
                    <p className="text-xs font-bold" style={{ color: titleColor }}>
                      {new Date().toLocaleDateString('id-ID')}
                    </p>
                  </div>
                )}

                {/* Render each signature */}
                {signatures.map((sig, idx) => (
                  <div key={sig.id ?? idx} className="flex flex-col items-center space-y-1">
                    <div className="h-14 w-28 relative flex items-center justify-center">
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
                        className="text-[10px] font-bold uppercase font-mono tracking-wide"
                        style={{ color: titleColor }}
                      >
                        {sig.name}
                      </p>
                      {sig.title && <p className="text-[9px] font-mono">{sig.title}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-between items-end">
                <div className="text-left space-y-1">
                  <p className="text-[10px] font-semibold">TANGGAL TERBIT</p>
                  <p className="text-xs font-bold" style={{ color: titleColor }}>
                    {new Date().toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-10 w-24 relative flex items-center justify-center">
                    <span
                      className="font-serif italic text-sm"
                      style={{ color: `${contentColor}66` }}
                    >
                      SITIVENT System
                    </span>
                  </div>
                  <p
                    className="text-[10px] font-bold uppercase font-mono tracking-wider border-t pt-1 px-4"
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
    </div>
  );
}
