import type { FC, ReactNode } from 'react';
import { redirect, notFound } from 'next/navigation';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Props = {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
};

/**
 * Tenant-scoped layout.
 * Validates that the [tenant] slug exists in DB and
 * the current user has access to it (or is superadmin).
 */
const TenantLayout: FC<Props> = async ({ children, params }) => {
  const { tenant: tenantSlug } = await params;

  // 1. Auth check
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return redirect('/login');

  // 2. Resolve tenant from slug
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) return notFound();

  // 3. Check user access: either has UserTenant record OR is superadmin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: { include: { permissions: { select: { name: true } } } },
      userTenants: { where: { tenantId: tenant.id } },
    },
  });

  if (!user) return redirect('/login');

  const allPermissions = new Set<string>();
  user.roles.forEach((r) => r.permissions.forEach((p) => allPermissions.add(p.name)));

  if (user.roleId) {
    const singleRole = await prisma.role.findUnique({
      where: { id: user.roleId },
      include: { permissions: { select: { name: true } } },
    });
    singleRole?.permissions.forEach((p) => allPermissions.add(p.name));
  }

  const isSuperAdmin = allPermissions.has('admin.access') && user.role === 'superadmin';
  const hasTenantAccess = isSuperAdmin || user.userTenants.length > 0;

  if (!hasTenantAccess) {
    // User authenticated but has no access to this tenant
    return redirect('/admin/dashboard');
  }

  return <>{children}</>;
};

export default TenantLayout;
