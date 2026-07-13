'use client';

import { useState, type FC, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, User as UserIcon, Lock, Check } from 'lucide-react';

import Modal from '@/components/Common/Modals/Modal';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { authClient } from '@/lib/authClient';

const translateAuthError = (message: string): string => {
  if (!message) return '';
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('invalid password') || lowerMessage.includes('incorrect password')) {
    return 'Kata sandi saat ini tidak valid.';
  }
  if (
    lowerMessage.includes('password is too short') ||
    lowerMessage.includes('should be at least')
  ) {
    return 'Kata sandi baru terlalu pendek (minimal 8 karakter).';
  }
  if (lowerMessage.includes('user not found')) {
    return 'Pengguna tidak ditemukan.';
  }
  if (
    lowerMessage.includes('email already in use') ||
    lowerMessage.includes('email already exists')
  ) {
    return 'Alamat email sudah digunakan.';
  }

  return message;
};

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

const UserSettingsModal: FC<UserSettingsModalProps> = ({ isOpen, onClose, user }) => {
  const router = useRouter();

  // Profile fields state
  const [name, setName] = useState(user.name);
  const email = user.email;

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Transaction transition hooks
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Submit profile details update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama lengkap tidak boleh kosong.');
      return;
    }

    startProfileTransition(async () => {
      try {
        // Update name
        const { error } = await authClient.updateUser({
          name: name.trim(),
        });

        if (error) {
          toast.error(
            error.message ? translateAuthError(error.message) : 'Gagal memperbarui nama profil.'
          );
        } else {
          toast.success('Profil Anda berhasil diperbarui!');
          router.refresh();
          onClose();
        }
      } catch (err) {
        console.error(err);
        toast.error('Terjadi kesalahan jaringan.');
      }
    });
  };

  // Submit password change
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Masukkan kata sandi saat ini.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Kata sandi baru minimal harus 8 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    startPasswordTransition(async () => {
      try {
        const { error } = await authClient.changePassword({
          currentPassword,
          newPassword,
          revokeOtherSessions: true, // Auto logout all other sessions
        });

        if (error) {
          toast.error(
            error.message ? translateAuthError(error.message) : 'Gagal memperbarui kata sandi.'
          );
        } else {
          const { sendPasswordChangeNotificationEmail } = await import('@/services/auth');
          void sendPasswordChangeNotificationEmail(user.email, user.name);

          toast.success('Kata sandi berhasil diperbarui! Silakan login kembali.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          await authClient.signOut();
          router.push('/login');
          router.refresh();
        }
      } catch (err) {
        console.error(err);
        toast.error('Terjadi kesalahan jaringan.');
      }
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Pengaturan Akun"
        description="Kelola informasi pribadi dan pengaturan keamanan akun Anda."
        className="sm:max-w-[500px] w-full"
      >
        <div className="mt-4 flex flex-col w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="size-4" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="size-4" />
                Keamanan
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <FieldGroup className="space-y-4">
                  {/* Email Input */}
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input type="email" value={email} required disabled />
                  </Field>

                  {/* Name Input */}
                  <Field>
                    <FieldLabel>Nama Lengkap</FieldLabel>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      required
                      disabled={isProfilePending}
                    />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isProfilePending}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isProfilePending || name.trim() === ''}>
                    {isProfilePending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <form onSubmit={handleSavePassword} className="space-y-6">
                <FieldGroup className="space-y-4">
                  {/* Current Password */}
                  <Field>
                    <FieldLabel>Kata Sandi Saat Ini</FieldLabel>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan kata sandi saat ini"
                      required
                      disabled={isPasswordPending}
                    />
                  </Field>

                  {/* New Password */}
                  <Field>
                    <FieldLabel>Kata Sandi Baru</FieldLabel>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter"
                      required
                      disabled={isPasswordPending}
                    />
                  </Field>

                  {/* Confirm New Password */}
                  <Field>
                    <FieldLabel>Konfirmasi Kata Sandi Baru</FieldLabel>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      required
                      disabled={isPasswordPending}
                    />
                  </Field>
                </FieldGroup>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isPasswordPending}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isPasswordPending ||
                      !currentPassword ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                    }
                  >
                    {isPasswordPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Perbarui Kata Sandi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default UserSettingsModal;
