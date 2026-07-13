'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { authClient } from '@/lib/authClient';

const forgotPasswordSchema = z.object({
  email: z.email('Format email tidak valid'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: FC = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: async (values: ForgotPasswordValues) => {
      const { error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`,
      });

      if (error) {
        throw new Error('Gagal mengirim email. Periksa kembali alamat email Anda.');
      }

      return values.email;
    },
    onSuccess: (email) => {
      setSentEmail(email);
      setEmailSent(true);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#3D3D3A] placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:border-[#D97757] focus:shadow-[0_0_0_3px_rgba(217,119,87,0.12)]';

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'rgba(217,119,87,0.12)' }}
        >
          <CheckCircle size={32} style={{ color: '#D97757' }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: '#141413' }}>
          Email Terkirim!
        </h2>
        <p className="text-sm" style={{ color: '#87867F' }}>
          Kami telah mengirim tautan reset password ke{' '}
          <span className="font-semibold" style={{ color: '#3D3D3A' }}>
            {sentEmail}
          </span>
          . Silakan periksa kotak masuk Anda.
        </p>
        <p className="text-xs" style={{ color: '#87867F' }}>
          Tidak menerima email? Periksa folder spam atau{' '}
          <button
            type="button"
            onClick={() => setEmailSent(false)}
            className="font-semibold underline"
            style={{ color: '#D97757' }}
          >
            coba lagi
          </button>
          .
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold mt-4"
          style={{ color: '#87867F' }}
        >
          <ArrowLeft size={15} />
          Kembali ke halaman login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => handleSubmit(v))} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="forgot-email"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: '#87867F' }}
        >
          Alamat Email
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Mail size={16} style={{ color: '#87867F' }} />
          </span>
          <input
            id="forgot-email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            disabled={isPending}
            {...form.register('email')}
            className={`${inputBase} pl-10 ${
              form.formState.errors.email ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
        </div>
        {form.formState.errors.email && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: '#B04A3F' }}>
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        id="btn-forgot-password-submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.98]"
        style={{
          background: isPending ? '#c46843' : '#D97757',
          boxShadow: '0 4px 20px rgba(217,119,87,0.3)',
        }}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Mail size={16} />
            Kirim Tautan Reset Password
          </>
        )}
      </button>

      <p className="text-center text-sm" style={{ color: '#87867F' }}>
        Ingat password Anda?{' '}
        <Link href="/login" className="font-bold transition-colors" style={{ color: '#D97757' }}>
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
};

export default ForgotPasswordForm;
