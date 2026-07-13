'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import { authClient } from '@/lib/authClient';
import type { Route } from 'next';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { mutate: handleReset, isPending } = useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      if (!token) throw new Error('Token reset password tidak valid atau telah kedaluwarsa.');

      const { error } = await authClient.resetPassword({
        newPassword: values.password,
        token,
      });

      if (error) {
        if (error.code === 'INVALID_TOKEN') {
          throw new Error('Token reset password tidak valid atau telah kedaluwarsa.');
        }
        throw new Error('Gagal mereset password. Silakan coba lagi.');
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#3D3D3A] placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:border-[#D97757] focus:shadow-[0_0_0_3px_rgba(217,119,87,0.12)]';

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm font-medium" style={{ color: '#B04A3F' }}>
          Token reset password tidak valid atau tidak ditemukan.
        </p>
        <Link
          href={'/forgot-password' as Route}
          className="inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: '#D97757' }}
        >
          Minta ulang tautan reset
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: 'rgba(217,119,87,0.12)' }}
        >
          <CheckCircle size={32} style={{ color: '#D97757' }} />
        </div>
        <h2 className="text-lg font-bold" style={{ color: '#141413' }}>
          Password Berhasil Diubah!
        </h2>
        <p className="text-sm" style={{ color: '#87867F' }}>
          Password Anda telah berhasil diperbarui. Anda akan diarahkan ke halaman login dalam
          beberapa detik...
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: '#D97757' }}
        >
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => handleReset(v))} className="space-y-5" noValidate>
      {/* Password Baru */}
      <div>
        <label
          htmlFor="reset-password"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: '#87867F' }}
        >
          Password Baru
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock size={16} style={{ color: '#87867F' }} />
          </span>
          <input
            id="reset-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...form.register('password')}
            className={`${inputBase} pl-10 pr-11 ${
              form.formState.errors.password ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#87867F' }}
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: '#B04A3F' }}>
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Konfirmasi Password */}
      <div>
        <label
          htmlFor="reset-confirm"
          className="block text-xs font-bold uppercase tracking-widest mb-1.5"
          style={{ color: '#87867F' }}
        >
          Konfirmasi Password
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Lock size={16} style={{ color: '#87867F' }} />
          </span>
          <input
            id="reset-confirm"
            type={showConfirm ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            {...form.register('confirmPassword')}
            className={`${inputBase} pl-10 pr-11 ${
              form.formState.errors.confirmPassword ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#87867F' }}
            tabIndex={-1}
            aria-label={showConfirm ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="mt-1.5 text-xs font-medium" style={{ color: '#B04A3F' }}>
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        id="btn-reset-password-submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 active:scale-[0.98]"
        style={{
          background: '#D97757',
          boxShadow: '0 4px 20px rgba(217,119,87,0.3)',
        }}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <Lock size={16} />
            Simpan Password Baru
          </>
        )}
      </button>

      <p className="text-center text-sm" style={{ color: '#87867F' }}>
        Ingat password Anda?{' '}
        <Link href="/login" className="font-bold" style={{ color: '#D97757' }}>
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
};

export default ResetPasswordForm;
