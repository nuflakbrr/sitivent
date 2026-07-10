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
      <Button className="w-full py-6 text-base font-semibold shadow-md" asChild>
        <Link href={`/login?redirect=/events/${slug}`}>Masuk untuk Mendaftar</Link>
      </Button>
    );
  }

  if (isRegistered) {
    if (registrationStatus === 'WAITING_PAYMENT') {
      return (
        <div className="space-y-3 w-full">
          <Button
            variant="outline"
            className="w-full py-6 border-amber-500/30 bg-amber-500/5 text-amber-600 hover:bg-amber-500/10 cursor-default flex items-center justify-center gap-2"
          >
            <CreditCard className="h-5 w-5" /> Menunggu Pembayaran
          </Button>
          <Button className="w-full py-6" asChild>
            <Link href="/participant/dashboard">Unggah Bukti Transfer di Dashboard</Link>
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        className="w-full py-6 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10 cursor-default flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="h-5 w-5" /> Sudah Terdaftar
      </Button>
    );
  }

  if (isDeadlinePassed) {
    return (
      <Button
        disabled
        className="w-full py-6 text-base font-semibold flex items-center justify-center gap-2"
      >
        <AlertCircle className="h-5 w-5" /> Batas Pendaftaran Lewat
      </Button>
    );
  }

  if (isQuotaFull) {
    return (
      <Button
        disabled
        className="w-full py-6 text-base font-semibold flex items-center justify-center gap-2"
      >
        <AlertCircle className="h-5 w-5" /> Kuota Penuh
      </Button>
    );
  }

  return (
    <>
      <Button
        id="btn-register-event"
        onClick={() => setIsOpen(true)}
        className="w-full py-6 text-base font-semibold shadow-lg shadow-blue-500/20"
      >
        Daftar Event Sekarang
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Pendaftaran</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mendaftar pada event ini?
              {price > 0 ? (
                <span className="block mt-2 font-medium text-foreground">
                  Ini adalah event berbayar dengan biaya sebesar{' '}
                  <strong className="text-blue-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(price)}
                  </strong>
                  . Status awal pendaftaran akan diatur ke <strong>WAITING_PAYMENT</strong>.
                </span>
              ) : (
                <span className="block mt-2 font-medium text-foreground">
                  Ini adalah event gratis. Status pendaftaran Anda akan langsung diatur ke{' '}
                  <strong className="text-emerald-600">REGISTERED</strong>.
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
            >
              Batal
            </Button>
            <Button
              id="btn-confirm-register"
              onClick={() => onRegister()}
              disabled={isPending}
              aria-label="Lanjutkan pendaftaran"
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
