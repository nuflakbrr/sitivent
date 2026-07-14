'use client';
import { useState, type FC } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { registerToEvent } from '@/services/registrations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  eventId: string;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isRegistered: boolean;
  registrationStatus?: string | null;
  isDeadlinePassed: boolean;
  isQuotaFull: boolean;
  price: number;
  slug: string;
};

const RegisterButton: FC<Props> = ({
  eventId,
  isAuthenticated,
  isEmailVerified,
  isRegistered,
  registrationStatus,
  isDeadlinePassed,
  isQuotaFull,
  price,
  slug,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: onRegister, isPending } = useMutation({
    mutationFn: () => registerToEvent(eventId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
        router.refresh();
        router.push('/participant/dashboard');
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal melakukan pendaftaran event.');
    },
  });

  if (!isAuthenticated) {
    return (
      <Button
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider shadow-md rounded-xl"
        style={{ backgroundColor: '#D97757', color: '#FAF9F5' }}
        asChild
      >
        <Link href={`/login?redirect=/events/${slug}`}>Masuk untuk Mendaftar</Link>
      </Button>
    );
  }

  if (!isEmailVerified) {
    return (
      <Button
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider shadow-md rounded-xl flex items-center justify-center gap-2"
        style={{ backgroundColor: '#B04A3F', color: '#FAF9F5' }}
        asChild
      >
        <Link href="/participant/dashboard">
          <AlertCircle className="h-4 w-4" /> Verifikasi Email di Dashboard
        </Link>
      </Button>
    );
  }

  if (isRegistered) {
    if (registrationStatus === 'WAITING_PAYMENT') {
      return (
        <div className="space-y-3 w-full">
          <Button
            variant="outline"
            className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider cursor-default flex items-center justify-center gap-2 rounded-xl"
            style={{
              backgroundColor: 'rgba(217, 119, 87, 0.08)',
              borderColor: 'rgba(217, 119, 87, 0.3)',
              color: '#D97757',
            }}
          >
            <CreditCard className="h-4 w-4" /> Menunggu Pembayaran
          </Button>
          <Button
            className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider rounded-xl"
            style={{ backgroundColor: '#141413', color: '#FAF9F5' }}
            asChild
          >
            <Link href="/participant/dashboard">Unggah Bukti di Dashboard</Link>
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider cursor-default flex items-center justify-center gap-2 rounded-xl"
        style={{
          backgroundColor: 'rgba(120, 140, 93, 0.08)',
          borderColor: 'rgba(120, 140, 93, 0.3)',
          color: '#788C5D',
        }}
      >
        <CheckCircle2 className="h-4 w-4" /> Sudah Terdaftar
      </Button>
    );
  }

  if (isDeadlinePassed) {
    return (
      <Button
        disabled
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
        style={{
          backgroundColor: '#87867F',
          color: '#FAF9F5',
        }}
      >
        <AlertCircle className="h-4 w-4" /> Batas Pendaftaran Lewat
      </Button>
    );
  }

  if (isQuotaFull) {
    return (
      <Button
        disabled
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl"
        style={{
          backgroundColor: '#87867F',
          color: '#FAF9F5',
        }}
      >
        <AlertCircle className="h-4 w-4" /> Kuota Penuh
      </Button>
    );
  }

  return (
    <>
      <Button
        id="btn-register-event"
        onClick={() => setIsOpen(true)}
        className="w-full py-6 text-xs font-bold font-mono uppercase tracking-wider shadow-md rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          backgroundColor: '#D97757',
          color: '#FAF9F5',
        }}
      >
        Daftar Event Sekarang
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="rounded-2xl max-w-sm sm:max-w-md border bg-white"
          style={{ borderColor: '#D1CFC5' }}
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-xl font-bold text-[#141413]">
              Konfirmasi Pendaftaran
            </DialogTitle>
            <DialogDescription className="text-xs text-[#3D3D3A] leading-relaxed">
              Apakah Anda yakin ingin mendaftar pada event ini?
              {price > 0 ? (
                <span className="block mt-2 font-mono text-[11px] uppercase tracking-wider text-[#3D3D3A]">
                  Ini adalah event berbayar dengan biaya sebesar{' '}
                  <strong className="text-[#D97757]">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(price)}
                  </strong>
                  . Status awal pendaftaran akan diatur ke <strong>WAITING_PAYMENT</strong>.
                </span>
              ) : (
                <span className="block mt-2 font-mono text-[11px] uppercase tracking-wider text-[#3D3D3A]">
                  Ini adalah event gratis. Status pendaftaran Anda akan langsung diatur ke{' '}
                  <strong className="text-[#788C5D]">REGISTERED</strong>.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              aria-label="Batalkan"
              className="text-xs font-bold font-mono uppercase tracking-wider rounded-xl border"
              style={{
                borderColor: '#D1CFC5',
                color: '#3D3D3A',
              }}
            >
              Batal
            </Button>
            <Button
              id="btn-confirm-register"
              onClick={() => onRegister()}
              disabled={isPending}
              aria-label="Lanjutkan pendaftaran"
              className="text-xs font-bold font-mono uppercase tracking-wider rounded-xl text-white"
              style={{
                backgroundColor: '#D97757',
              }}
            >
              {isPending ? 'Mendaftar...' : 'Ya, Daftar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegisterButton;
