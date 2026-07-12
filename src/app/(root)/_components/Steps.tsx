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
    <section
      id="cara-kerja"
      className="py-16 border-t"
      style={{ background: '#FAF9F5', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-12">
          <span
            className="text-[11px] font-bold uppercase tracking-widest block mb-3"
            style={{
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              color: '#87867F',
            }}
          >
            Cara Kerja
          </span>
          <h2
            className="leading-tight"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              color: '#141413',
              letterSpacing: '-0.01em',
            }}
          >
            Tiga langkah, beres.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex flex-col items-start gap-4 p-6 rounded-xl transition-all duration-200"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #D1CFC5',
                boxShadow: '0 2px 8px rgba(20,20,19,0.04)',
              }}
            >
              {/* Step number */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: '#E3DACC',
                }}
              >
                <span
                  className="font-bold text-base"
                  style={{
                    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                    color: '#141413',
                  }}
                >
                  {s.step}
                </span>
              </div>

              <div>
                <h3
                  className="font-semibold text-base"
                  style={{
                    color: '#141413',
                    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed mt-1.5" style={{ color: '#87867F' }}>
                  {s.description}
                </p>
              </div>

              {/* Accent line at bottom */}
              <div
                className="w-8 h-0.5 rounded-full mt-auto"
                style={{ background: '#D97757', opacity: 0.5 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
