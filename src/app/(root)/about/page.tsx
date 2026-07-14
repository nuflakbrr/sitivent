import type { FC } from 'react';
import type { Metadata } from 'next';
import { Shield, Users, Award, Zap } from 'lucide-react';

import { AboutHeader } from './_components/AboutHeader';
import { AboutIntroduction } from './_components/AboutIntroduction';
import { AboutValues, type ValueItem } from './_components/AboutValues';

export const metadata: Metadata = {
  title: 'Tentang SITIVENT — Platform Manajemen Event',
  description:
    'SITIVENT adalah platform manajemen event dan tiket digital untuk seminar, workshop, webinar, dan bootcamp di Indonesia.',
};

const About: FC = () => {
  const values: ValueItem[] = [
    {
      icon: Zap,
      title: 'Efisiensi',
      desc: 'Proses pendaftaran cepat dan mudah, tanpa kerumitan.',
      color: '#D97757',
      bg: 'rgba(217,119,87,0.08)',
      border: 'rgba(217,119,87,0.3)',
    },
    {
      icon: Shield,
      title: 'Transparansi',
      desc: 'Setiap transaksi dan status terpantau secara real-time.',
      color: '#788C5D',
      bg: 'rgba(120,140,93,0.08)',
      border: 'rgba(120,140,93,0.3)',
    },
    {
      icon: Users,
      title: 'Inklusif',
      desc: 'Terbuka untuk semua kalangan, dari pelajar hingga profesional.',
      color: '#D97757',
      bg: 'rgba(217,119,87,0.08)',
      border: 'rgba(217,119,87,0.3)',
    },
    {
      icon: Award,
      title: 'Bermutu',
      desc: 'Event terkurasi dengan materi berkualitas dan instruktur berpengalaman.',
      color: '#788C5D',
      bg: 'rgba(120,140,93,0.08)',
      border: 'rgba(120,140,93,0.3)',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans antialiased">
      <AboutHeader
        title="Tentang SITIVENT"
        subtitle="Satu platform untuk menemukan, mendaftar, dan mengikuti event teknologi terbaik di Indonesia."
      />
      <div className="container mx-auto px-4 max-w-5xl py-16 md:py-24">
        <AboutIntroduction />
      </div>
      <AboutValues items={values} />
    </div>
  );
};

export default About;
