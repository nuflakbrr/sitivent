'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, CalendarDays, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import type { EventSearchResult, EventSearchResponse } from '@/interfaces/features/events';
import { cn } from '@/lib/utils';
import { EventType } from '@/generated/prisma/enums';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  scrolled: boolean;
}

const EVENT_TYPE_LABEL: Record<EventType, string> = {
  [EventType.ONLINE]: 'Online',
  [EventType.OFFLINE]: 'Offline',
};

export const EventSearch: React.FC<Props> = ({ scrolled }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useDebounce('', 500);
  const [results, setResults] = useState<EventSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isMac, setIsMac] = useState(false);

  // Fetch search results
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/events/search?q=${encodeURIComponent(debouncedQuery)}&limit=6`)
      .then((r) => r.json() as Promise<EventSearchResponse>)
      .then((res) => {
        setResults(res.data);
        setActiveIndex(-1);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Global shortcut and Mac check
  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes('mac'));

    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery('');
    setDebouncedQuery('');
    setResults([]);
    setActiveIndex(-1);
  }, [setDebouncedQuery]);

  const navigateTo = useCallback(
    (slug: string) => {
      router.push(`/events/${slug}`);
      closeSearch();
    },
    [closeSearch, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateTo(results[activeIndex].slug);
      } else if (query.trim().length >= 2) {
        router.push(`/events?q=${encodeURIComponent(query)}`);
        closeSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      {/* Search Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Cari event"
        className={cn(
          'flex items-center justify-between gap-2 px-3 py-1.5 rounded-full transition-all duration-200 border w-56',
          scrolled
            ? 'text-[#3D3D3A] border-[#D1CFC5] hover:bg-[#F0EEE6] hover:text-[#141413]'
            : 'text-white/80 border-white/20 hover:bg-white/10 hover:text-white'
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span className="text-xs font-medium">Cari</span>
        </div>
        <kbd
          suppressHydrationWarning
          className="hidden sm:inline-block text-[10px] font-mono opacity-60 ml-1"
        >
          {isMac ? '⌘' : 'Ctrl'} + K
        </kbd>
      </button>

      {/* Modal Dialog using ui/dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="p-0 border-[#D1CFC5] bg-[#FAF9F5] max-w-2xl overflow-hidden rounded-3xl gap-0 shadow-2xl"
        >
          {/* Top search bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E3DACC]">
            <Search className="w-5 h-5 text-[#87867F] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setDebouncedQuery(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ketik judul event yang ingin Anda cari..."
              className="flex-1 text-base text-[#141413] placeholder:text-[#87867F] outline-none bg-transparent"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="p-1 rounded-lg hover:bg-[#F0EEE6] text-[#87867F] hover:text-[#141413] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results / Empty area */}
          <div className="overflow-y-auto min-h-[200px] max-h-[50vh] p-2">
            {loading && (
              <div className="py-12 text-center text-sm font-mono text-[#87867F]">
                Mencari event terbaik untuk Anda...
              </div>
            )}

            {!loading && query.length < 2 && (
              <div className="px-4 py-8">
                <p className="text-xs font-mono uppercase tracking-wider text-[#87867F] mb-3">
                  Pencarian Populer
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Seminar', 'Workshop', 'Webinar', 'Bootcamp'].map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => {
                        setQuery(keyword);
                        setDebouncedQuery(keyword);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D1CFC5] text-xs font-medium text-[#3D3D3A] bg-white hover:border-[#D97757] hover:text-[#D97757] transition-all"
                    >
                      {keyword}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-[#3D3D3A] font-medium">
                  Tidak menemukan event yang cocok
                </p>
                <p className="text-xs text-[#87867F] mt-1">
                  Coba ganti kata kunci atau cek ejaan Anda
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <ul className="space-y-1" role="listbox">
                {results.map((event, i) => (
                  <li key={event.id} role="option" aria-selected={activeIndex === i}>
                    <button
                      type="button"
                      onClick={() => navigateTo(event.slug)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        'w-full flex items-center gap-4 p-3 rounded-2xl text-left transition-all',
                        activeIndex === i ? 'bg-[#F0EEE6]' : 'hover:bg-[#FAF9F5]'
                      )}
                    >
                      {/* Thumbnail banner */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#E3DACC] shrink-0 relative">
                        {event.banner ? (
                          <Image
                            src={event.banner}
                            alt={event.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D97757]">
                            <CalendarDays className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Title & Metadata info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-[#141413] leading-snug line-clamp-1">
                            {event.title}
                          </h4>
                          <span
                            className="text-[10px] font-mono px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              background:
                                event.eventType === EventType.ONLINE ? '#E8F0E2' : '#F5E8E3',
                              color: event.eventType === EventType.ONLINE ? '#788C5D' : '#D97757',
                            }}
                          >
                            {EVENT_TYPE_LABEL[event.eventType]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-[#87867F]">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom info banner */}
          {!loading && results.length > 0 && (
            <div className="px-5 py-3 border-t border-[#E3DACC] bg-[#FAF9F5] flex justify-between items-center text-xs">
              <span className="font-mono text-[#87867F]">
                Menampilkan {results.length} hasil teratas
              </span>
              <button
                type="button"
                onClick={() => {
                  router.push(`/events?q=${encodeURIComponent(query)}`);
                  closeSearch();
                }}
                className="font-semibold text-[#D97757] hover:underline"
              >
                Lihat semua hasil pencarian →
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
