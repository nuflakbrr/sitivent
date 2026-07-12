import type { FC } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { genPageMetadata } from '@/app/seo';

export const metadata: Metadata = genPageMetadata({
  title: 'Kebijakan Privasi',
  description:
    'Baca kebijakan privasi Sitivent — bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.',
});

interface Section {
  id: string;
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    id: 'pengumpulan-data',
    title: '1. Data yang Kami Kumpulkan',
    content: [
      'Kami mengumpulkan data yang Anda berikan secara langsung ketika mendaftar akun, mendaftarkan diri ke event, atau menghubungi tim kami. Data tersebut meliputi: nama lengkap, alamat email, nomor telepon (opsional), dan informasi profil lainnya.',
      'Secara otomatis kami juga mengumpulkan data teknis seperti alamat IP, jenis perangkat, browser yang digunakan, halaman yang dikunjungi, serta waktu dan tanggal akses. Data ini digunakan untuk meningkatkan performa dan keamanan platform.',
      'Kami tidak mengumpulkan data sensitif seperti nomor rekening bank, informasi kartu kredit secara langsung — transaksi pembayaran diproses melalui penyedia pembayaran pihak ketiga yang tersertifikasi.',
    ],
  },
  {
    id: 'penggunaan-data',
    title: '2. Cara Kami Menggunakan Data',
    content: [
      'Data Anda digunakan untuk: mengelola akun dan memberikan akses ke layanan Sitivent, memproses pendaftaran event dan mengirimkan konfirmasi, mengirimkan notifikasi event yang relevan berdasarkan minat Anda, serta merespons pertanyaan dan permintaan dukungan.',
      'Kami menggunakan data agregat (non-identitas) untuk analisis internal guna meningkatkan kualitas platform, merekomendasikan event yang sesuai, dan mengembangkan fitur baru.',
      'Kami tidak menjual data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran tanpa persetujuan eksplisit Anda.',
    ],
  },
  {
    id: 'berbagi-data',
    title: '3. Berbagi Data dengan Pihak Ketiga',
    content: [
      'Kami dapat berbagi data Anda dengan penyelenggara event yang Anda daftarkan, sebatas data yang diperlukan untuk keperluan kehadiran dan administrasi event tersebut.',
      'Kami bekerja sama dengan penyedia layanan tepercaya (seperti layanan email, analitik, dan pembayaran) yang terikat perjanjian kerahasiaan dan hanya boleh menggunakan data Anda sesuai instruksi kami.',
      'Kami dapat mengungkapkan data jika diwajibkan oleh hukum atau peraturan yang berlaku di Indonesia, atau untuk melindungi hak, properti, dan keselamatan Sitivent maupun pengguna lain.',
    ],
  },
  {
    id: 'keamanan',
    title: '4. Keamanan Data',
    content: [
      'Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data pribadi Anda dari akses tidak sah, kehilangan, atau pengungkapan. Ini mencakup enkripsi data saat transit (HTTPS/TLS) dan penyimpanan password menggunakan algoritma hashing modern.',
      'Meskipun kami berupaya keras melindungi data Anda, tidak ada sistem yang sepenuhnya bebas risiko. Kami mendorong Anda untuk menggunakan password yang kuat dan tidak membagikan kredensial akun kepada siapapun.',
    ],
  },
  {
    id: 'hak-pengguna',
    title: '5. Hak-Hak Anda',
    content: [
      'Anda memiliki hak untuk: mengakses data pribadi yang kami simpan tentang Anda, meminta koreksi jika data Anda tidak akurat, meminta penghapusan akun dan data pribadi Anda (dengan catatan beberapa data mungkin tetap disimpan sesuai kewajiban hukum), serta mencabut persetujuan pengiriman notifikasi pemasaran kapan saja.',
      'Untuk menggunakan hak-hak di atas, silakan hubungi kami melalui halaman kontak atau email yang tertera di bagian bawah halaman ini.',
    ],
  },
  {
    id: 'cookie',
    title: '6. Cookie & Teknologi Pelacakan',
    content: [
      'Sitivent menggunakan cookie dan teknologi serupa untuk menjaga sesi login Anda, mengingat preferensi, serta memahami bagaimana pengguna berinteraksi dengan platform kami.',
      'Anda dapat mengatur browser untuk menolak cookie, namun hal ini dapat memengaruhi fungsionalitas tertentu di platform kami seperti kemampuan untuk tetap masuk (stay logged in).',
    ],
  },
  {
    id: 'perubahan',
    title: '7. Perubahan Kebijakan',
    content: [
      'Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform. Tanggal "terakhir diperbarui" di bagian atas halaman ini mencerminkan versi terkini.',
      'Penggunaan Sitivent setelah tanggal pembaruan dianggap sebagai persetujuan Anda terhadap kebijakan yang telah diubah.',
    ],
  },
  {
    id: 'kontak',
    title: '8. Hubungi Kami',
    content: [
      'Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait Kebijakan Privasi ini, silakan hubungi tim kami melalui halaman Kontak atau kirim email ke indevappfti@gmail.com.',
    ],
  },
];

const PrivacyPolicy: FC = () => {
  const lastUpdated = '12 Juli 2026';

  return (
    <div
      style={{
        background: '#FAF9F5',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        minHeight: '100vh',
      }}
    >
      {/* Hero */}
      <div
        style={{ background: '#141413', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        className="py-28 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{
              color: '#D97757',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Legal · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Kebijakan Privasi
          </h1>
          <p className="mt-4 text-base max-w-xl" style={{ color: '#87867F' }}>
            Kami berkomitmen melindungi data pribadi Anda. Halaman ini menjelaskan bagaimana
            Sitivent mengumpulkan, menggunakan, dan menjaga informasi Anda.
          </p>
          <div
            className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
            style={{
              borderColor: 'rgba(217,119,87,0.35)',
              color: '#D97757',
              background: 'rgba(217,119,87,0.08)',
            }}
          >
            Terakhir diperbarui: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-6 py-14 lg:flex lg:gap-12">
        {/* Sticky ToC — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div
            className="sticky top-20 rounded-2xl p-5 space-y-2"
            style={{ background: '#F0EEE6', border: '1.5px solid #E3DACC' }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{
                color: '#87867F',
                fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
              }}
            >
              Daftar Isi
            </p>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs py-1 px-2 rounded-lg transition-colors hover:bg-[#E3DACC]"
                style={{ color: '#3D3D3A' }}
              >
                {s.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 space-y-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-8">
              <h2 className="font-serif text-2xl font-bold mb-4" style={{ color: '#141413' }}>
                {s.title}
              </h2>
              <div className="space-y-3">
                {s.content.map((para, i) => (
                  <p key={i} className="text-base leading-relaxed" style={{ color: '#3D3D3A' }}>
                    {para}
                  </p>
                ))}
              </div>
              <div className="mt-8 h-px" style={{ background: '#E3DACC' }} />
            </section>
          ))}

          {/* Back links */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ color: '#87867F', border: '1.5px solid #E3DACC' }}
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
