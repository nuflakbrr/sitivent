import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';
import { prisma } from './lib/prisma';

/**
 * Next.js 16 Proxy implementation for Route Protection
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isParticipantPath = pathname.startsWith('/participant');
  const isAuthPath = pathname.startsWith('/login');
  const isRegisterPath = pathname.startsWith('/register');

  const cmsSegments = ['managements', 'master', 'transactions', 'attendance'];
  const isCMSPath = cmsSegments.some((segment) => pathname.startsWith(`/admin/${segment}`));

  // Jika bukan path yang diproteksi, langsung lewat saja (optimasi)
  if (!isAdminPath && !isParticipantPath && !isAuthPath && !isCMSPath && !isRegisterPath) {
    return NextResponse.next();
  }

  try {
    // Ambil session secara langsung dari database via Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Cek apakah session benar-benar valid dan belum kedaluwarsa
    const isAuthenticated = !!(
      session &&
      session.user &&
      session.session &&
      new Date(session.session.expiresAt) > new Date()
    );

    // Blocker 1: Jika akses /admin atau /participant tapi BELUM login -> Tendang ke /login
    if ((isAdminPath || isParticipantPath) && !isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Ambil permissions jika sudah login
    let permissionsSet = new Set<string>();
    if (isAuthenticated) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
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

      if (user) {
        // Ambil permissions dari relasi many-to-many (roles)
        user.roles.forEach((role) => {
          role.permissions.forEach((p) => permissionsSet.add(p.name));
        });

        // Jika ada roleId (one-to-many), ambil juga permissions-nya
        if (user.roleId) {
          const singleRole = await prisma.role.findUnique({
            where: { id: user.roleId },
            include: { permissions: { select: { name: true } } },
          });
          singleRole?.permissions.forEach((p) => permissionsSet.add(p.name));
        }
      } else {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    const hasAdminAccess = permissionsSet.has('admin.access');

    const tenant = isAuthenticated
      ? await prisma.userTenant.findFirst({
          where: { userId: session.user.id },
          include: { tenant: true },
          orderBy: { tenant: { createdAt: 'asc' } },
        })
      : null;

    const defaultAdminDashboard = tenant?.tenant?.slug
      ? `/admin/${tenant.tenant.slug}/dashboard`
      : '/admin/dashboard';

    // Blocker 2: Jika akses /admin tapi tidak punya akses admin -> Tendang ke /participant/dashboard
    if (isAdminPath && isAuthenticated && !hasAdminAccess) {
      return NextResponse.redirect(new URL('/participant/dashboard', request.url));
    }

    // Blocker 3: Jika akses /login tapi SUDAH login -> Tendang ke dashboard yang sesuai
    if ((isAuthPath || isRegisterPath) && isAuthenticated) {
      if (hasAdminAccess) {
        return NextResponse.redirect(new URL(defaultAdminDashboard, request.url));
      } else {
        return NextResponse.redirect(new URL('/participant/dashboard', request.url));
      }
    }

    /**
     * Blocker 4: Jika paksa akses segment CMS, lempar ke halaman children pertama masing-masing segment
     */
    if (isCMSPath && isAuthenticated) {
      const redirectMap: Record<string, string> = {
        '/admin/managements': '/admin/managements/permissions',
        '/admin/master': '/admin/master/events',
        '/admin/transactions': '/admin/transactions/registrations',
        '/admin/attendance': '/admin/attendance/scan',
        '/admin': '/admin/dashboard',
      };

      if (redirectMap[pathname]) {
        return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
      }
    }
  } catch (error) {
    console.error('Proxy auth check error:', error);
    // Fail-safe: Jika sistem auth down, proteksi halaman admin tetap berjalan
    if (isAdminPath || isParticipantPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/participant/:path*', '/login', '/register'],
};
