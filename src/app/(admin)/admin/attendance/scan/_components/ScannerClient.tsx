'use client';
import { useEffect, type FC } from 'react';
import { toast } from 'sonner';
import { QrCode, Smartphone, Camera, CameraOff, Flashlight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useScanner } from './useScanner';
import type { Html5Qrcode } from 'html5-qrcode';

const ScannerClient: FC = () => {
  const {
    token,
    setToken,
    isScanning,
    setIsScanning,
    isSecure,
    isPending,
    isFlashOn,
    onSubmitToken,
    handleManualSubmit,
    handleFileChange,
    handleStartScanning,
    toggleTorch,
  } = useScanner();

  // Meminta izin kamera secara reaktif saat button Aktifkan Kamera ditekan.
  // html5-qrcode tidak akan bisa jalan di iOS/Android webview / browser modern jika izin getUserMedia belum di-prompt oleh action user.
  // Karena itu, isScanning diset true HANYA JIKA getUserMedia berhasil.

  useEffect(() => {
    if (!isScanning) return;

    let html5QrCode: Html5Qrcode | undefined;

    import('html5-qrcode')
      .then(({ Html5Qrcode }) => {
        html5QrCode = new Html5Qrcode('qr-scanner-widget');

        if (html5QrCode) {
          html5QrCode
            .start(
              { facingMode: 'environment' },
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText: string) => {
                onSubmitToken(decodedText);
                setIsScanning(false);
              },
              (_error: unknown) => {
                // parsing failures
              }
            )
            .catch((err: unknown) => {
              console.error('Html5Qrcode start error:', err);
              toast.error('Gagal mengakses kamera. Pastikan izin kamera diberikan.');
              setIsScanning(false);
            });
        }
      })
      .catch((err) => {
        console.error('Html5Qrcode load error:', err);
        toast.error('Gagal memuat modul scanner.');
        setIsScanning(false);
      });

    return () => {
      if (html5QrCode) {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch((err: unknown) => console.error('Failed to stop scanner', err));
        }
      }
    };
  }, [isScanning, onSubmitToken, setIsScanning, isFlashOn]);

  return (
    <div className="max-w-md mx-auto space-y-6 px-1">
      {/* Custom Styles for html5-qrcode buttons & scanner widget UI */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 5%; }
          50% { top: 95%; }
        }
        .animate-laser {
          animation: scan 2.5s infinite linear;
        }
        /* Override default ugly html5-qrcode UI elements */
        #qr-scanner-widget img {
          display: none !important;
        }
        #qr-scanner-widget button {
          background-color: var(--color-primary, #3b82f6) !important;
          color: white !important;
          border: none !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          margin-top: 8px !important;
          cursor: pointer !important;
        }
        #qr-scanner-widget select {
          background-color: transparent !important;
          border: 1px solid rgba(128,128,128,0.3) !important;
          padding: 6px !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          color: inherit !important;
          margin: 4px 0 !important;
        }
        #qr-scanner-widget {
          width: 100% !important;
          height: 100% !important;
          border: none !important;
        }
        #qr-scanner-widget video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>

      {/* Title block */}
      <div className="text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Scan Kehadiran</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gunakan kamera atau input manual untuk mencatat kehadiran peserta.
        </p>
      </div>

      {/* Scanner Viewport */}
      <div className="relative aspect-square w-full max-w-xs mx-auto rounded-3xl overflow-hidden bg-zinc-950 border-4 border-zinc-800 dark:border-zinc-900 shadow-xl flex flex-col items-center justify-center p-0 group">
        {isScanning ? (
          <div id="qr-scanner-widget" className="w-full h-full bg-zinc-950" />
        ) : (
          <>
            <div className="absolute left-4 right-4 h-0.5 bg-red-500/50 shadow-[0_0_8px_#ef4444] animate-laser z-10" />
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-md" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-md" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-md" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-md" />

            <QrCode className="h-16 w-16 text-zinc-800 dark:text-zinc-900 animate-pulse mb-4" />

            {isSecure ? (
              <div className="text-center px-4 z-20 space-y-3">
                <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5">
                  Kamera Dinonaktifkan
                </Badge>
                <p className="text-[10px] text-zinc-400 max-w-50 leading-normal mx-auto">
                  Aktifkan scanner dengan tombol di bawah.
                </p>
                <Button
                  onClick={handleStartScanning}
                  className="z-20 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  <Camera className="h-4 w-4" /> Aktifkan Kamera
                </Button>
              </div>
            ) : (
              <div className="text-center px-4 z-20 space-y-3">
                <Badge variant="destructive" className="text-[10px] uppercase font-bold py-0.5">
                  Koneksi Tidak Aman
                </Badge>
                <p className="text-[10px] text-zinc-400 max-w-50 leading-normal mx-auto">
                  Akses video stream diblokir browser. Ambil foto QR Code menggunakan kamera HP
                  Anda.
                </p>
                <label className="z-20 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition-colors">
                  <Camera className="h-4 w-4" /> Foto QR Code
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </>
        )}
      </div>

      {/* Camera Stop button when scanning */}
      {isScanning && (
        <div className="text-center flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsScanning(false)}
            className="text-xs font-semibold px-4 py-2 border-zinc-300 dark:border-zinc-800 hover:bg-muted/50 rounded-xl"
          >
            <CameraOff className="h-4 w-4 mr-2" /> Matikan Kamera
          </Button>
          <Button
            variant="outline"
            onClick={toggleTorch}
            className={`text-xs font-semibold px-4 py-2 rounded-xl transition-colors ${
              isFlashOn
                ? 'bg-amber-500/20 text-amber-600 border-amber-300 dark:border-amber-500/30'
                : 'border-zinc-300 dark:border-zinc-800 hover:bg-muted/50'
            }`}
          >
            <Flashlight className="h-4 w-4 mr-2" /> Flash: {isFlashOn ? 'On' : 'Off'}
          </Button>
        </div>
      )}

      {/* Manual Input Form */}
      <Card className="border-none shadow-md bg-white dark:bg-zinc-900 rounded-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" /> Input Token Manual
          </CardTitle>
          <CardDescription className="text-[11px]">
            Gunakan input di bawah ini jika scanner kamera mengalami kendala.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <Input
              id="qr-token-input"
              type="text"
              placeholder="Masukkan token QR Code..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isPending}
              className="flex-1 rounded-xl h-11 text-xs"
            />
            <Button
              id="btn-submit-token"
              type="submit"
              disabled={isPending || !token.trim()}
              className="px-4 rounded-xl font-semibold h-11 text-xs shadow-xs"
            >
              {isPending ? 'Mengirim...' : 'Kirim Token'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div id="qr-file-decoder" className="hidden" />
    </div>
  );
};

export default ScannerClient;
