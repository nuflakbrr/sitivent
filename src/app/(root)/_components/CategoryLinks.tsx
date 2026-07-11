'use client';
import Link from 'next/link';
import type { Route } from 'next';
import type { FC } from 'react';
import { Mic2, Laptop, MonitorPlay, Code2, MessageSquare } from 'lucide-react';

const categories = [
  {
    label: 'Seminar',
    icon: Mic2,
    href: '/events' as Route,
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100',
  },
  {
    label: 'Workshop',
    icon: Laptop,
    href: '/events' as Route,
    color: 'text-violet-600 bg-violet-50 border-violet-100 hover:bg-violet-100',
  },
  {
    label: 'Webinar',
    icon: MonitorPlay,
    href: '/events' as Route,
    color: 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100',
  },
  {
    label: 'Bootcamp',
    icon: Code2,
    href: '/events' as Route,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100',
  },
  {
    label: 'Talk Show',
    icon: MessageSquare,
    href: '/events' as Route,
    color: 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100',
  },
];

const CategoryLinks: FC = () => {
  return (
    <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[60px] z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-all duration-200 ${cat.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </Link>
            );
          })}
          <Link
            href="/events"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-semibold whitespace-nowrap transition-all duration-200 ml-1"
          >
            Lihat Semua →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryLinks;
