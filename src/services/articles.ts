'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { verifyPermission } from './security';
import type {
  Article,
  ArticleCategory,
  ArticleResponse,
  ArticlePaginationResponse,
  ArticleCategoryResponse,
} from '@/interfaces/features/articles';
import { articleSchema } from '@/schemas/articles';
import type { ArticleValues } from '@/schemas/articles';

const BASE_PATH = '/admin/publications/articles';

/**
 * Mengambil data artikel dengan pagination dan pencarian
 */
export async function getArticles(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<ArticlePaginationResponse> {
  const hasAccess = await verifyPermission('articles.read');
  if (!hasAccess) {
    return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 0 } };
  }

  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        articleCategories: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return {
    success: true,
    data: articles as Article[],
    meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
  };
}

/**
 * Mengambil artikel berdasarkan ID
 */
export async function getArticleById(id: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('articles.read');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      articleCategories: true,
    },
  });

  if (!article) return { success: false, error: 'Artikel tidak ditemukan.' };
  return { success: true, data: article as Article };
}

/**
 * Membuat artikel baru
 */
export async function createArticle(values: ArticleValues): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.create');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
  }

  // Cari ID kategori dari nama kategori yang dikirim
  const categoryConnect: { id: string }[] = [];
  if (values.categories && values.categories.length > 0) {
    for (const cat of values.categories) {
      const dbCat = await prisma.articleCategory.findFirst({
        where: { name: cat.name },
      });
      if (dbCat) {
        categoryConnect.push({ id: dbCat.id });
      }
    }
  }

  const article = await prisma.article.create({
    data: {
      title: values.title,
      content: values.content,
      cover: values.cover || null,
      createdById: session.user.id,
      articleCategories: {
        connect: categoryConnect,
      },
    },
  });

  revalidatePath(BASE_PATH);
  return { success: true, data: article as Article, message: 'Artikel berhasil diterbitkan.' };
}

/**
 * Memperbarui artikel berdasarkan ID
 */
export async function updateArticleById(
  id: string,
  values: ArticleValues
): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const exists = await prisma.article.findUnique({ where: { id } });
  if (!exists) return { success: false, error: 'Artikel tidak ditemukan.' };

  // Cari ID kategori dari nama kategori yang dikirim
  const categoryConnect: { id: string }[] = [];
  if (values.categories && values.categories.length > 0) {
    for (const cat of values.categories) {
      const dbCat = await prisma.articleCategory.findFirst({
        where: { name: cat.name },
      });
      if (dbCat) {
        categoryConnect.push({ id: dbCat.id });
      }
    }
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: values.title,
      content: values.content,
      cover: values.cover || null,
      articleCategories: {
        set: [],
        connect: categoryConnect,
      },
    },
  });

  revalidatePath(BASE_PATH);
  return { success: true, data: article as Article, message: 'Artikel berhasil diperbarui.' };
}

/**
 * Menghapus artikel berdasarkan ID
 */
export async function deleteArticleById(id: string): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.delete');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const exists = await prisma.article.findUnique({ where: { id } });
  if (!exists) return { success: false, error: 'Artikel tidak ditemukan.' };

  await prisma.article.delete({ where: { id } });

  revalidatePath(BASE_PATH);
  return { success: true, message: 'Artikel berhasil dihapus.' };
}

/**
 * Menghapus banyak artikel sekaligus (Bulk Delete)
 */
export async function deleteBulkArticles(ids: string[]): Promise<ArticleResponse> {
  const hasAccess = await verifyPermission('article.delete');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  await prisma.article.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  revalidatePath(BASE_PATH);
  return { success: true, message: `${ids.length} artikel berhasil dihapus.` };
}

/**
 * Kategori Artikel: Mengambil semua kategori artikel
 */
export async function getCategories() {
  const hasAccess = await verifyPermission('article.category.read');
  if (!hasAccess) {
    return { success: false, data: [] };
  }

  const categories = await prisma.articleCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  });

  return { success: true, data: categories as ArticleCategory[] };
}

/**
 * Kategori Artikel: Membuat kategori artikel baru
 */
export async function createCategory(name: string): Promise<ArticleCategoryResponse> {
  const hasAccess = await verifyPermission('article.category.create');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const exists = await prisma.articleCategory.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });
  if (exists) return { success: false, error: 'Kategori dengan nama ini sudah ada.' };

  const category = await prisma.articleCategory.create({
    data: { name },
  });

  revalidatePath(BASE_PATH);
  return { success: true, data: category as ArticleCategory, message: 'Kategori berhasil dibuat.' };
}

/**
 * Kategori Artikel: Memperbarui kategori artikel
 */
export async function updateCategory(id: string, name: string): Promise<ArticleCategoryResponse> {
  const hasAccess = await verifyPermission('article.category.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const conflict = await prisma.articleCategory.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      NOT: { id },
    },
  });
  if (conflict) return { success: false, error: 'Kategori dengan nama ini sudah ada.' };

  const category = await prisma.articleCategory.update({
    where: { id },
    data: { name },
  });

  revalidatePath(BASE_PATH);
  return {
    success: true,
    data: category as ArticleCategory,
    message: 'Kategori berhasil diperbarui.',
  };
}

/**
 * Kategori Artikel: Menghapus kategori artikel
 */
export async function deleteCategory(id: string): Promise<ArticleCategoryResponse> {
  const hasAccess = await verifyPermission('article.category.delete');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const category = await prisma.articleCategory.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  });

  if (!category) return { success: false, error: 'Kategori tidak ditemukan.' };
  if ((category._count?.articles ?? 0) > 0) {
    return { success: false, error: 'Kategori masih memiliki artikel.' };
  }

  await prisma.articleCategory.delete({ where: { id } });
  revalidatePath(BASE_PATH);
  return { success: true, message: 'Kategori berhasil dihapus.' };
}
