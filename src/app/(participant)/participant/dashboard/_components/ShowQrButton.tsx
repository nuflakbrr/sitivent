'use client';
import { useState, type FC } from 'react';
import { QrCode, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  qrToken: string;
  eventTitle: string;
  registrationNumber?: string;
};

const ShowQrButton: FC<Props> = ({ qrToken, eventTitle, registrationNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          id="btn-show-qr"
          className="w-full flex items-center justify-center gap-2 py-5 font-semibold text-sm shadow-md"
        >
          <QrCode className="h-5 w-5" /> Tampilkan QR Code Presensi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-sm rounded-2xl p-6 text-center">
        <DialogHeader>
          <DialogTitle className="text-center font-extrabold text-lg line-clamp-1">
            {eventTitle}
          </DialogTitle>
          <DialogDescription className="text-center text-xs">
            QR Code Kehadiran Peserta
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="bg-white p-3 rounded-2xl border shadow-xs flex items-center justify-center">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrToken}`}
              alt="QR Code Presensi"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>
          <div className="space-y-1">
            {registrationNumber && (
              <p className="font-mono text-xs text-muted-foreground font-semibold">
                No: {registrationNumber}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground font-mono break-all max-w-[200px]">
              Token: {qrToken}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3 text-left">
          <Smartphone className="h-5 w-5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-snug">
            Tunjukkan layar ini kepada petugas/panitia di gerbang masuk event untuk dipindai.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowQrButton;
