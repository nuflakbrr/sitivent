import type { FC } from 'react';
import { Shield, Zap, Award } from 'lucide-react';

const stats = [
  { value: '50+', label: 'Event Aktif' },
  { value: '2.000+', label: 'Peserta Terdaftar' },
  { value: '1.500+', label: 'Sertifikat Diterbitkan' },
];

const highlights = [
  {
    icon: Zap,
    title: 'Konfirmasi Cepat',
    desc: 'Pembayaran diverifikasi manual oleh tim kami dalam waktu 1×24 jam.',
    accent: '#D97757',
    bg: 'rgba(217,119,87,0.07)',
    border: 'rgba(217,119,87,0.2)',
  },
  {
    icon: Shield,
    title: 'Data Aman',
    desc: 'Informasi peserta tersimpan aman. Tidak dibagikan ke pihak ketiga.',
    accent: '#788C5D',
    bg: 'rgba(120,140,93,0.07)',
    border: 'rgba(120,140,93,0.2)',
  },
  {
    icon: Award,
    title: 'Sertifikat Resmi',
    desc: 'e-Certificate dengan nomor unik yang dapat diverifikasi kapan saja.',
    accent: '#3D3D3A',
    bg: 'rgba(61,61,58,0.05)',
    border: 'rgba(61,61,58,0.12)',
  },
];

const Features: FC = () => {
  return (
    <section
      id="fitur"
      className="py-16 border-t"
      style={{ background: '#FFFFFF', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-6xl space-y-14">
        {/* Stats row */}
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

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="flex items-start gap-4 p-5 rounded-xl"
                style={{
                  background: h.bg,
                  border: `1.5px solid ${h.border}`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: h.bg, border: `1.5px solid ${h.border}` }}
                >
                  <Icon className="w-4 h-4" style={{ color: h.accent }} />
                </div>
                <div>
                  <h3
                    className="font-semibold text-sm"
                    style={{
                      color: '#141413',
                      fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {h.title}
                  </h3>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: '#87867F' }}>
                    {h.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
