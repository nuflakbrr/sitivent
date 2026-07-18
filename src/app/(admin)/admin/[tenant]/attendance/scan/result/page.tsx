import Link from 'next/link';
import { CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SuccessResultCard } from './_components/SuccessResultCard';
import { FailureResultCard } from './_components/FailureResultCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hasil Scan Presensi - SITIVENT',
  description: 'Hasil validasi presensi pendaftaran peserta.',
};

type Props = {
  searchParams: Promise<{
    status?: string;
    code?: string;
    message?: string;
    name?: string;
    email?: string;
    number?: string;
    event?: string;
    time?: string;
  }>;
};

export default async function ScanResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const isSuccess = params.status === 'success';

  return (
    <main className="min-h-[85vh] flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Status Card */}
        <Card
          className={`border-none overflow-hidden rounded-3xl ${
            isSuccess
              ? 'bg-linear-to-b from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/10 dark:to-zinc-900'
              : 'bg-linear-to-b from-rose-500/10 to-rose-600/5 dark:from-rose-500/10 dark:to-zinc-900'
          }`}
        >
          <CardContent className="p-6 text-center space-y-6">
            {/* Header Icon */}
            <div className="flex justify-center pt-4">
              {isSuccess ? (
                <div className="p-4 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                  <CheckCircle2 className="h-16 w-16" />
                </div>
              ) : (
                <div className="p-4 bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full">
                  <AlertTriangle className="h-16 w-16" />
                </div>
              )}
            </div>

            {/* Status Text / Code */}
            <div className="space-y-2">
              <Badge
                variant={isSuccess ? 'default' : 'destructive'}
                className="text-xs uppercase font-extrabold px-3 py-1 shadow-xs border-none"
              >
                {params.code || (isSuccess ? 'CHECKED_IN' : 'FAILED')}
              </Badge>
              <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                {isSuccess ? 'Presensi Berhasil' : 'Presensi Gagal'}
              </h2>
              {params.message && (
                <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  {params.message}
                </p>
              )}
            </div>

            <Separator className="opacity-40" />

            {/* Render subcomponents based on status */}
            {isSuccess ? (
              <SuccessResultCard
                name={params.name}
                email={params.email}
                number={params.number}
                event={params.event}
                time={params.time}
              />
            ) : (
              <FailureResultCard code={params.code} />
            )}
          </CardContent>
        </Card>

        {/* Scan Again Action Button */}
        <Button size="lg" className="w-full py-6 rounded-2xl font-bold shadow-lg" asChild>
          <Link href="/admin/attendance/scan">
            <ArrowLeft className="h-5 w-5 mr-2" /> Pindai QR Lainnya
          </Link>
        </Button>
      </div>
    </main>
  );
}
