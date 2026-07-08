'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { LogOut, User, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

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

export default function ParticipantNavbarClient({
  user,
}: {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}) {
  const router = useRouter();

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) {
        throw new Error('Gagal keluar dari sistem.');
      }
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      router.push('/login');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Terjadi kesalahan saat keluar.');
    },
  });

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/participant/dashboard" className="cursor-pointer flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive flex items-center"
          disabled={isPending}
          onClick={() => handleLogout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? 'Keluar...' : 'Keluar'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
