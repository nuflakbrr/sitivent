'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { registerSchema } from '@/schemas/auth';
import type { RegisterValues } from '@/services/auth';
import { registerAction } from '@/services/auth';

const RegisterForm: FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: async (values: RegisterValues) => {
      const result = await registerAction(values);
      if (!result.success) {
        throw new Error(result.error ?? 'Terjadi kesalahan saat registrasi.');
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Akun berhasil dibuat! Silakan masuk.');
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: RegisterValues) => handleRegister(values);

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#3D3D3A] placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:border-[#D97757] focus:shadow-[0_0_0_3px_rgba(217,119,87,0.12)]';

  const errorBase = 'mt-1.5 text-xs text-[#B04A3F] font-medium';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Full name */}
      <div>
        <label
          htmlFor="reg-name"
          className="block text-xs font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
        >
          Nama Lengkap
        </label>
        <input
          id="reg-name"
          type="text"
          placeholder="Nama Lengkapmu"
          autoComplete="name"
          disabled={isPending}
          {...form.register('name')}
          className={`${inputBase} ${
            form.formState.errors.name ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {form.formState.errors.name && (
          <p className={errorBase}>{form.formState.errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="reg-email"
          className="block text-xs font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
        >
          Email
        </label>
        <input
          id="reg-email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          disabled={isPending}
          {...form.register('email')}
          className={`${inputBase} ${
            form.formState.errors.email ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        {form.formState.errors.email && (
          <p className={errorBase}>{form.formState.errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="reg-password"
          className="block text-xs font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 karakter"
            autoComplete="new-password"
            disabled={isPending}
            {...form.register('password')}
            className={`${inputBase} pr-11 ${
              form.formState.errors.password ? 'border-[#B04A3F]' : 'border-[#E3DACC]'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87867F] hover:text-[#D97757] transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
        {form.formState.errors.password && (
          <p className={errorBase}>{form.formState.errors.password.message}</p>
        )}

        {/* Password strength hint */}
        <p className="mt-1.5 text-[11px]" style={{ color: '#87867F' }}>
          Gunakan minimal 8 karakter, kombinasikan huruf dan angka.
        </p>
      </div>

      {/* Role notice */}
      {/* <div
        className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
        style={{ background: '#F0EEE6', border: '1.5px solid #E3DACC' }}
      >
        <span className="mt-0.5 text-base">🎟️</span>
        <p style={{ color: '#3D3D3A' }}>
          Akun kamu akan didaftarkan sebagai <strong style={{ color: '#D97757' }}>Peserta</strong>{' '}
          secara otomatis.
        </p>
      </div> */}

      {/* Submit */}
      <button
        type="submit"
        id="btn-register-submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
        style={{ background: '#D97757', boxShadow: '0 6px 20px rgba(217,119,87,0.30)' }}
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Membuat akun...
          </>
        ) : (
          <>
            <UserPlus size={16} />
            Buat Akun Sekarang
          </>
        )}
      </button>

      {/* Login link */}
      <p className="text-center text-sm" style={{ color: '#87867F' }}>
        Sudah punya akun?{' '}
        <Link href="/login" className="font-bold transition-colors" style={{ color: '#D97757' }}>
          Masuk di sini
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
