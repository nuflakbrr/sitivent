'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { confirmOnlineAttendance } from '@/services/attendance';

interface ConfirmOnlineButtonProps {
  registrationId: string;
  disabled: boolean;
}

export default function ConfirmOnlineButton({
  registrationId,
  disabled,
}: ConfirmOnlineButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const res = await confirmOnlineAttendance(registrationId);
      if (res.success) {
        toast.success(res.message || 'Presensi online berhasil dikonfirmasi!');
        router.refresh();
      } else {
        toast.error(res.message || 'Gagal mengonfirmasi kehadiran.');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengonfirmasi kehadiran.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleConfirm}
      disabled={disabled || isLoading}
      className="w-full cursor-pointer disabled:cursor-not-allowed"
      style={{
        background: disabled ? '#E3DACC' : '#788C5D',
        color: disabled ? '#87867F' : '#ffffff',
        borderColor: 'transparent',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      {isLoading ? (
        'Memproses...'
      ) : disabled ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Hadir Terkonfirmasi
        </>
      ) : (
        'Konfirmasi Kehadiran'
      )}
    </Button>
  );
}
