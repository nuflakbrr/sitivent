import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['panitia', 'superadmin'];

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false, tenantSlug: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        roleId: true,
        roles: { select: { name: true } },
        userTenants: {
          include: { tenant: { select: { slug: true } } },
          take: 1,
          orderBy: { tenant: { createdAt: 'asc' } },
        },
      },
    });

    if (!user) return NextResponse.json({ isAdmin: false, tenantSlug: null });

    const tenantSlug = user.userTenants[0]?.tenant.slug ?? null;

    const hasAdminRole = user.roles.some((r) => ADMIN_ROLES.includes(r.name.toLowerCase()));
    const hasTenantMembership = user.userTenants.length > 0;
    if (hasAdminRole || hasTenantMembership) {
      return NextResponse.json({ isAdmin: true, tenantSlug });
    }

    if (user.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: user.roleId },
        select: { name: true },
      });
      if (role && ADMIN_ROLES.includes(role.name.toLowerCase())) {
        return NextResponse.json({ isAdmin: true, tenantSlug });
      }
    }

    if (user.role && ADMIN_ROLES.includes(user.role.toLowerCase())) {
      return NextResponse.json({ isAdmin: true, tenantSlug });
    }

    return NextResponse.json({ isAdmin: false, tenantSlug });
  } catch {
    return NextResponse.json({ isAdmin: false, tenantSlug: null });
  }
}
