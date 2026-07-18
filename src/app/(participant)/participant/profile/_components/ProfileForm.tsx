'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError, FieldContent, FieldGroup } from '@/components/ui/field';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { authClient, signOut } from '@/lib/authClient';
import { updateUserName } from '@/services/profile';
import { sendPasswordChangeNotificationEmail } from '@/services/auth';
import {
  updateNameSchema,
  changePasswordSchema,
  type UpdateNameValues,
  type ChangePasswordValues,
} from '@/schemas/profile';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Pending password values — held until user confirms modal
  const [pendingPassValues, setPendingPassValues] = useState<ChangePasswordValues | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // --- Update Name ---
  const nameForm = useForm<UpdateNameValues>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: { name: user.name },
  });

  const { mutate: saveName, isPending: savingName } = useMutation({
    mutationFn: async (values: UpdateNameValues) => {
      const res = await updateUserName(values.name);
      if (!res.success) throw new Error(res.error ?? 'Gagal memperbarui nama.');
    },
    onSuccess: () => {
      toast.success('Nama berhasil diperbarui.');
      // Hard reload agar server component re-fetch session dengan nama terbaru
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  // --- Change Password ---
  const passForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // Form submit → simpan nilai, buka modal konfirmasi
  const handlePassSubmit = (values: ChangePasswordValues) => {
    setPendingPassValues(values);
    setIsConfirmModalOpen(true);
  };

  const { mutate: changePass, isPending: changingPass } = useMutation({
    mutationFn: async (values: ChangePasswordValues) => {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });
      if (error) throw new Error(error.message ?? 'Gagal mengganti password.');
      // Kirim email notifikasi
      await sendPasswordChangeNotificationEmail(user.email, user.name);
      // Logout
      await signOut();
    },
    onSuccess: () => {
      toast.success('Password berhasil diperbarui. Silakan login kembali.');
      router.push('/login');
      router.refresh();
    },
    onError: (err: Error) => {
      setIsConfirmModalOpen(false);
      setPendingPassValues(null);
      const msg = err.message?.toLowerCase() ?? '';
      if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('wrong')) {
        toast.error('Password saat ini salah.');
      } else {
        toast.error(err.message || 'Gagal mengganti password.');
      }
    },
  });

  const handleConfirmChangePass = () => {
    if (!pendingPassValues) return;
    changePass(pendingPassValues);
  };

  const handleCloseModal = () => {
    if (changingPass) return;
    setIsConfirmModalOpen(false);
    setPendingPassValues(null);
  };

  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #E3DACC',
    borderRadius: '16px',
    padding: '28px',
  };

  const sectionHeaderStyle = {
    fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
    color: '#141413',
    fontWeight: 600,
    fontSize: '1.1rem',
  };

  return (
    <>
      <div className="space-y-6">
        {/* Update Nama */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'rgba(217,119,87,0.1)' }}
            >
              <User className="w-4 h-4" style={{ color: '#D97757' }} />
            </div>
            <div>
              <h2 style={sectionHeaderStyle}>Informasi Profil</h2>
              <p className="text-xs mt-0.5" style={{ color: '#87867F' }}>
                Perbarui nama tampilan akun Anda
              </p>
            </div>
          </div>

          <form onSubmit={nameForm.handleSubmit((v) => saveName(v))}>
            <FieldGroup className="gap-4">
              {/* Email readonly */}
              <Field>
                <FieldLabel className="text-sm font-medium text-[#3D3D3A]">Email</FieldLabel>
                <Input
                  value={user.email}
                  disabled
                  className="bg-[#FAF9F5] text-[#87867F] border-[#E3DACC]"
                />
                <FieldContent>
                  <p className="text-xs" style={{ color: '#87867F' }}>
                    Email tidak dapat diubah melalui halaman ini.
                  </p>
                </FieldContent>
              </Field>

              <Field data-invalid={!!nameForm.formState.errors.name}>
                <FieldLabel className="text-sm font-medium text-[#3D3D3A]">Nama Lengkap</FieldLabel>
                <Input
                  placeholder="Masukkan nama lengkap"
                  className="border-[#E3DACC] focus-visible:ring-[#D97757]"
                  {...nameForm.register('name')}
                />
                {nameForm.formState.errors.name && (
                  <FieldError errors={[{ message: nameForm.formState.errors.name.message }]} />
                )}
              </Field>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={savingName}
                  className="flex items-center gap-2"
                  style={{ background: '#D97757', color: '#FFFFFF' }}
                >
                  {savingName ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Nama
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>

        {/* Ganti Password */}
        <div style={cardStyle}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'rgba(217,119,87,0.1)' }}
            >
              <Lock className="w-4 h-4" style={{ color: '#D97757' }} />
            </div>
            <div>
              <h2 style={sectionHeaderStyle}>Keamanan Akun</h2>
              <p className="text-xs mt-0.5" style={{ color: '#87867F' }}>
                Ganti password untuk menjaga keamanan akun Anda
              </p>
            </div>
          </div>

          <form onSubmit={passForm.handleSubmit(handlePassSubmit)}>
            <FieldGroup className="gap-4">
              <Field data-invalid={!!passForm.formState.errors.currentPassword}>
                <FieldLabel className="text-sm font-medium text-[#3D3D3A]">
                  Password Saat Ini
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="border-[#E3DACC] focus-visible:ring-[#D97757] pr-10"
                    {...passForm.register('currentPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87867F] hover:text-[#141413] transition-colors"
                    onClick={() => setShowCurrent((p) => !p)}
                    tabIndex={-1}
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passForm.formState.errors.currentPassword && (
                  <FieldError
                    errors={[{ message: passForm.formState.errors.currentPassword.message }]}
                  />
                )}
              </Field>

              <Field data-invalid={!!passForm.formState.errors.newPassword}>
                <FieldLabel className="text-sm font-medium text-[#3D3D3A]">
                  Password Baru
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showNew ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    className="border-[#E3DACC] focus-visible:ring-[#D97757] pr-10"
                    {...passForm.register('newPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87867F] hover:text-[#141413] transition-colors"
                    onClick={() => setShowNew((p) => !p)}
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passForm.formState.errors.newPassword && (
                  <FieldError
                    errors={[{ message: passForm.formState.errors.newPassword.message }]}
                  />
                )}
              </Field>

              <Field data-invalid={!!passForm.formState.errors.confirmPassword}>
                <FieldLabel className="text-sm font-medium text-[#3D3D3A]">
                  Konfirmasi Password Baru
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi password baru"
                    className="border-[#E3DACC] focus-visible:ring-[#D97757] pr-10"
                    {...passForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87867F] hover:text-[#141413] transition-colors"
                    onClick={() => setShowConfirm((p) => !p)}
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passForm.formState.errors.confirmPassword && (
                  <FieldError
                    errors={[{ message: passForm.formState.errors.confirmPassword.message }]}
                  />
                )}
              </Field>

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  disabled={changingPass}
                  className="flex items-center gap-2"
                  style={{ background: '#D97757', color: '#FFFFFF' }}
                >
                  {changingPass ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Ganti Password
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>

      {/* Modal Konfirmasi Ganti Password */}
      <AlertModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmChangePass}
        loading={changingPass}
        title="Konfirmasi Ganti Password"
        desc="Setelah password berhasil diubah, Anda akan otomatis keluar dari semua sesi dan diarahkan ke halaman login. Notifikasi perubahan password juga akan dikirimkan ke email Anda. Lanjutkan?"
      />
    </>
  );
}
