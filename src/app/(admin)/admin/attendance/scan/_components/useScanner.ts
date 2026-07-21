import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { scanQrCode } from '@/services/attendance';

export const useScanner = () => {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const { mutate: onSubmitToken, isPending } = useMutation({
    mutationFn: (qrToken: string) => scanQrCode(qrToken),
    onSuccess: (result) => {
      toast.dismiss('file-scan');
      if (result.success) {
        const params = new URLSearchParams({
          status: 'success',
          code: 'CHECKED_IN',
          name: result.data?.participantName || '',
          email: result.data?.participantEmail || '',
          number: result.data?.registrationNumber || '',
          event: result.data?.eventTitle || '',
          time: result.data?.scanTime ? new Date(result.data.scanTime).toISOString() : '',
        });
        router.push(`/admin/attendance/scan/result?${params.toString()}`);
      } else {
        const params = new URLSearchParams({
          status: 'error',
          code: result.error || 'SYSTEM_ERROR',
          message: result.message || 'Terjadi kesalahan.',
        });
        router.push(`/admin/attendance/scan/result?${params.toString()}`);
      }
    },
    onError: () => {
      toast.dismiss('file-scan');
      toast.error('Gagal memproses presensi peserta.');
    },
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    onSubmitToken(token.trim());
  };

  const preprocessImage = (imgFile: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxSide = 800;
          let width = img.width;
          let height = img.height;

          if (width > maxSide || height > maxSide) {
            if (width > height) {
              height = Math.round((height * maxSide) / width);
              width = maxSide;
            } else {
              width = Math.round((width * maxSide) / height);
              height = maxSide;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(new File([blob], imgFile.name, { type: 'image/jpeg' }));
                } else {
                  resolve(imgFile);
                }
              },
              'image/jpeg',
              0.85
            );
          } else {
            resolve(imgFile);
          }
        };
        img.onerror = () => resolve(imgFile);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(imgFile);
      reader.readAsDataURL(imgFile);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading('Membaca QR Code dari foto...', { id: 'file-scan' });

    try {
      const processedFile = await preprocessImage(file);
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5Qrcode = new Html5Qrcode('qr-file-decoder');

      const decodedText = await html5Qrcode.scanFile(processedFile, false);
      onSubmitToken(decodedText);
    } catch (err) {
      console.error('File scan error:', err);
      toast.error('Gagal mendeteksi QR Code. Pastikan foto QR Code terlihat jelas.', {
        id: 'file-scan',
      });
    }
  };

  const handleStartScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      stream.getTracks().forEach((track) => track.stop());
      setIsScanning(true);
    } catch (err) {
      console.error('Camera permission denied:', err);
      toast.error('Izin kamera ditolak atau kamera tidak ditemukan.');
    }
  };

  useEffect(() => {
    setIsSecure(window.isSecureContext);
  }, []);

  return {
    token,
    setToken,
    isScanning,
    setIsScanning,
    isSecure,
    isPending,
    onSubmitToken,
    handleManualSubmit,
    handleFileChange,
    handleStartScanning,
  };
};
