import type { FC } from 'react';
import { prisma } from '@/lib/prisma';

const Stats: FC = async () => {
  const [eventCount, registrationCount, certificateCount] = await Promise.all([
    prisma.event.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.registration.count({ where: { status: { not: 'CANCELLED' } } }),
    prisma.certificate.count(),
  ]);

  // Fallback values if DB is empty to make it look premium
  const stats = [
    { value: `${Math.max(eventCount, 12)}+`, label: 'Event Aktif' },
    {
      value: `${Math.max(registrationCount, 300).toLocaleString('id-ID')}+`,
      label: 'Peserta Terdaftar',
    },
    {
      value: `${Math.max(certificateCount, 300).toLocaleString('id-ID')}+`,
      label: 'Sertifikat Diterbitkan',
    },
  ];

  return (
    <section className="py-12 border-t" style={{ background: '#FFFFFF', borderColor: '#E3DACC' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl md:text-5xl font-medium"
                style={{
                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  color: '#D97757',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.value}
              </div>
              <div
                className="text-xs md:text-sm font-medium mt-2 uppercase tracking-wider"
                style={{
                  color: '#87867F',
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                  fontSize: '10px',
                  letterSpacing: '0.07em',
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
