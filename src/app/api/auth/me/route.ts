import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_ROLES = ['admin', 'superadmin'];

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ isAdmin: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        roleId: true,
        roles: { select: { name: true } },
      },
    });

    if (!user) return NextResponse.json({ isAdmin: false });

    // Check many-to-many roles
    const hasAdminRole = user.roles.some((r) => ADMIN_ROLES.includes(r.name.toLowerCase()));
    if (hasAdminRole) return NextResponse.json({ isAdmin: true });

    // Check single roleId
    if (user.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: user.roleId },
        select: { name: true },
      });
      if (role && ADMIN_ROLES.includes(role.name.toLowerCase())) {
        return NextResponse.json({ isAdmin: true });
      }
    }

    // Check role string field (better-auth built-in)
    if (user.role && ADMIN_ROLES.includes(user.role.toLowerCase())) {
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch {
    return NextResponse.json({ isAdmin: false });
  }
}
