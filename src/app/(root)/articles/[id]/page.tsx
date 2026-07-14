import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleDetailClient from './_components/ArticleDetail';

interface Props {
  params: Promise<{ id: string }>;
}

const isUUID = (str: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  if (id === 'zoom-integration' || id === 'webhook-security') {
    const title =
      id === 'zoom-integration'
        ? 'Panduan Integrasi Zoom dan Event Online'
        : 'Keamanan Webhook & Sinkronisasi Pembayaran';
    return {
      title: `${title} - SITIVENT`,
      description: 'Panduan teknis dan edukasi untuk platform SITIVENT.',
    };
  }

  const article = await prisma.article.findFirst({
    where: isUUID(id) ? { id } : { slug: id },
  });

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - SITIVENT',
    };
  }

  // Strip HTML tags for clean description excerpt
  const plainText = article.content.replace(/<[^>]*>/g, '');
  return {
    title: `${article.title} - SITIVENT`,
    description: plainText.substring(0, 150),
  };
}

export const revalidate = 0; // Dynamic rendering

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  let article = null;
  const isStatic = id === 'zoom-integration' || id === 'webhook-security';

  if (!isStatic) {
    article = await prisma.article.findFirst({
      where: isUUID(id) ? { id } : { slug: id },
      include: {
        articleCategories: true,
      },
    });

    if (!article) {
      notFound();
    }
  }

  let mapped = null;
  if (article) {
    const wordCount = article.content.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMinutes} menit baca`;

    mapped = {
      id: article.id,
      category: article.articleCategories?.[0]?.name || 'Tips & Trik',
      title: article.title,
      content: article.content,
      cover: article.cover,
      date: article.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      readTime: readTime,
      author: 'SITIVENT Team',
      isDb: true,
    };
  }

  return <ArticleDetailClient initialArticle={mapped} staticId={id} />;
}
