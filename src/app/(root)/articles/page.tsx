import { prisma } from '@/lib/prisma';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { Metadata } from 'next';
import ArticlesHeader from './_components/ArticlesHeader';
import ArticlesGrid from './_components/ArticlesGrid';

export const metadata: Metadata = {
  title: 'Pusat Artikel & Edukasi - SITIVENT',
  description:
    'Temukan artikel teknologi, panduan event, tips & trik, serta tutorial integrasi terbaik dari SITIVENT.',
};

export const revalidate = 0; // Dynamic rendering

export default async function ArticlesPage() {
  // 1. Fetch data from DB
  const articles = await prisma.article.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      articleCategories: true,
    },
  });

  // 2. Map data to article schema
  const mapped = articles.map((item) => {
    const category = item.articleCategories?.[0]?.name || 'Tips & Trik';
    const date = item.createdAt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    // Strip HTML tags for clean card description excerpt
    const plainTextContent = item.content.replace(/<[^>]*>/g, '');
    const description =
      plainTextContent.substring(0, 150) + (plainTextContent.length > 150 ? '...' : '');

    // Calculate read time based on word count (200 words per minute average)
    const wordCount = item.content.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMinutes} menit baca`;

    return {
      id: item.slug || item.id,
      category: category,
      title: item.title,
      description: description,
      readTime: readTime,
      date: date,
      author: 'SITIVENT Team',
      cover: item.cover,
    };
  });

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      <ArticlesHeader />

      {/* Grid Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {mapped.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Artikel Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                Saat ini belum ada artikel edukasi yang ditambahkan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ArticlesGrid initialItems={mapped} />
        )}
      </div>
    </section>
  );
}
