import type { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const AboutIntroduction: FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#141413]">
          Apa itu SITIVENT?
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-[#3D3D3A]">
          <strong className="text-[#D97757]">SITIVENT</strong> adalah sistem manajemen event
          berbasis web yang dirancang untuk mempermudah proses pendaftaran, pembayaran, dan
          kehadiran peserta pada berbagai jenis acara — mulai dari seminar, workshop, webinar,
          hingga bootcamp.
        </p>
        <p className="text-sm md:text-base leading-relaxed text-[#3D3D3A]">
          Platform ini hadir sebagai jembatan antara penyelenggara event dan peserta, memastikan
          setiap proses berjalan transparan, cepat, dan terorganisir — dari pendaftaran awal hingga
          penerbitan sertifikat digital.
        </p>
        <div className="pt-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#D97757] hover:text-[#141413] transition-colors group/link"
          >
            Jelajahi Event Sekarang
            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-[#D1CFC5] shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&q=80&fit=crop&w=800&h=600"
          alt="Event audience"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#141413]/30 to-transparent" />
      </div>
    </div>
  );
};
