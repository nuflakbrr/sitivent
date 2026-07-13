import type { FC } from 'react';
import type { Metadata } from 'next';
import { genPageMetadata } from '@/app/seo';
import ResetPasswordForm from './_components/ResetPasswordForm';

export const metadata: Metadata = genPageMetadata({
  title: 'Reset Password',
  description: 'Buat password baru untuk akun SITIVENT Anda.',
});

const ResetPassword: FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        className="w-full max-w-md p-8 md:p-10 rounded-3xl border shadow-xl bg-white"
        style={{ borderColor: '#E3DACC' }}
      >
        <div className="text-center mb-8">
          <h1
            className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2"
            style={{
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              color: '#141413',
            }}
          >
            Buat Password Baru
          </h1>
          <p className="text-sm" style={{ color: '#87867F' }}>
            Masukkan password baru untuk akun Anda.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
