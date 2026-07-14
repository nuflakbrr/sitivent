'use client';
import Link from 'next/link';
import type { FC } from 'react';

import type { ErrorMetadata, ErrorStateProps, ErrorTheme } from '@/interfaces/error';

// ── Per-error SVG illustration ────────────────────────────────────────────────
interface IllustrationProps {
  code: number;
  accentColor: string;
  secondaryColor: string;
}

const ErrorIllustration: FC<IllustrationProps> = ({ code, accentColor, secondaryColor }) => {
  if (code === 404) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Ground */}
        <ellipse cx="160" cy="210" rx="120" ry="14" fill={accentColor} opacity="0.12" />
        {/* Signpost pole */}
        <rect x="155" y="110" width="10" height="100" rx="2" fill="#D1CFC5" />
        {/* Sign board */}
        <rect
          x="80"
          y="60"
          width="160"
          height="60"
          rx="10"
          fill="#FAF9F5"
          stroke={accentColor}
          strokeWidth="2"
        />
        {/* Sign text lines */}
        <rect x="100" y="78" width="50" height="8" rx="3" fill={accentColor} opacity="0.6" />
        <rect x="158" y="78" width="64" height="8" rx="3" fill="#D1CFC5" />
        <rect x="100" y="94" width="80" height="8" rx="3" fill="#D1CFC5" />
        {/* 404 label */}
        <text
          x="160"
          y="99"
          textAnchor="middle"
          fontSize="11"
          fill={accentColor}
          fontWeight="700"
          fontFamily="ui-monospace,monospace"
        >
          404
        </text>
        {/* Arrow pointing nowhere */}
        <path
          d="M155 60 L135 40 L130 50 L120 42 L128 55 L118 58 L135 58 Z"
          fill={accentColor}
          opacity="0.35"
        />
        {/* Magnifier */}
        <circle cx="220" cy="160" r="28" stroke={secondaryColor} strokeWidth="3" fill="none" />
        <circle cx="220" cy="160" r="18" fill={secondaryColor} opacity="0.1" />
        <line
          x1="241"
          y1="181"
          x2="258"
          y2="198"
          stroke={secondaryColor}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Question mark inside */}
        <text
          x="220"
          y="167"
          textAnchor="middle"
          fontSize="20"
          fill={secondaryColor}
          fontWeight="800"
          fontFamily="ui-serif,serif"
        >
          ?
        </text>
        {/* Footsteps */}
        <ellipse
          cx="60"
          cy="205"
          rx="9"
          ry="5"
          rx-orig="9"
          fill="#D1CFC5"
          transform="rotate(-15 60 205)"
        />
        <ellipse cx="80" cy="200" rx="9" ry="5" fill="#D1CFC5" transform="rotate(10 80 200)" />
      </svg>
    );
  }

  if (code === 401 || code === 403) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Shadow */}
        <ellipse cx="160" cy="215" rx="100" ry="12" fill={accentColor} opacity="0.10" />
        {/* Lock body */}
        <rect
          x="95"
          y="120"
          width="130"
          height="90"
          rx="16"
          fill="#FAF9F5"
          stroke={accentColor}
          strokeWidth="2.5"
        />
        {/* Lock shackle */}
        <path
          d="M120 120 V90 Q120 55 160 55 Q200 55 200 90 V120"
          stroke={accentColor}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Keyhole */}
        <circle cx="160" cy="158" r="16" fill={accentColor} opacity="0.18" />
        <circle cx="160" cy="155" r="10" fill={accentColor} opacity="0.5" />
        <rect x="155" y="162" width="10" height="20" rx="3" fill={accentColor} opacity="0.5" />
        {/* Exclamation badge */}
        <circle
          cx="215"
          cy="95"
          r="20"
          fill={secondaryColor}
          opacity="0.12"
          stroke={secondaryColor}
          strokeWidth="1.5"
        />
        <text
          x="215"
          y="102"
          textAnchor="middle"
          fontSize="22"
          fill={secondaryColor}
          fontWeight="800"
          fontFamily="ui-serif,serif"
        >
          !
        </text>
        {/* Dots decoration */}
        <circle cx="80" cy="90" r="5" fill={accentColor} opacity="0.20" />
        <circle cx="68" cy="110" r="3" fill={accentColor} opacity="0.15" />
        <circle cx="250" cy="170" r="4" fill={secondaryColor} opacity="0.20" />
      </svg>
    );
  }

  if (code === 503) {
    return (
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Shadow */}
        <ellipse cx="160" cy="215" rx="110" ry="12" fill={accentColor} opacity="0.10" />
        {/* Server rack */}
        <rect
          x="90"
          y="80"
          width="140"
          height="125"
          rx="10"
          fill="#FAF9F5"
          stroke="#D1CFC5"
          strokeWidth="2"
        />
        {/* Server units */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect
              x="100"
              y={95 + i * 28}
              width="120"
              height="20"
              rx="4"
              fill="#F0EEE6"
              stroke="#E3DACC"
              strokeWidth="1.5"
            />
            <circle
              cx="115"
              cy={105 + i * 28}
              r="4"
              fill={i === 2 ? accentColor : secondaryColor}
              opacity={i === 2 ? 0.9 : 0.4}
            />
            <rect x="125" y={101 + i * 28} width="55" height="4" rx="2" fill="#D1CFC5" />
            <rect x="125" y={109 + i * 28} width="35" height="4" rx="2" fill="#E3DACC" />
          </g>
        ))}
        {/* Wrench icon */}
        <g transform="translate(195 55) rotate(45)">
          <rect x="-5" y="-20" width="10" height="40" rx="5" fill={accentColor} opacity="0.75" />
          <rect x="-14" y="-24" width="28" height="12" rx="6" fill={accentColor} opacity="0.75" />
          <rect x="-14" y="12" width="28" height="12" rx="6" fill={accentColor} opacity="0.75" />
        </g>
        {/* Warning triangle */}
        <path
          d="M60 190 L90 140 L120 190 Z"
          fill={accentColor}
          opacity="0.15"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <text x="90" y="182" textAnchor="middle" fontSize="22" fill={accentColor} fontWeight="800">
          !
        </text>
      </svg>
    );
  }

  // 5xx default
  return (
    <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="160" cy="215" rx="110" ry="12" fill={accentColor} opacity="0.10" />
      {/* Terminal window */}
      <rect x="60" y="60" width="200" height="145" rx="14" fill="#141413" />
      {/* Title bar */}
      <rect x="60" y="60" width="200" height="36" rx="14" fill="#1E1E1C" />
      <rect x="60" y="82" width="200" height="14" fill="#1E1E1C" />
      <circle cx="85" cy="78" r="6" fill={accentColor} opacity="0.5" />
      <circle cx="105" cy="78" r="6" fill="#D97757" opacity="0.35" />
      <circle cx="125" cy="78" r="6" fill="#788C5D" opacity="0.35" />
      {/* Code lines */}
      <rect x="80" y="110" width="60" height="7" rx="3" fill={accentColor} opacity="0.8" />
      <rect x="148" y="110" width="80" height="7" rx="3" fill="#3D3D3A" />
      <rect x="80" y="126" width="30" height="7" rx="3" fill="#87867F" />
      <rect x="118" y="126" width="100" height="7" rx="3" fill={secondaryColor} opacity="0.6" />
      <rect x="80" y="142" width="110" height="7" rx="3" fill="#3D3D3A" />
      <rect x="80" y="158" width="20" height="7" rx="3" fill={accentColor} opacity="0.5" />
      {/* Blink cursor */}
      <rect x="108" y="158" width="7" height="7" rx="1" fill="#FAF9F5" opacity="0.7" />
      {/* Error badge outside window */}
      <rect x="195" y="48" width="70" height="24" rx="12" fill={accentColor} />
      <text
        x="230"
        y="63"
        textAnchor="middle"
        fontSize="10"
        fill="#FAF9F5"
        fontWeight="700"
        fontFamily="ui-monospace,monospace"
      >
        500 ERR
      </text>
    </svg>
  );
};

// ── Theme map — warm palette replaces zinc/dark-mode chains ────────────────────
const getErrorContent = (statusCode: number): ErrorMetadata & ErrorTheme => {
  const is5xx = statusCode >= 500;

  const metadataMap: Record<number, ErrorMetadata> = {
    401: {
      titlePrefix: 'Sesi Anda',
      titleSuffix: 'Berakhir',
      description:
        'Maaf, sesi Anda telah berakhir atau Anda belum login. Silakan login kembali untuk melanjutkan.',
      badge: 'Error 401 · Unauthorized',
      theme: 'amber',
    },
    403: {
      titlePrefix: 'Akses',
      titleSuffix: 'Dibatasi',
      description:
        'Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator.',
      badge: 'Error 403 · Forbidden',
      theme: 'amber',
    },
    404: {
      titlePrefix: 'Halaman Tidak',
      titleSuffix: 'Ditemukan',
      description: 'Sepertinya route yang Anda cari tidak ada atau sudah berpindah ke tempat lain.',
      badge: 'Error 404 · Not Found',
      theme: 'rose',
    },
    500: {
      titlePrefix: 'Terjadi Kesalahan',
      titleSuffix: 'Internal',
      description: 'Server kami sedang mengalami gangguan sejenak. Silakan coba lagi nanti.',
      badge: 'Error 500 · Server Error',
      theme: 'amber',
    },
    503: {
      titlePrefix: 'Layanan Tidak',
      titleSuffix: 'Tersedia',
      description: 'Layanan sedang dalam pemeliharaan. Mohon tunggu beberapa saat lagi.',
      badge: 'Error 503 · Service Unavailable',
      theme: 'emerald',
    },
  };

  const defaultContent: ErrorMetadata = is5xx
    ? {
        titlePrefix: 'Terjadi Kesalahan',
        titleSuffix: 'Server',
        description:
          'Server mengalami kendala yang tidak terduga. Mohon maaf atas ketidaknyamanan ini.',
        badge: `Error ${statusCode} · Server Exception`,
        theme: 'amber',
      }
    : {
        titlePrefix: 'Terjadi Kesalahan',
        titleSuffix: 'Klien',
        description: 'Permintaan Anda tidak dapat diproses oleh sistem kami.',
        badge: `Error ${statusCode} · Client Error`,
        theme: 'rose',
      };

  const content = metadataMap[statusCode] ?? defaultContent;

  const themes: Record<ErrorMetadata['theme'], ErrorTheme> = {
    amber: {
      badgeColor: '',
      pingColor: '#D97757',
      dotColor: '#D97757',
      gradient: '',
      glowStart: 'rgba(217,119,87,0.08)',
      glowEnd: 'rgba(120,140,93,0.06)',
      terminalIcon: '',
      borderType: '#D97757',
      errorColor: '#D97757',
    },
    rose: {
      badgeColor: '',
      pingColor: '#B04A3F',
      dotColor: '#B04A3F',
      gradient: '',
      glowStart: 'rgba(176,74,63,0.08)',
      glowEnd: 'rgba(217,119,87,0.06)',
      terminalIcon: '',
      borderType: '#B04A3F',
      errorColor: '#B04A3F',
    },
    emerald: {
      badgeColor: '',
      pingColor: '#788C5D',
      dotColor: '#788C5D',
      gradient: '',
      glowStart: 'rgba(120,140,93,0.08)',
      glowEnd: 'rgba(217,119,87,0.06)',
      terminalIcon: '',
      borderType: '#788C5D',
      errorColor: '#788C5D',
    },
  };

  return { ...content, ...themes[content.theme] };
};

// ── Component ─────────────────────────────────────────────────────────────────
const ErrorState: FC<ErrorStateProps> = ({ code, error }) => {
  const meta = getErrorContent(code);

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full"
          style={{ background: `radial-gradient(circle, ${meta.glowStart}, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[380px] h-[380px] rounded-full"
          style={{ background: `radial-gradient(circle, ${meta.glowEnd}, transparent 70%)` }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 pt-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* ── Left: text ── */}
          <div className="flex-1 space-y-7 text-center lg:text-left">
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-bold"
              style={{
                background: `${meta.dotColor}12`,
                borderColor: `${meta.dotColor}40`,
                color: meta.dotColor,
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                  style={{ background: meta.pingColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: meta.dotColor }}
                />
              </span>
              {meta.badge}
            </div>

            {/* Headline */}
            <h1
              className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
              style={{ color: '#141413' }}
            >
              {meta.titlePrefix}
              <br />
              <span style={{ color: meta.errorColor }}>{meta.titleSuffix}</span>
            </h1>

            {/* Description */}
            <p
              className="text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ color: '#3D3D3A' }}
            >
              {meta.description}
            </p>

            {/* Error detail box */}
            {error && (
              <div
                className="rounded-2xl px-5 py-4 text-sm text-left"
                style={{
                  background: '#F0EEE6',
                  border: '1.5px solid #E3DACC',
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                }}
              >
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#87867F' }}
                >
                  Detail Error
                </p>
                <p style={{ color: '#B04A3F' }}>
                  {error.name}: {error.message}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 active:scale-[0.98] hover:opacity-90"
                style={{
                  background: meta.errorColor,
                  boxShadow: `0 8px 24px ${meta.errorColor}30`,
                }}
              >
                ← Kembali ke Beranda
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] hover:bg-[#E3DACC]"
                style={{
                  color: '#3D3D3A',
                  border: '1.5px solid #D1CFC5',
                }}
              >
                Halaman sebelumnya
              </button>
            </div>
          </div>

          {/* ── Right: illustration ── */}
          <div className="flex-1 w-full max-w-sm lg:max-w-md">
            {/* Illustration card */}
            <div
              className="relative rounded-3xl p-8 shadow-2xl overflow-hidden"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E3DACC',
                boxShadow: '0 24px 60px rgba(20,20,19,0.10)',
              }}
            >
              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg,#141413 0,#141413 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,#141413 0,#141413 1px,transparent 1px,transparent 32px)',
                }}
                aria-hidden="true"
              />

              {/* Error code watermark */}
              <div
                className="absolute top-5 right-6 font-serif font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: '80px', color: meta.errorColor, opacity: 0.07 }}
                aria-hidden="true"
              >
                {code}
              </div>

              <div className="relative z-10">
                <ErrorIllustration
                  code={code}
                  accentColor={meta.errorColor}
                  secondaryColor={meta.dotColor === meta.errorColor ? '#788C5D' : meta.dotColor}
                />

                {/* Card footer */}
                <div
                  className="mt-6 pt-5 border-t flex items-center justify-between"
                  style={{ borderColor: '#E3DACC' }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{
                      color: '#87867F',
                      fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    }}
                  >
                    sitivent
                  </span>
                  <span
                    className="font-serif text-2xl font-bold"
                    style={{ color: meta.errorColor }}
                  >
                    {code}
                  </span>
                </div>
              </div>
            </div>

            {/* Floating tip */}
            <p className="mt-4 text-center text-xs" style={{ color: '#87867F' }}>
              Butuh bantuan?{' '}
              <Link
                href="/help"
                className="font-semibold hover:underline"
                style={{ color: meta.errorColor }}
              >
                Hubungi kami
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorState;
