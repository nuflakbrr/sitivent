'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { slugify } from '@/lib/slugify';
import type {
  Tenant,
  TenantPaginationResponse,
  TenantResponse,
} from '@/interfaces/features/tenants';
import { tenantSchema, type TenantValues } from '@/schemas/tenants';

const BASE_PATH = '/admin/master/tenants';

export async function getTenants(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<TenantPaginationResponse> {
  const hasAccess = await verifyPermission('tenants.read');
  if (!hasAccess) return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 0 } };

  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.tenant.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.tenant.count({ where }),
  ]);

  return {
    success: true,
    data: data as Tenant[],
    meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
  };
}

export async function getTenantById(id: string): Promise<TenantResponse> {
  const hasAccess = await verifyPermission('tenants.read');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) return { success: false, error: 'Tenant tidak ditemukan.' };
  return { success: true, data: tenant as Tenant };
}

export async function createTenant(values: TenantValues): Promise<TenantResponse> {
  const hasAccess = await verifyPermission('tenants.create');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const parsed = tenantSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input tidak valid.' };

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const exists = await prisma.tenant.findUnique({ where: { slug } });
  if (exists) return { success: false, error: 'Slug sudah digunakan.' };

  const tenant = await prisma.tenant.create({
    data: { name: parsed.data.name, slug, description: parsed.data.description || null },
  });

  revalidatePath(BASE_PATH);
  return { success: true, data: tenant as Tenant, message: 'Tenant berhasil dibuat.' };
}

export async function updateTenant(id: string, values: TenantValues): Promise<TenantResponse> {
  const hasAccess = await verifyPermission('tenants.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const parsed = tenantSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Input tidak valid.' };

  const existing = await prisma.tenant.findUnique({ where: { id } });
  if (!existing) return { success: false, error: 'Tenant tidak ditemukan.' };

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const conflict = await prisma.tenant.findFirst({ where: { slug, id: { not: id } } });
  if (conflict) return { success: false, error: 'Slug sudah digunakan.' };

  const tenant = await prisma.tenant.update({
    where: { id },
    data: { name: parsed.data.name, slug, description: parsed.data.description || null },
  });

  revalidatePath(BASE_PATH);
  revalidatePath(`${BASE_PATH}/${id}`);
  return { success: true, data: tenant as Tenant, message: 'Tenant berhasil diperbarui.' };
}

export async function deleteTenant(id: string): Promise<TenantResponse> {
  const hasAccess = await verifyPermission('tenants.delete');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) return { success: false, error: 'Tenant tidak ditemukan.' };

  await prisma.tenant.delete({ where: { id } });
  revalidatePath(BASE_PATH);
  return { success: true, message: 'Tenant berhasil dihapus.' };
}
