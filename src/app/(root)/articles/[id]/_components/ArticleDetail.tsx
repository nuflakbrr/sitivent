'use client';

import { useState, useMemo, type FC } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Video,
  Copy,
  Check,
  ChevronRight,
  Info,
  BookOpen,
  Calendar,
  User,
} from 'lucide-react';

import type { ArticleDetail } from '@/interfaces/features/articles';

const STATIC_ARTICLES_DETAILS: Record<string, ArticleDetail> = {
  'zoom-integration': {
    id: 'zoom-integration',
    category: 'Tutorial',
    title: 'Panduan Integrasi Zoom dan Event Online',
    readTime: '6 menit baca',
    date: '14 Juli 2026',
    author: 'SITIVENT Dev Team',
    tldr: 'Event online yang dibuat di dashboard admin kini otomatis memiliki tautan Zoom / meeting. Tautan ini dikirimkan via email setelah registrasi/pembayaran berhasil, dan dapat diakses langsung oleh peserta melalui dashboard mereka.',
    steps: [
      {
        title: 'Buat Event Baru dengan Tipe ONLINE',
        location: 'admin/master/events/new',
        body: 'Di dashboard admin, pilih tipe event ONLINE. Sebuah field baru "Link Zoom / Meeting" akan muncul secara dinamis. Masukkan URL meeting yang valid (misalnya https://zoom.us/j/...) dan lengkapi kuota serta batas akhir pendaftaran.',
      },
      {
        title: 'Verifikasi & Transaksi Pembayaran',
        location: 'admin/transactions/payments',
        body: 'Jika event berbayar, peserta harus melakukan pembayaran terlebih dahulu. Setelah admin menyetujui transaksi, status pendaftaran berubah menjadi REGISTERED dan QR code unik di-generate otomatis.',
      },
      {
        title: 'Distribusi Email Otomatis',
        location: 'services/emails.ts',
        body: 'Sistem email queue akan mengambil antrean email konfirmasi. Jika tipe event adalah ONLINE, email secara otomatis menyertakan link Zoom meeting yang dapat langsung diklik oleh peserta.',
      },
      {
        title: 'Akses Instan via Dashboard Peserta',
        location: 'participant/dashboard',
        body: 'Peserta dapat masuk ke dashboard mereka kapan saja. Kartu event terdekat (Upcoming Event) akan menampilkan tombol "Gabung Link Zoom" berwarna hijau yang mengarah langsung ke ruang meeting.',
      },
    ],
    tabs: [
      {
        label: 'Prisma Schema',
        code: [
          'model Event {',
          '  id          String    @id @default(cuid())',
          '  title       String',
          '  location    String',
          '  meetingLink String?   @map("meeting_link")',
          '  eventType   EventType @map("event_type")',
          '  // ...',
          '}',
        ].join('\n'),
      },
      {
        label: 'Email Queueing Service',
        code: [
          '// Send registration email',
          "const isOnline = event.eventType === 'ONLINE';",
          'const meetingInfo = isOnline && event.meetingLink',
          '  ? `<p>Link Meeting (Zoom): <a href="` + event.meetingLink + `">` + event.meetingLink + `</a></p>`',
          "  : '<p>Sampai jumpa di lokasi event!</p>';",
          '',
          'const emailBody = `',
          '  <h2>Registrasi Berhasil!</h2>',
          '  <p>Anda terdaftar pada event <strong>` + event.title + `</strong>.</p>`',
          '  + meetingInfo;',
        ].join('\n'),
      },
      {
        label: 'Upcoming Event Card UI',
        code: [
          '{upcomingEvent.meetingLink && (',
          '  <div className="flex items-center gap-2">',
          '    <Video className="w-4 h-4 text-[#788C5D]" />',
          '    <a href={upcomingEvent.meetingLink} target="_blank" className="underline font-semibold text-[#788C5D]">',
          '      Gabung Link Zoom',
          '    </a>',
          '  </div>',
          ')}',
        ].join('\n'),
      },
    ],
    faqs: [
      {
        q: 'Apakah link Zoom aman dari akses ilegal?',
        a: 'Ya, link Zoom hanya dikirimkan ke email terdaftar yang sudah terverifikasi (dan sudah lunas jika berbayar), serta hanya muncul di dashboard akun milik peserta yang bersangkutan.',
      },
      {
        q: 'Apakah saya bisa mengubah link Zoom setelah event dipublikasikan?',
        a: 'Bisa. Perubahan link Zoom melalui formulir edit event akan memperbarui data secara real-time di dashboard peserta, namun email yang sudah terkirim tidak dapat ditarik kembali.',
      },
    ],
    jargon: {
      'ONLINE event':
        'Tipe event di mana pelaksanaan acara menggunakan platform video conference seperti Zoom, Google Meet, dll.',
      'Email queue':
        'Antrean proses pengiriman email di server agar tidak membebani performa aplikasi utama.',
      SITIVENT:
        'Platform manajemen event terintegrasi untuk pendaftaran, pembayaran, absensi QR, dan sertifikat.',
    },
    flowchart: [
      {
        label: 'Buat Event Online',
        type: 'step',
        detail: 'Admin menginput detail event beserta link meeting Zoom ke sistem.',
      },
      {
        label: 'Peserta Mendaftar',
        type: 'step',
        detail: 'Peserta memilih event dan menyelesaikan formulir pendaftaran.',
      },
      {
        label: 'Apakah Berbayar?',
        type: 'decision',
        detail: 'Menentukan jalur verifikasi berdasarkan harga tiket.',
      },
      {
        label: 'Verifikasi Pembayaran',
        type: 'step',
        detail: 'Admin memverifikasi bukti transfer pembayaran dari peserta.',
      },
      {
        label: 'Kirim Email & Dashboard Link',
        type: 'step',
        detail:
          'Sistem mengirimkan email berisi link Zoom dan mengaktifkan tombol gabung di dashboard.',
      },
    ],
  },
  'webhook-security': {
    id: 'webhook-security',
    category: 'Security',
    title: 'Keamanan Webhook & Sinkronisasi Pembayaran',
    readTime: '8 menit baca',
    date: '10 Juli 2026',
    author: 'Security Specialist',
    tldr: 'Setiap notifikasi pembayaran (webhook) wajib divalidasi tanda tangannya (Signature Verification) menggunakan HMAC-SHA256 sebelum sistem memperbarui status transaksi peserta menjadi PAID.',
    steps: [
      {
        title: 'Menerima Payload Webhook',
        location: 'api/webhooks/payment',
        body: 'Ketika status transaksi berubah di payment gateway, mereka mengirimkan POST request berisi data transaksi dan payload tanda tangan digital di header.',
      },
      {
        title: 'Validasi Tanda Tangan (Signature Verification)',
        location: 'lib/security.ts',
        body: 'Sistem SITIVENT mengambil raw body request dan menghitung hash HMAC menggunakan client secret key rahasia yang terdaftar di sistem.',
      },
      {
        title: 'Pencocokan Token',
        location: 'lib/security.ts',
        body: 'Hash yang dihitung dicocokkan dengan header signature. Jika tidak cocok, request ditolak dengan status 401 Unauthorized.',
      },
      {
        title: 'Pembaruan Database Transaksi',
        location: 'services/payments.ts',
        body: 'Jika valid, status registrasi diubah ke REGISTERED secara transaksional, lalu QR ticket di-generate dan antrean email berjalan.',
      },
    ],
    tabs: [
      {
        label: 'Webhook Router',
        code: [
          'export async function POST(req: Request) {',
          '  const body = await req.text();',
          "  const signature = req.headers.get('x-payment-signature');",
          '  ',
          '  const isValid = verifySignature(body, signature, process.env.PAYMENT_SECRET);',
          '  if (!isValid) {',
          "    return new Response('Invalid signature', { status: 401 });",
          '  }',
          '  ',
          '  const event = JSON.parse(body);',
          '  await handlePaymentEvent(event);',
          "  return new Response('Success');",
          '}',
        ].join('\n'),
      },
      {
        label: 'HMAC Verification',
        code: [
          "import crypto from 'crypto';",
          '',
          'export function verifySignature(body: string, sig: string | null, secret: string) {',
          '  if (!sig) return false;',
          '  const hash = crypto',
          "    .createHmac('sha256', secret)",
          '    .update(body)',
          "    .digest('hex');",
          '  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(sig));',
          '}',
        ].join('\n'),
      },
    ],
    faqs: [
      {
        q: 'Kenapa kita tidak langsung membaca JSON payload saja?',
        a: 'Jika tidak divalidasi tanda tangannya, pihak ketiga yang mengetahui endpoint webhook Anda bisa mengirim request palsu seolah-olah mereka sudah membayar lunas.',
      },
      {
        q: 'Apa itu timingSafeEqual?',
        a: 'Fungsi pembanding string konstan waktu untuk mencegah timing attack, di mana penyerang menebak data rahasia dengan mengukur waktu pemrosesan server.',
      },
    ],
    jargon: {
      Webhook:
        'Mekanisme mengirimkan notifikasi dari satu server ke server lain secara real-time saat terjadi suatu event.',
      'HMAC-SHA256':
        'Algoritma hashing menggunakan kunci kriptografis rahasia untuk memverifikasi keaslian pesan.',
      'Timing Attack':
        'Serangan kriptografi di mana penyerang menebak data rahasia dengan mengukur waktu pemrosesan server.',
    },
    flowchart: [
      {
        label: 'Notifikasi Webhook Masuk',
        type: 'step',
        detail: 'Payment gateway memicu request ke endpoint webhook SITIVENT.',
      },
      {
        label: 'Apakah Tanda Tangan Valid?',
        type: 'decision',
        detail: 'Melakukan pencocokan signature hash HMAC-SHA256.',
      },
      {
        label: 'Tolak Request (401)',
        type: 'step',
        detail: 'Request dianggap mencurigakan, log error dicatat untuk audit.',
      },
      {
        label: 'Proses Transaksi & Update DB',
        type: 'step',
        detail: 'Payload terpercaya, ubah status pembayaran dan generate e-ticket.',
      },
    ],
  },
};

interface ArticleDetailClientProps {
  initialArticle: ArticleDetail | null;
  staticId?: string;
}

export const ArticleDetailClient: FC<ArticleDetailClientProps> = ({ initialArticle, staticId }) => {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null);
  const [hoveredTermDef, setHoveredTermDef] = useState<string>('');

  const currentArticle = useMemo<ArticleDetail>(() => {
    if (initialArticle) return initialArticle;
    if (staticId && STATIC_ARTICLES_DETAILS[staticId]) {
      return STATIC_ARTICLES_DETAILS[staticId];
    }
    return {
      id: 'not-found',
      category: 'Tips & Trik',
      title: 'Artikel Tidak Ditemukan',
      readTime: '0 menit',
      date: '',
      author: '',
      content: 'Detail artikel tidak dapat dimuat.',
    };
  }, [initialArticle, staticId]);

  const wordCount = useMemo(() => {
    if (currentArticle.content) {
      return currentArticle.content.split(/\s+/).filter(Boolean).length;
    }
    let count = 0;
    if (currentArticle.tldr) count += currentArticle.tldr.split(/\s+/).filter(Boolean).length;
    if (currentArticle.steps) {
      currentArticle.steps.forEach((s) => {
        count += s.title.split(/\s+/).filter(Boolean).length;
        count += s.body.split(/\s+/).filter(Boolean).length;
      });
    }
    return count;
  }, [currentArticle]);

  const readTimeMinutes = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  const tocItems = useMemo(() => {
    const items = [];
    if (currentArticle.tldr) {
      items.push({ id: 'ringkasan', label: 'Ringkasan Cepat' });
    }
    if (currentArticle.isDb) {
      items.push({ id: 'konten-utama', label: 'Konten Utama' });
    } else {
      if (currentArticle.flowchart) {
        items.push({ id: 'alur-proses', label: 'Alur Proses' });
      }
      if (currentArticle.steps) {
        items.push({ id: 'langkah-langkah', label: 'Langkah Demi Langkah' });
      }
      if (currentArticle.tabs) {
        items.push({ id: 'implementasi-kode', label: 'Implementasi Kode' });
      }
      if (currentArticle.faqs) {
        items.push({ id: 'faq', label: 'Tanya Jawab (FAQ)' });
      }
    }
    return items;
  }, [currentArticle]);

  const handleCopyMarkdown = () => {
    if (!currentArticle) return;
    let md = '';
    if (currentArticle.isDb && currentArticle.content) {
      md = `# ${currentArticle.title}\n\n${currentArticle.content}\n\n*Sumber: SITIVENT Publications*`;
    } else if (currentArticle.steps) {
      const stepsMarkdown = currentArticle.steps
        .map((s, idx) => `${idx + 1}. **${s.title}** (${s.location})\n   ${s.body}`)
        .join('\n\n');
      md = `# ${currentArticle.title}\n\n**TL;DR:** ${currentArticle.tldr}\n\n## Langkah-Langkah:\n\n${stepsMarkdown}\n\n*Sumber: SITIVENT Publications*`;
    }

    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const showTermDefinition = (term: string, definition: string) => {
    setHoveredTerm(term);
    setHoveredTermDef(definition);
  };

  const clearTermDefinition = () => {
    setHoveredTerm(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans antialiased">
      {/* Custom Styles Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glossary-term {
          border-bottom: 1px dashed #D97757;
          cursor: help;
          position: relative;
        }
        .glossary-popover {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: #141413;
          color: #FAF9F5;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          width: 220px;
          z-index: 50;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          pointer-events: none;
        }
        .glossary-popover::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: #141413;
        }
      `,
        }}
      />

      {/* Premium Dark Editorial Header */}
      <div
        style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-20 md:py-24 px-6"
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#87867F] hover:text-[#FAF9F5] transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Artikel
          </Link>

          <div className="space-y-3">
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border inline-block"
              style={{
                borderColor: 'rgba(217,119,87,0.3)',
                background: 'rgba(217,119,87,0.12)',
                color: '#D97757',
              }}
            >
              {currentArticle.category}
            </span>
            <h1
              className="font-serif text-3xl md:text-5xl font-bold leading-tight"
              style={{ color: '#FAF9F5' }}
            >
              {currentArticle.title}
            </h1>

            {/* Meta Row: Date, Read Time, Word Count, Category, Written by */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-2 text-xs text-[#87867F] font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" style={{ color: '#D97757' }} />
                {currentArticle.date || 'SITIVENT'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" style={{ color: '#788C5D' }} />
                {readTimeMinutes} menit baca
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" style={{ color: '#D97757' }} />
                {wordCount} kata
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" style={{ color: '#788C5D' }} />
                Ditulis oleh: {currentArticle.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & TOC Layout Grid */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Reader Card */}
          <main className="lg:col-span-9 bg-white rounded-2xl border border-[#D1CFC5] p-6 md:p-10 shadow-sm space-y-8">
            <div className="space-y-4">
              {currentArticle.cover && (
                <div className="w-full h-48 md:h-80 rounded-2xl overflow-hidden border border-[#D1CFC5]">
                  <img
                    src={currentArticle.cover}
                    alt={currentArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* TL;DR card if available */}
              {currentArticle.tldr && (
                <div
                  id="ringkasan"
                  className="border-l-4 border-[#D97757] bg-[#FAF9F5] p-4 rounded-r-lg"
                >
                  <div className="text-xs font-mono text-[#D97757] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Ringkasan Cepat
                  </div>
                  <p className="text-sm text-[#3D3D3A] leading-relaxed">
                    {currentArticle.tldr.split(' ').map((word, i) => {
                      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                      const jargonDef = currentArticle.jargon
                        ? currentArticle.jargon[cleanWord] ||
                          currentArticle.jargon[cleanWord.toLowerCase()]
                        : null;
                      if (jargonDef) {
                        return (
                          <span key={i} className="relative inline-block group">
                            <span
                              className="glossary-term text-[#D97757] cursor-help"
                              onMouseEnter={() => showTermDefinition(cleanWord, jargonDef)}
                              onMouseLeave={clearTermDefinition}
                            >
                              {word}
                            </span>{' '}
                            {hoveredTerm === cleanWord && (
                              <span className="glossary-popover">{hoveredTermDef}</span>
                            )}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Render Rich Body Content or Interactive Elements */}
            {currentArticle.isDb && currentArticle.content ? (
              <div
                id="konten-utama"
                className="prose max-w-none text-sm leading-relaxed text-[#3D3D3A]"
                dangerouslySetInnerHTML={{ __html: currentArticle.content }}
              />
            ) : (
              <>
                {/* Interactive Flowchart Process */}
                {currentArticle.flowchart && (
                  <div id="alur-proses" className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#87867F]">
                      Alur Proses Interaktif
                    </h3>
                    <div className="bg-[#FAF9F5] border border-[#D1CFC5] rounded-xl p-4 overflow-x-auto">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 min-w-[500px]">
                        {currentArticle.flowchart.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col md:flex-row items-center gap-2"
                          >
                            {/* Process box */}
                            <div
                              className={`flex-1 w-full p-3 rounded-lg border text-center transition-all hover:scale-102 hover:shadow ${
                                step.type === 'decision'
                                  ? 'bg-[#E3DACC]/30 border-[#D97757]'
                                  : 'bg-white border-[#D1CFC5]'
                              }`}
                              title={step.detail}
                            >
                              <div className="text-[9px] font-mono text-[#87867F] mb-1">
                                Langkah {idx + 1}
                              </div>
                              <div className="font-serif font-bold text-xs text-[#141413] line-clamp-1">
                                {step.label}
                              </div>
                              <div className="text-[9px] text-[#87867F] line-clamp-2 mt-1 leading-normal">
                                {step.detail}
                              </div>
                            </div>

                            {/* Arrow */}
                            {idx < currentArticle.flowchart!.length - 1 && (
                              <ChevronRight className="w-4 h-4 text-[#D97757] rotate-90 md:rotate-0 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: Detailed Steps Accordions */}
                {currentArticle.steps && (
                  <div id="langkah-langkah" className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#87867F]">
                      Langkah Demi Langkah
                    </h3>
                    <div className="space-y-3">
                      {currentArticle.steps.map((step, idx) => (
                        <details
                          key={idx}
                          className="border border-[#D1CFC5] rounded-xl bg-white overflow-hidden group"
                          open={idx === 0}
                        >
                          <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#FAF9F5] transition-colors select-none font-serif font-bold text-[#141413] text-sm md:text-base">
                            <span className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#D97757]/10 text-[#D97757] text-xs font-mono flex items-center justify-center">
                                {idx + 1}
                              </span>
                              {step.title}
                            </span>
                            <span className="font-mono text-[10px] text-[#87867F] bg-[#FAF9F5] px-2 py-0.5 border border-[#D1CFC5] rounded">
                              {step.location}
                            </span>
                          </summary>
                          <div className="px-4 pb-4 pt-1 border-t border-[#F0EEE6] text-[#3D3D3A] text-xs md:text-sm leading-relaxed bg-[#FAF9F5]/40">
                            {step.body}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Tabbed Code Blocks */}
                {currentArticle.tabs && (
                  <div id="implementasi-kode" className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#87867F]">
                      Contoh Implementasi Kode
                    </h3>
                    <div className="border border-[#D1CFC5] rounded-xl overflow-hidden bg-[#141413] text-[#FAF9F5]">
                      {/* Tab switcher */}
                      <div className="flex border-b border-[#3D3D3A] bg-[#212120]">
                        {currentArticle.tabs.map((tab, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTabIdx(idx)}
                            className={`px-4 py-2 text-xs font-mono border-r border-[#3D3D3A] cursor-pointer transition-all ${
                              activeTabIdx === idx
                                ? 'bg-[#141413] text-[#FAF9F5] border-b-2 border-b-[#D97757] font-semibold'
                                : 'text-[#87867F] hover:text-[#FAF9F5]'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Preformatted Code */}
                      <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed max-h-[300px]">
                        <code>{currentArticle.tabs[activeTabIdx]?.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Section 3: FAQ */}
                {currentArticle.faqs && (
                  <div id="faq" className="space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[#87867F]">
                      Pertanyaan Sering Diajukan (FAQ)
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentArticle.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="bg-[#FAF9F5] border border-[#D1CFC5] rounded-xl p-4 space-y-2"
                        >
                          <dt className="font-serif font-bold text-[#141413] text-sm flex items-start gap-2">
                            <span className="text-[#D97757] font-mono">Q:</span>
                            {faq.q}
                          </dt>
                          <dd className="text-xs text-[#3D3D3A] leading-relaxed pl-4">{faq.a}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-[#D1CFC5] p-5 shadow-xs">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#87867F] font-mono mb-4 border-b border-[#F0EEE6] pb-2">
                Daftar Isi
              </h4>
              <ul className="space-y-3">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-xs text-[#3D3D3A] hover:text-[#D97757] transition-all flex items-center gap-2 group font-semibold"
                    >
                      <ChevronRight className="w-3 h-3 text-[#D97757] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Markdown Copy Action */}
            <button
              onClick={handleCopyMarkdown}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#D1CFC5] bg-white hover:border-[#141413] hover:bg-[#FAF9F5] transition-all text-xs font-mono cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#788C5D]" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#D97757]" />
                  Salin Ringkasan (MD)
                </>
              )}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailClient;
