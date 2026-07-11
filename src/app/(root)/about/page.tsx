import type { FC } from 'react';
import type { Metadata } from 'next';
import { Shield, Users, Award, Zap } from 'lucide-react';
import { siteMetadata } from '@/data/siteMetadata';

export const metadata: Metadata = {
  title: 'Tentang SITIVENT — Platform Manajemen Event',
  description:
    'SITIVENT adalah platform manajemen event dan tiket digital untuk seminar, workshop, webinar, dan bootcamp di Indonesia.',
};

const About: FC = () => {
  return (
    <section className="min-h-screen bg-slate-50 pt-28 pb-16">
      {/* Hero band */}
      <div className="bg-indigo-600 py-16 text-center relative overflow-hidden mb-16">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white rounded-full" />
        </div>
        <div className="relative container mx-auto px-4 max-w-3xl space-y-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Tentang SITIVENT
          </h1>
          <p className="text-indigo-200 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Satu platform untuk menemukan, mendaftar, dan mengikuti event teknologi terbaik di
            Indonesia.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* About section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Apa itu SITIVENT?
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              <strong className="text-indigo-600">SITIVENT</strong> adalah sistem manajemen event
              berbasis web yang dirancang untuk mempermudah proses pendaftaran, pembayaran, dan
              kehadiran peserta pada berbagai jenis acara — mulai dari seminar, workshop, webinar,
              hingga bootcamp.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              Platform ini hadir sebagai jembatan antara penyelenggara event dan peserta, memastikan
              setiap proses berjalan transparan, cepat, dan terorganisir — dari pendaftaran awal
              hingga penerbitan sertifikat digital.
            </p>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&q=80&fit=crop&w=800&h=600"
              alt="Event audience"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-indigo-900/40 to-transparent" />
          </div>
        </div>

        {/* Values */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight text-center">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Zap,
                title: 'Efisiensi',
                desc: 'Proses pendaftaran cepat dan mudah, tanpa kerumitan.',
                color: 'text-amber-600 bg-amber-50 border-amber-100',
              },
              {
                icon: Shield,
                title: 'Transparansi',
                desc: 'Setiap transaksi dan status terpantau secara real-time.',
                color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
              },
              {
                icon: Users,
                title: 'Inklusif',
                desc: 'Terbuka untuk semua kalangan, dari pelajar hingga profesional.',
                color: 'text-sky-600 bg-sky-50 border-sky-100',
              },
              {
                icon: Award,
                title: 'Bermutu',
                desc: 'Event terkurasi dengan materi berkualitas dan instruktur berpengalaman.',
                color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
              },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className={`p-5 rounded-2xl border flex flex-col gap-3 ${v.color}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${v.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{v.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed mt-1">{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
