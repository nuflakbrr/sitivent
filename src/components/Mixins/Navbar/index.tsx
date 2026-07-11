'use client';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { navlinks } from './constant/navLinks';

const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
