import type { ReactNode } from 'react';
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { headers } from 'next/headers';

import Footer from '@/components/Mixins/Footer';
import Navbar from '@/components/Mixins/Navbar';
import ScrollToTop from '@/components/Common/ScrollToTop';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PermissionProvider } from '@/providers/PermissionProvider';

type Props = {
  children: ReactNode;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const LandingPageLayout = async ({ children }: Props) => {
  // 1. Ambil session di server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Ambil permissions di server
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      roles: {
        include: {
          permissions: {
            select: { name: true },
          },
        },
      },
    },
  });

  const permissionsSet = new Set<string>();
  const roles: string[] = user?.roles.map((r) => r.name) || [];

  user?.roles.forEach((role) => {
    role.permissions.forEach((p) => permissionsSet.add(p.name));
  });

  if (user?.roleId) {
    const singleRole = await prisma.role.findUnique({
      where: { id: user.roleId },
      include: { permissions: { select: { name: true } } },
    });
    if (singleRole) {
      if (!roles.includes(singleRole.name)) roles.push(singleRole.name);
      singleRole.permissions.forEach((p) => permissionsSet.add(p.name));
    }
  }

  const permissions = Array.from(permissionsSet);

  return (
    <div
      className={cn(
        'font-sans',
        inter.variable,
        jakartaSans.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <PermissionProvider initialPermissions={permissions} initialRoles={roles}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </PermissionProvider>
    </div>
  );
};

export default LandingPageLayout;
