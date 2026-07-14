'use client';

import { useState, useMemo, type FC } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';

import { useDebounce } from '@/hooks/useDebounce';
import type { ArticleItem } from '@/interfaces/features/articles';

interface ArticlesGridProps {
  initialItems: ArticleItem[];
}

export const ArticlesGrid: FC<ArticlesGridProps> = ({ initialItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useDebounce('', 500);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categoriesList = useMemo(() => {
    const list = new Set<string>(['All']);
    initialItems.forEach((item) => {
      if (item.category) list.add(item.category);
    });
    return Array.from(list);
  }, [initialItems]);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [initialItems, debouncedSearchTerm, categoryFilter]);

  return (
    <div className="space-y-10">
      {/* Controls: Search + Categories */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 border-b border-[#E3DACC]">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#D97757] text-[#FAF9F5] border-[#D97757]'
                  : 'bg-white text-[#87867F] border-[#E3DACC] hover:border-[#141413] hover:text-[#141413]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-[#87867F]" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDebouncedSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-xs bg-white focus:outline-none focus:border-[#141413] transition-colors"
            style={{ borderColor: '#E3DACC' }}
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((article) => (
          <article
            key={article.id}
            className="group flex p-0 flex-col justify-between border shadow-xs hover:shadow-lg hover:border-[#D97757] transition-all duration-500 rounded-3xl overflow-hidden h-[420px]"
            style={{ borderColor: '#E3DACC', background: '#FFFFFF' }}
          >
            <div className="space-y-4">
              {/* Cover Image Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                {article.cover ? (
                  <img
                    src={article.cover}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-4 bg-muted/40"
                    style={{
                      background: 'linear-gradient(135deg, #F0EEE6 0%, #E3DACC 100%)',
                    }}
                  >
                    <BookOpen className="h-8 w-8 opacity-20 text-[#141413]" />
                  </div>
                )}
                {/* Category tag inside image */}
                <span
                  className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-xs"
                  style={{
                    background: 'rgba(217,119,87,0.12)',
                    borderColor: 'rgba(217,119,87,0.3)',
                    color: '#D97757',
                  }}
                >
                  {article.category}
                </span>
              </div>

              {/* Info details */}
              <div className="px-6 pt-1 space-y-3">
                <div className="flex items-center gap-3 text-[10px] text-[#87867F] font-mono">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg md:text-xl leading-snug transition-colors line-clamp-1">
                  <Link
                    href={`/articles/${article.id}`}
                    className="hover:text-[#D97757] transition-colors duration-300"
                  >
                    {article.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#3D3D3A] leading-relaxed line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>

            {/* Action link */}
            <div className="px-6 pb-6 space-y-5">
              <div className="pt-4 border-t border-[#F0EEE6]">
                <Link
                  href={`/articles/${article.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97757] hover:text-[#141413] transition-colors group/link"
                >
                  Baca Selengkapnya
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-[#87867F] italic">
          Belum ada artikel yang dipublikasikan dalam kategori ini.
        </div>
      )}
    </div>
  );
};

export default ArticlesGrid;
