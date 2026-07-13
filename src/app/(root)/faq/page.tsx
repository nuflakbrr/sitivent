'use client';

import type { FC } from 'react';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteMetadata } from '@/data/siteMetadata';
import { useDebounce } from '@/hooks/useDebounce';

interface FAQItem {
  id: string;
  category: 'umum' | 'peserta' | 'penyelenggara' | 'pembayaran';
  question: string;
  answer: string;
}

const CATEGORIES = [
  { id: 'semua', label: 'Semua Pertanyaan' },
  { id: 'umum', label: 'Umum' },
  { id: 'peserta', label: 'Untuk Peserta' },
  { id: 'penyelenggara', label: 'Untuk Penyelenggara' },
  { id: 'pembayaran', label: 'Pembayaran & Tiket' },
] as const;

const FAQ_DATA: FAQItem[] = [
  {
    id: 'apa-itu-sitivent',
    category: 'umum',
    question: 'Apa itu Sitivent?',
    answer:
      'Sitivent adalah platform manajemen dan pencarian event terintegrasi yang memudahkan penyelenggara untuk mempublikasikan, mengelola pendaftaran, dan mendistribusikan tiket event, serta membantu peserta menemukan berbagai event menarik seperti seminar, workshop, webinar, dan kompetisi.',
  },
  {
    id: 'apakah-daftar-gratis',
    category: 'umum',
    question: 'Apakah mendaftar di Sitivent gratis?',
    answer:
      'Ya, pendaftaran akun untuk peserta maupun penyelenggara di Sitivent sepenuhnya gratis tanpa biaya bulanan atau biaya tersembunyi.',
  },
  {
    id: 'bagaimana-cara-beli-tiket',
    category: 'peserta',
    question: 'Bagaimana cara membeli tiket event?',
    answer:
      'Cari event yang Anda inginkan melalui fitur pencarian atau halaman jelajah, klik tombol "Daftar Event" atau "Beli Tiket", pilih kategori tiket, kemudian lakukan pembayaran menggunakan metode pembayaran instan yang tersedia. E-tiket akan otomatis dikirimkan ke email Anda dan muncul di dashboard peserta.',
  },
  {
    id: 'dimana-melihat-tiket',
    category: 'peserta',
    question: 'Di mana saya bisa melihat e-tiket yang sudah dibeli?',
    answer:
      'Semua tiket aktif yang telah Anda beli dapat diakses kapan saja melalui dashboard akun peserta pada menu "Tiket Saya". Anda hanya perlu menunjukkan kode QR pada tiket tersebut kepada panitia di lokasi event untuk verifikasi kehadiran.',
  },
  {
    id: 'cara-buat-event',
    category: 'penyelenggara',
    question: 'Bagaimana cara mempublikasikan event saya sendiri?',
    answer:
      'Setelah mendaftar dan masuk ke akun penyelenggara, buka dashboard admin lalu pilih menu "Manajemen Event" > "Tambah Event". Isi seluruh informasi detail event seperti judul, deskripsi, kategori, tanggal, tipe (online/offline), kuota, dan harga tiket. Tim kami akan melakukan verifikasi singkat sebelum event Anda ditayangkan.',
  },
  {
    id: 'metode-pembayaran-apa-saja',
    category: 'pembayaran',
    question: 'Metode pembayaran apa saja yang didukung oleh Sitivent?',
    answer:
      'Kami mendukung berbagai metode pembayaran instan dan aman, termasuk transfer bank virtual account (VA), e-wallet populer (GoPay, OVO, Dana), QRIS, serta pembayaran melalui gerai retail minimarket.',
  },
  {
    id: 'kebijakan-refund',
    category: 'pembayaran',
    question: 'Apakah tiket yang sudah dibeli bisa dibatalkan atau direfund?',
    answer:
      'Kebijakan pembatalan dan pengembalian uang (refund) tiket sepenuhnya ditentukan oleh masing-masing penyelenggara event. Silakan cek syarat ketentuan khusus pada halaman detail event yang bersangkutan atau hubungi langsung penyelenggara melalui detail kontak yang tertera.',
  },
  {
    id: 'cara-tarik-dana',
    category: 'penyelenggara',
    question: 'Bagaimana proses penarikan dana penjualan tiket bagi penyelenggara?',
    answer:
      'Penyelenggara dapat mengajukan penarikan dana penjualan tiket langsung melalui menu "Keuangan" di dashboard admin setelah event selesai dilaksanakan. Proses verifikasi dan transfer ke rekening bank penyelenggara membutuhkan waktu maksimal 3 hari kerja.',
  },
  {
    id: 'cara-hubungi-support',
    category: 'umum',
    question: 'Bagaimana jika saya mengalami kendala teknis?',
    answer:
      'Tim bantuan pelanggan kami siap membantu Anda. Silakan hubungi kami melalui email indevappfti@gmail.com atau melalui form di halaman Kontak. Kami akan merespons pertanyaan Anda secepat mungkin.',
  },
];

const FAQPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebounce('', 500);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'semua' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [debouncedSearchQuery, selectedCategory]);

  return (
    <div
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Hero Header */}
      <div
        style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-24 px-6 relative overflow-hidden"
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #D97757, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-20 w-[350px] h-[350px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(circle, #788C5D, transparent 70%)' }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <p
            className="text-xs font-bold uppercase tracking-widest"
            style={{
              color: '#D97757',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Bantuan · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Pusat Bantuan &amp; FAQ
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#87867F' }}>
            Temukan jawaban cepat atas pertanyaan umum seputar pembelian tiket, pendaftaran event,
            dan penggunaan platform Sitivent.
          </p>

          {/* Search bar inside hero */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#87867F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDebouncedSearchQuery(e.target.value);
                }}
                placeholder="Cari pertanyaan..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-transparent bg-white/10 text-white placeholder-[#87867F] text-sm outline-none transition-all duration-200 focus:bg-white focus:text-[#141413] focus:border-[#D97757]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-[#E3DACC] pb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border',
                selectedCategory === cat.id
                  ? 'bg-[#D97757] text-white border-transparent shadow-md shadow-[#D97757]/10'
                  : 'bg-white text-[#3D3D3A] border-[#D1CFC5] hover:border-[#D97757] hover:text-[#D97757]'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <details
                key={faq.id}
                id={`faq-${faq.id}`}
                className="group rounded-2xl p-5 transition-all duration-200 [&_summary::-webkit-details-marker]:hidden"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E3DACC',
                }}
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <div className="flex items-center gap-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-[#788C5D] shrink-0" />
                    <h3 className="font-serif text-base md:text-lg font-bold text-[#141413] select-none">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown className="w-5 h-5 text-[#87867F] transition-transform duration-200 group-open:rotate-180 shrink-0" />
                </summary>
                <div className="mt-4 pl-8 border-l-2 border-[#E3DACC]">
                  <p className="text-sm leading-relaxed text-[#3D3D3A]">{faq.answer}</p>
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-[#E3DACC]">
              <p className="text-sm font-semibold text-[#3D3D3A]">
                Tidak ditemukan hasil pencarian yang cocok
              </p>
              <p className="text-xs text-[#87867F] mt-1">
                Silakan ganti kata kunci pencarian Anda atau pilih kategori lain.
              </p>
            </div>
          )}
        </div>

        {/* Bottom CTA Card */}
        <div
          className="rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: '#F0EEE6',
            border: '1.5px solid #E3DACC',
          }}
        >
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[#141413]">
              Masih punya pertanyaan lain?
            </h3>
            <p className="text-xs md:text-sm text-[#3D3D3A]">
              Tim bantuan pelanggan kami siap membantu Anda menyelesaikan kendala teknis maupun
              non-teknis.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white shadow-md transition-all duration-200 active:scale-[0.98] hover:opacity-90"
              style={{
                background: '#D97757',
              }}
            >
              Hubungi Kami
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all duration-200 active:scale-[0.98] hover:bg-[#E3DACC]"
              style={{
                color: '#3D3D3A',
                border: '1.5px solid #D1CFC5',
                background: '#FFFFFF',
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Email Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
