'use client';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { useSession, signOut } from '@/lib/authClient';
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
import { navlinks } from './constant/navLinks';
import { EventSearch } from './EventSearch';
import AlertModal from '@/components/Common/Modals/AlertModal';

interface MeResponse {
  isAdmin: boolean;
}

interface NavbarUserDropdownProps {
  user: { name: string; email: string; image?: string | null };
  scrolled: boolean;
  isAdmin: boolean;
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

const NavbarUserDropdown: FC<NavbarUserDropdownProps> = ({ user, scrolled, isAdmin }) => {
  const router = useRouter();
  const dashboardHref = isAdmin ? '/admin/dashboard' : '/participant/dashboard';
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      const { error } = await signOut();
      if (error) throw new Error('Gagal keluar dari sistem.');
    },
    onSuccess: () => {
      toast.success('Berhasil keluar. Sampai jumpa!');
      router.push('/');
      router.refresh();
    },
    onError: (err: Error) => toast.error(err.message || 'Terjadi kesalahan.'),
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'relative h-9 w-9 rounded-full ring-2 transition-all p-0',
              scrolled ? 'ring-[#D1CFC5] hover:ring-[#D97757]' : 'ring-white/30 hover:ring-white/60'
            )}
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
          className="w-56 rounded-xl border border-[#D1CFC5] shadow-md"
          style={{ background: '#FFFFFF' }}
          align="end"
          forceMount
        >
          <DropdownMenuLabel className="font-normal px-3 py-2.5">
            <p className="text-sm font-semibold text-[#141413] truncate">{user.name}</p>
            <p className="text-xs text-[#87867F] font-mono truncate">{user.email}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#E3DACC]" />
          <DropdownMenuItem asChild>
            <Link
              href={dashboardHref as Route}
              className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-[#3D3D3A] hover:text-[#141413]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#E3DACC]" />
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
};

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const { data: meData } = useQuery<MeResponse>({
    queryKey: ['auth-me'],
    queryFn: () => fetch('/api/auth/me').then((r) => r.json() as Promise<MeResponse>),
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = meData?.isAdmin ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [pathname]);

  const isMenuActive = (path: string): boolean => {
    if (pathname === '/' && path === '/') return true;
    return pathname !== '/' && path !== '/' && pathname.includes(path);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled ? 'bg-[#FFFFFF]/96 backdrop-blur-md border-b border-[#E3DACC]' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="SITIVENT"
              className="inline-flex items-center gap-2 shrink-0"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg font-black text-sm shadow-sm"
                style={{ background: '#D97757', color: '#FFFFFF' }}
              >
                S
              </span>
              <span
                className={cn(
                  'font-extrabold text-lg tracking-tight transition-colors duration-300',
                  scrolled ? 'text-[#141413]' : 'text-white'
                )}
                style={{ fontFamily: 'ui-serif, Georgia, serif' }}
              >
                SITIVENT
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navlinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path as Route}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium transition-colors duration-200',
                    'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-transform after:duration-300 after:origin-center',
                    scrolled
                      ? 'text-[#3D3D3A] hover:text-[#D97757] after:bg-[#D97757]'
                      : 'text-white/80 hover:text-white after:bg-white',
                    isMenuActive(link.path)
                      ? scrolled
                        ? 'text-[#D97757] after:scale-x-100'
                        : 'text-white font-semibold after:scale-x-100'
                      : 'after:scale-x-0'
                  )}
                >
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Desktop right: search + auth */}
            <div className="hidden lg:flex items-center gap-2">
              <EventSearch scrolled={scrolled} />
              {session?.user ? (
                <NavbarUserDropdown user={session.user} scrolled={scrolled} isAdmin={isAdmin} />
              ) : (
                <>
                  <Link
                    href={'/login' as Route}
                    className={cn(
                      'text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200',
                      scrolled
                        ? 'text-[#3D3D3A] hover:text-[#D97757]'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    Masuk
                  </Link>
                  <Link
                    href={'/register' as Route}
                    className="text-sm font-bold px-5 py-2.5 rounded-xl text-white shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    style={{ background: '#D97757' }}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              aria-label="Toggle navigation"
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors',
                scrolled ? 'text-[#3D3D3A] hover:bg-[#F0EEE6]' : 'text-white hover:bg-white/10'
              )}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div
        className={cn(
          'fixed inset-x-0 top-16 z-40 lg:hidden transition-all duration-300 ease-in-out',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
      >
        <div
          className="mx-4 mt-1 rounded-2xl shadow-xl overflow-hidden border"
          style={{ background: '#FFFFFF', borderColor: '#E3DACC' }}
        >
          <nav className="p-3">
            <ul className="space-y-0.5">
              {navlinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path as Route}
                    className={cn(
                      'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isMenuActive(link.path)
                        ? 'font-semibold'
                        : 'text-[#3D3D3A] hover:text-[#141413]'
                    )}
                    style={
                      isMenuActive(link.path)
                        ? { background: '#F5E8E3', color: '#D97757' }
                        : { backgroundColor: 'transparent' }
                    }
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="px-4 pb-4 pt-2 flex flex-col gap-2 border-t"
            style={{ borderColor: '#E3DACC' }}
          >
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image ?? undefined}
                      alt={session.user.name ?? ''}
                    />
                    <AvatarFallback
                      style={{ background: '#D97757', color: '#FFF' }}
                      className="text-xs font-bold"
                    >
                      {getInitials(session.user.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#141413] truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-[#87867F] font-mono truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href={(isAdmin ? '/admin/dashboard' : '/participant/dashboard') as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={{ background: '#F5E8E3', color: '#D97757' }}
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={'/login' as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-[#3D3D3A] hover:text-[#141413] transition-colors"
                  style={{ background: '#F0EEE6' }}
                >
                  Masuk
                </Link>
                <Link
                  href={'/register' as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                  style={{ background: '#D97757' }}
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
