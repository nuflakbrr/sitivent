import type { FC } from 'react';
import type { Shield, Users, Award, Zap } from 'lucide-react';

export interface ValueItem {
  icon: typeof Zap | typeof Shield | typeof Users | typeof Award;
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}

interface AboutValuesProps {
  items: ValueItem[];
}

export const AboutValues: FC<AboutValuesProps> = ({ items }) => {
  return (
    <section
      className="py-16 border-t border-b mt-20"
      style={{ background: '#FFFFFF', borderColor: '#E3DACC' }}
    >
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#141413]">
            Nilai-Nilai Kami
          </h2>
          <p className="text-xs font-mono text-[#87867F] uppercase tracking-wider">
            PRINSIP UTAMA DALAM MEMBERIKAN LAYANAN TERBAIK
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-[#FAF9F5] p-6 rounded-2xl border border-[#D1CFC5] shadow-xs flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: v.bg,
                    borderColor: v.border,
                    color: v.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#141413]">{v.title}</h3>
                  <p className="text-xs text-[#87867F] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
