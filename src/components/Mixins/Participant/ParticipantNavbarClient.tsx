'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LogOut, LayoutDashboard, CreditCard, Award, UserCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useTour } from '@reactour/tour';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/authClient';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { useIsMobile } from '@/hooks/useMobile';

interface Props {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

const getInitials = (name: string): string =>
  name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

export default function ParticipantNavbarClient({ user }: Props) {
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { isOpen: isTourOpen } = useTour();
  const isMobile = useIsMobile();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) throw new Error('Gagal keluar dari sistem.');
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      router.push('/login');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Terjadi kesalahan saat keluar.');
    },
  });

  return (
    <>
      <DropdownMenu
        open={open || (isMobile && isTourOpen)}
        onOpenChange={setOpen}
        modal={!(isMobile && isTourOpen)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 ring-2 ring-[#D1CFC5] hover:ring-[#D97757] transition-all"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback
                style={{ background: '#D97757', color: '#FFFFFF' }}
                className="text-xs font-bold"
              >
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-xl border shadow-md"
          style={{ background: '#FFFFFF', borderColor: '#D1CFC5' }}
          align="end"
          forceMount
          onInteractOutside={(e) => {
            if (isMobile && isTourOpen) e.preventDefault();
          }}
          onFocusOutside={(e) => {
            if (isMobile && isTourOpen) e.preventDefault();
          }}
        >
          <DropdownMenuLabel className="font-normal px-3 py-2.5">
            <p className="text-sm font-semibold text-[#141413] truncate">{user.name}</p>
            <p className="text-xs text-[#87867F] font-mono truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator style={{ background: '#E3DACC' }} />
          <DropdownMenuItem asChild>
            <Link
              href="/participant/dashboard"
              data-tour-mobile="step-dashboard"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/participant/event-history"
              data-tour-mobile="step-history"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <Award className="h-4 w-4" />
              Riwayat Event
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/participant/payment-history"
              data-tour-mobile="step-payments"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <CreditCard className="h-4 w-4" />
              Riwayat Pembayaran
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/participant/profile"
              data-tour-mobile="step-profile"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <UserCircle className="h-4 w-4" />
              Profil Saya
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ background: '#E3DACC' }} />
          <DropdownMenuItem asChild>
            <Link
              href="/"
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ background: '#E3DACC' }} />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm"
            onClick={() => setIsLogoutModalOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => handleLogout()}
        loading={isPending}
        title="Keluar dari Sistem"
        desc="Apakah Anda yakin ingin keluar dari akun Anda?"
      />
    </>
  );
}
