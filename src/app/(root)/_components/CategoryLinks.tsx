'use client';
import Link from 'next/link';
import type { Route } from 'next';
import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tag, Mic2, Laptop, MonitorPlay, Code2, MessageSquare } from 'lucide-react';
import type { EventCategory } from '@/interfaces/features/event-categories';
import { cn } from '@/lib/utils';

// Helper to map dynamic categories to premium color themes and icons
const getCategoryConfig = (slug: string) => {
  const norm = slug.toLowerCase();
  if (norm.includes('seminar')) {
    return {
      icon: Mic2,
      color:
        'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100/80 active:bg-indigo-200/50',
    };
  }
  if (norm.includes('workshop')) {
    return {
      icon: Laptop,
      color:
        'text-violet-600 bg-violet-50 border-violet-100 hover:bg-violet-100/80 active:bg-violet-200/50',
    };
  }
  if (norm.includes('webinar')) {
    return {
      icon: MonitorPlay,
      color: 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100/80 active:bg-sky-200/50',
    };
  }
  if (norm.includes('bootcamp')) {
    return {
      icon: Code2,
      color:
        'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100/80 active:bg-emerald-200/50',
    };
  }
  if (norm.includes('talk') || norm.includes('show') || norm.includes('wicara')) {
    return {
      icon: MessageSquare,
      color:
        'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/80 active:bg-amber-200/50',
    };
  }
  return {
    icon: Tag,
    color:
      'text-slate-600 bg-slate-50 border-slate-100 hover:bg-slate-100/80 active:bg-slate-200/50',
  };
};

interface CategoryLinksProps {
  categories: EventCategory[];
}

const CategoryLinks: FC<CategoryLinksProps> = ({ categories }) => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[60px] z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {/* "Semua" filter button */}
          <Link
            href="/events"
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-all duration-200',
              !activeCategory
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
            )}
          >
            Semua Event
          </Link>

          {categories.map((cat) => {
            const config = getCategoryConfig(cat.slug);
            const Icon = config.icon;
            const isActive = activeCategory === cat.slug;

            return (
              <Link
                key={cat.id}
                href={`/events?category=${cat.slug}` as Route}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-all duration-200',
                  isActive ? 'bg-indigo-600 border-indigo-600 text-white' : config.color
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryLinks;
