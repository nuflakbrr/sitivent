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
    color: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: Shield,
    title: 'Data Aman',
    desc: 'Informasi peserta tersimpan aman. Tidak dibagikan ke pihak ketiga.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: Award,
    title: 'Sertifikat Resmi',
    desc: 'e-Certificate dengan nomor unik yang dapat diverifikasi kapan saja.',
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  },
];

const Features: FC = () => {
  return (
    <section id="fitur" className="py-14 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-4xl font-extrabold text-indigo-600">{s.value}</div>
              <div className="text-xs md:text-sm text-slate-500 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className={`flex items-start gap-4 p-5 rounded-2xl border ${h.color}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${h.color}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{h.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">{h.desc}</p>
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
