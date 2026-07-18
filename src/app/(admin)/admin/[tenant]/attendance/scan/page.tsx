import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { verifyPermission } from '@/services/security';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ScannerClient from './_components/ScannerClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan Presensi - SITIVENT',
  description: 'Pindai QR Code peserta untuk mencatat kehadiran secara cepat.',
};

export default async function ScanPage() {
  const hasScanPermission = await verifyPermission('attendance.scan');
  if (!hasScanPermission) {
    return redirect('/admin/dashboard');
  }

  const reqHeaders = await headers();
  const userAgent = reqHeaders.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  if (!isMobile) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-none shadow-xl rounded-3xl overflow-hidden bg-linear-to-b from-amber-500/10 to-amber-600/5 dark:from-amber-500/10 dark:to-zinc-900">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center pt-4">
              <div className="p-4 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full animate-pulse">
                <Smartphone className="h-16 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                Akses Terbatas: Khusus Smartphone
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Modul scan presensi kehadiran dirancang khusus untuk mobile-first menggunakan kamera
                perangkat smartphone Anda.
              </p>
            </div>
            <Button size="lg" className="w-full py-6 rounded-2xl font-bold shadow-md" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-5 w-5 mr-2" /> Kembali ke Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <ScannerClient />
    </div>
  );
}
