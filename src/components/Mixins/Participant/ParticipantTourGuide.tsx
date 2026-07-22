'use client';

import { useEffect, type FC, type ReactNode } from 'react';
import { TourProvider, useTour } from '@reactour/tour';
import { Compass, LayoutDashboard, CalendarDays, CreditCard, UserCircle } from 'lucide-react';

const STORAGE_KEY = 'sitivent_participant_tour_completed';

const steps = [
  {
    selector: '[data-tour="step-dashboard"]',
    content: () => (
      <div className="space-y-2 p-1">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-[#D97757]" />
          <h4 className="font-bold text-[#141413] text-base">Dashboard Peserta</h4>
        </div>
        <p className="text-xs text-[#87867F] leading-relaxed">
          Ini adalah pusat kontrol utama Anda di SITIVENT. Di sini Anda dapat melihat statistik
          ringkasan, info e-tiket event terdekat, serta pengumuman penting.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="step-history"]',
    content: () => (
      <div className="space-y-2 p-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#D97757]" />
          <h4 className="font-bold text-[#141413] text-base">Riwayat Event & E-Tiket</h4>
        </div>
        <p className="text-xs text-[#87867F] leading-relaxed">
          Lihat semua event yang pernah Anda daftari, periksa status hadir (CHECKED_IN), akses
          e-tiket QR code, unduh sertifikat, dan berikan ulasan testimoni.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="step-payments"]',
    content: () => (
      <div className="space-y-2 p-1">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#D97757]" />
          <h4 className="font-bold text-[#141413] text-base">Riwayat Transaksi & Pembayaran</h4>
        </div>
        <p className="text-xs text-[#87867F] leading-relaxed">
          Kelola dan pantau seluruh transaksi event berbayar Anda, cek bukti pembayaran, dan
          dapatkan konfirmasi otomatis.
        </p>
      </div>
    ),
  },
  {
    selector: '[data-tour="step-profile"]',
    content: () => (
      <div className="space-y-2 p-1">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-[#D97757]" />
          <h4 className="font-bold text-[#141413] text-base">Profil & Pengaturan Akun</h4>
        </div>
        <p className="text-xs text-[#87867F] leading-relaxed">
          Perbarui data pribadi, dan informasi penting akun peserta Anda kapan saja melalui menu
          profil.
        </p>
      </div>
    ),
  },
];

const tourStyles = {
  popover: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E3DACC',
    color: '#141413',
    padding: '20px 24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  }),
  maskArea: (base: Record<string, unknown>) => ({
    ...base,
    rx: 12,
  }),
  badge: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: '#D97757',
    color: '#FFFFFF',
  }),
  dot: (base: Record<string, unknown>, state?: { current?: boolean }) => ({
    ...base,
    backgroundColor: state?.current ? '#D97757' : '#E3DACC',
  }),
  close: (base: Record<string, unknown>) => ({
    ...base,
    color: '#87867F',
    right: 12,
    top: 12,
  }),
};

function TourController() {
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [setIsOpen]);

  const handleStartTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <button
      onClick={handleStartTour}
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#D97757] hover:bg-[#c46647] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2.5 font-medium text-xs sm:text-sm cursor-pointer group"
      title="Panduan Portal Peserta"
      aria-label="Panduan Portal Peserta"
    >
      <Compass className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
      <span className="hidden sm:inline font-semibold pr-1">Panduan Portal</span>
    </button>
  );
}

interface TourGuideProps {
  children: ReactNode;
}

export const ParticipantTourGuide: FC<TourGuideProps> = ({ children }) => {
  return (
    <TourProvider
      steps={steps}
      styles={tourStyles}
      padding={{ popover: [16, 20], mask: [6, 6] }}
      onClickMask={({ setIsOpen }) => setIsOpen(false)}
      beforeClose={() => {
        localStorage.setItem(STORAGE_KEY, 'true');
      }}
    >
      {children}
      <TourController />
    </TourProvider>
  );
};
