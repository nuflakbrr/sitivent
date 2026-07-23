import type { FC } from 'react';
import { Shield, Zap, Award, BookOpen, Sparkles, Users } from 'lucide-react';

const highlights = [
  {
    icon: Zap,
    title: 'Konfirmasi Cepat',
    desc: 'Registrasi instan dan dapatkan QR code untuk event offline.',
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
    desc: 'e-Certificate resmi dan dapat diunduh kapan saja.',
    accent: '#3D3D3A',
    bg: 'rgba(61,61,58,0.05)',
    border: 'rgba(61,61,58,0.12)',
  },
  {
    icon: BookOpen,
    title: 'Materi Berkualitas',
    desc: 'Materi event disusun terstruktur oleh instruktur berpengalaman.',
    accent: '#06B6D4',
    bg: 'rgba(6,182,212,0.07)',
    border: 'rgba(6,182,212,0.2)',
  },
  {
    icon: Sparkles,
    title: 'Narasumber Ekspert',
    desc: 'Belajar langsung dari praktisi dan pakar terbaik di bidang industri.',
    accent: '#8B5CF6',
    bg: 'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.2)',
  },
  {
    icon: Users,
    title: 'Jaringan Koneksi',
    desc: 'Perluas relasi dan kolaborasi dengan sesama peserta event.',
    accent: '#F59E0B',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.2)',
  },
];

const Features: FC = () => {
  return (
    <section
      id="fitur"
      className="py-16 border-t"
      style={{ background: '#FFFFFF', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2
            className="text-2xl md:text-4xl font-medium tracking-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              color: '#141413',
              letterSpacing: '-0.01em',
            }}
          >
            Kenapa Harus Ikut Event Disini?
          </h2>
          <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#87867F' }}>
            Temukan keunggulan platform kami yang dirancang khusus untuk mendukung pertumbuhan
            karier dan keahlian teknologi Anda.
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
