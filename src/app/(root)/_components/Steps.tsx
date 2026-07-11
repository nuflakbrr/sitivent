import type { FC } from 'react';

const steps = [
  {
    step: 1,
    title: 'Pilih Event',
    description: 'Jelajahi daftar event dan pilih yang sesuai minat atau kebutuhanmu.',
  },
  {
    step: 2,
    title: 'Daftar & Bayar',
    description:
      'Isi formulir pendaftaran, unggah bukti bayar, dan tunggu konfirmasi dari tim kami.',
  },
  {
    step: 3,
    title: 'Hadir & Dapat Sertifikat',
    description: 'Scan QR kehadiran saat acara, lalu unduh e-certificate dari dashboard peserta.',
  },
];

const HowItWorks: FC = () => {
  return (
    <section id="cara-kerja" className="py-14 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">
            Cara Kerja
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Tiga langkah, beres.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-center md:items-start text-center md:text-left gap-3 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0">
                {s.step}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
