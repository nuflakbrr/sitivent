'use client';
import type { FC } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

import { loginSchema } from '@/schemas/auth';
import type { LoginValues } from '@/services/auth';
import { signIn } from '@/lib/authClient';
import { getUserDefaultTenantSlug } from '@/services/user-tenants';
import type { Route } from 'next';

const LoginForm: FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: async (values: LoginValues) => {
      const { data, error } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/admin/dashboard',
      });

      const tenantSlug = data?.user?.id ? await getUserDefaultTenantSlug(data.user.id) : null;

      if (error) {
        let message = 'Terjadi kesalahan saat login.';
        if (error.status === 401 || error.code === 'INVALID_EMAIL_OR_PASSWORD') {
          message = 'Email atau password salah.';
        } else if (error.code === 'USER_NOT_FOUND') {
          message = 'Pengguna tidak ditemukan.';
        }
        throw new Error(message);
      }

      return { data, tenantSlug };
    },
    onSuccess: (result) => {
      toast.success('Login berhasil! Selamat datang kembali.');
      if (result?.tenantSlug) {
        router.push(`/admin/${result.tenantSlug}/dashboard` as Route);
      } else {
        router.push('/admin/dashboard' as Route);
      }
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: LoginValues) => handleLogin(values);

  const inputBase =
    'w-full px-4 py-3 rounded-xl border-2 bg-white text-[#3D3D3A] placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:border-[#D97757] focus:shadow-[0_0_0_3px_rgba(217,119,87,0.12)]';

  const errorBase = 'mt-1.5 text-xs text-[#B04A3F] font-medium';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email */}
      <div>
        <label
          htmlFor="login-email"
          className="block text-xs font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
        >
          Email
        </label>
        <input
          id="login-email"
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
          htmlFor="login-password"
          className="block text-xs font-bold uppercase tracking-widest text-[#87867F] mb-1.5"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
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
      </div>

      <div className="flex justify-end -mt-2">
        <Link
          href={'/forgot-password' as Route}
          className="text-xs font-semibold text-[#D97757] hover:underline"
        >
          Lupa password?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        id="btn-login-submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#D97757] hover:bg-[#c46843] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#D97757]/25 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Memproses...
          </>
        ) : (
          <>
            <LogIn size={16} />
            Masuk ke Dashboard
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-[#E3DACC]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#87867F]">atau</span>
        <div className="flex-1 h-px bg-[#E3DACC]" />
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-[#87867F]">
        Belum punya akun?{' '}
        <Link
          href="/register"
          className="font-bold text-[#D97757] hover:text-[#c46843] transition-colors"
        >
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
