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

// Initials helper
const getInitials = (name: string) =>
  name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

// Auth section (shared desktop + mobile)
const NavbarUserDropdown: FC<{
  user: { name: string; email: string; image?: string | null };
  scrolled: boolean;
  isAdmin: boolean;
}> = ({ user, scrolled, isAdmin }) => {
  const router = useRouter();
  const dashboardHref = isAdmin ? '/admin/dashboard' : '/participant/dashboard';

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
    onError: (err: any) => toast.error(err.message || 'Terjadi kesalahan.'),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'relative h-9 w-9 rounded-full ring-2 transition-all',
            scrolled ? 'ring-slate-200 hover:ring-indigo-300' : 'ring-white/30 hover:ring-white/60'
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name} />
            <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardHref as Route} className="cursor-pointer flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          disabled={isPending}
          onClick={() => handleLogout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? 'Keluar...' : 'Keluar'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Server-side role check — RBAC uses roles[] relation, not session.user.role string
  const { data: meData } = useQuery<{ isAdmin: boolean }>({
    queryKey: ['auth-me'],
    queryFn: () => fetch('/api/auth/me').then((r) => r.json()),
    enabled: !!session?.user,
    staleTime: 5 * 60 * 1000,
  });
  const isAdmin = meData?.isAdmin ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const isMenuActive = (path: string) => {
    if (pathname === '/' && path === '/') return true;
    return pathname !== '/' && path !== '/' && pathname.includes(path);
  };

  const navLinkClass = (path: string) =>
    cn(
      'relative px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center',
      'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:transition-all after:duration-300',
      scrolled
        ? 'text-slate-600 hover:text-indigo-600 after:bg-indigo-600'
        : 'text-white/80 hover:text-white after:bg-white',
      isMenuActive(path)
        ? scrolled
          ? 'text-indigo-600 after:w-full'
          : 'text-white font-semibold after:w-full'
        : 'after:w-0'
    );

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-100' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              aria-label="SITIVENT"
              className="inline-flex items-center gap-2 shrink-0"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-sm shadow-sm">
                S
              </span>
              <span
                className={cn(
                  'font-extrabold text-lg tracking-tight transition-colors duration-300',
                  scrolled ? 'text-slate-900' : 'text-white'
                )}
              >
                SITIVENT
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navlinks.map((link) => (
                <Link key={link.path} href={link.path as Route} className={navLinkClass(link.path)}>
                  {link.title}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2">
              {session?.user ? (
                <NavbarUserDropdown user={session.user} scrolled={scrolled} isAdmin={isAdmin} />
              ) : (
                <>
                  <Link
                    href={'/login' as Route}
                    className={cn(
                      'text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200',
                      scrolled
                        ? 'text-slate-600 hover:text-indigo-600'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    Masuk
                  </Link>
                  <Link
                    href={'/register' as Route}
                    className="text-sm font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
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
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
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
        <div className="mx-4 mt-1 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <nav className="p-3">
            <ul className="space-y-0.5">
              {navlinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path as Route}
                    className={cn(
                      'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                      isMenuActive(link.path)
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-4 pb-4 pt-1 flex flex-col gap-2 border-t border-slate-50">
            {session?.user ? (
              <>
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || undefined}
                      alt={session.user.name ?? ''}
                    />
                    <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                      {getInitials(session.user.name ?? '')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                  </div>
                </div>
                <Link
                  href={(isAdmin ? '/admin' : '/participant/dashboard') as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={'/login' as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href={'/register' as Route}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
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
