'use client';
import Link from 'next/link';
import type { Route } from 'next';
import type { FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tag, Mic2, Laptop, MonitorPlay, Code2, MessageSquare } from 'lucide-react';
import type { EventCategory } from '@/interfaces/features/event-categories';
import { cn } from '@/lib/utils';

// Helper to map dynamic categories to warm palette icon themes
const getCategoryConfig = (slug: string) => {
  const norm = slug.toLowerCase();
  if (norm.includes('seminar')) {
    return { icon: Mic2, accent: '#D97757' }; // clay
  }
  if (norm.includes('workshop')) {
    return { icon: Laptop, accent: '#788C5D' }; // olive
  }
  if (norm.includes('webinar')) {
    return { icon: MonitorPlay, accent: '#3D3D3A' }; // gray-700
  }
  if (norm.includes('bootcamp')) {
    return { icon: Code2, accent: '#B04A3F' }; // rust
  }
  if (norm.includes('talk') || norm.includes('show') || norm.includes('wicara')) {
    return { icon: MessageSquare, accent: '#87867F' }; // gray-500
  }
  return { icon: Tag, accent: '#3D3D3A' };
};

interface CategoryLinksProps {
  categories: EventCategory[];
}

const CategoryLinks: FC<CategoryLinksProps> = ({ categories }) => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div
      className="sticky z-30"
      style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid #E3DACC',
        boxShadow: '0 2px 8px rgba(20,20,19,0.04)',
        top: '60px',
      }}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {/* "Semua" filter button */}
          <Link
            href="/events"
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200'
            )}
            style={
              !activeCategory
                ? {
                    background: '#141413',
                    color: '#FAF9F5',
                    border: '1.5px solid #141413',
                  }
                : {
                    background: 'transparent',
                    color: '#3D3D3A',
                    border: '1.5px solid #D1CFC5',
                  }
            }
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
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200"
                style={
                  isActive
                    ? {
                        background: config.accent,
                        color: '#FFFFFF',
                        border: `1.5px solid ${config.accent}`,
                      }
                    : {
                        background: 'transparent',
                        color: '#3D3D3A',
                        border: '1.5px solid #D1CFC5',
                      }
                }
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
