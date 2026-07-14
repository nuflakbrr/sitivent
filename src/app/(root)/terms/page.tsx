import type { FC } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';

export const metadata: Metadata = genPageMetadata({
  title: 'Syarat & Ketentuan',
  description:
    'Baca syarat dan ketentuan penggunaan platform Sitivent sebelum menggunakan layanan kami.',
});

interface Section {
  id: string;
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    id: 'penerimaan',
    title: '1. Penerimaan Syarat',
    content: [
      'Dengan mengakses atau menggunakan platform Sitivent (situs web, aplikasi, dan layanan terkait), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini secara penuh.',
      'Jika Anda tidak menyetujui salah satu ketentuan di sini, harap hentikan penggunaan layanan kami. Kami berhak memperbarui syarat ini kapan saja; penggunaan berkelanjutan setelah pembaruan dianggap sebagai persetujuan.',
    ],
  },
  {
    id: 'akun',
    title: '2. Akun Pengguna',
    content: [
      'Untuk menggunakan fitur tertentu di Sitivent, Anda perlu membuat akun. Anda bertanggung jawab menjaga kerahasiaan kredensial akun (email dan password) dan semua aktivitas yang terjadi di bawah akun Anda.',
      'Anda wajib memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar. Kami berhak menangguhkan atau menghapus akun yang terbukti menggunakan informasi palsu atau menyesatkan.',
      'Anda dilarang membuat akun untuk orang lain tanpa izin mereka, mengoperasikan beberapa akun secara bersamaan untuk tujuan yang tidak sah, atau mentransfer akun kepada pihak lain.',
    ],
  },
  {
    id: 'layanan',
    title: '3. Penggunaan Layanan',
    content: [
      'Sitivent adalah platform yang mempertemukan penyelenggara event dengan peserta. Kami menyediakan infrastruktur untuk mendaftarkan, mengelola, dan mengikuti berbagai jenis event — baik online maupun offline.',
      'Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan tidak melanggar hukum yang berlaku di Indonesia, hak pihak ketiga, atau ketentuan dalam dokumen ini.',
      'Dilarang keras: menyebarkan konten yang bersifat SARA, mengandung kebencian, pornografi, atau ilegal; melakukan scraping atau pengambilan data platform secara otomatis tanpa izin; mencoba mengeksploitasi kerentanan keamanan sistem kami.',
    ],
  },
  {
    id: 'event',
    title: '4. Pendaftaran & Pembatalan Event',
    content: [
      'Dengan mendaftar ke sebuah event melalui Sitivent, Anda tunduk pada syarat spesifik yang ditetapkan oleh penyelenggara event tersebut, termasuk kebijakan pembatalan dan pengembalian dana.',
      'Sitivent berfungsi sebagai perantara dan tidak bertanggung jawab atas kualitas, keamanan, atau penyelenggaraan event yang dibuat oleh pihak ketiga (penyelenggara independen).',
      'Jika terjadi pembatalan event oleh penyelenggara, proses pengembalian dana (jika ada) akan dilakukan sesuai kebijakan penyelenggara. Kami akan memfasilitasi komunikasi namun tidak memiliki kewajiban pengembalian dana atas nama penyelenggara.',
    ],
  },
  {
    id: 'konten',
    title: '5. Konten Pengguna',
    content: [
      'Anda tetap memiliki hak cipta atas konten yang Anda unggah ke Sitivent (foto profil, deskripsi, ulasan, dll). Dengan mengunggah konten tersebut, Anda memberikan Sitivent lisensi non-eksklusif, bebas royalti, untuk menampilkan, mendistribusikan, dan mempromosikan konten tersebut dalam konteks operasional platform.',
      'Anda bertanggung jawab penuh atas konten yang Anda bagikan dan memastikan bahwa konten tersebut tidak melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak lain.',
    ],
  },
  {
    id: 'pembayaran',
    title: '6. Pembayaran & Biaya',
    content: [
      'Beberapa event di Sitivent mungkin dikenakan biaya pendaftaran. Semua transaksi diproses melalui penyedia pembayaran pihak ketiga yang telah diverifikasi. Sitivent tidak menyimpan data kartu kredit atau informasi rekening bank Anda.',
      'Semua harga yang ditampilkan sudah termasuk pajak yang berlaku kecuali dinyatakan lain. Bukti pembayaran akan dikirimkan melalui email yang terdaftar.',
    ],
  },
  {
    id: 'kekayaan-intelektual',
    title: '7. Hak Kekayaan Intelektual',
    content: [
      'Seluruh konten, desain, logo, merek dagang, dan kode platform Sitivent adalah milik atau dilisensikan kepada Sitivent dan dilindungi oleh hukum hak cipta yang berlaku.',
      'Anda tidak diperkenankan menyalin, mendistribusikan, memodifikasi, atau membuat karya turunan dari aset platform kami tanpa izin tertulis dari Sitivent.',
    ],
  },
  {
    id: 'batasan-tanggung-jawab',
    title: '8. Batasan Tanggung Jawab',
    content: [
      'Sitivent disediakan "sebagaimana adanya" tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa platform akan selalu tersedia, bebas kesalahan, atau memenuhi ekspektasi tertentu.',
      'Sepanjang diizinkan oleh hukum yang berlaku, Sitivent tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.',
    ],
  },
  {
    id: 'penghentian',
    title: '9. Penghentian Layanan',
    content: [
      'Kami berhak menangguhkan atau menghentikan akses Anda ke Sitivent kapan saja jika Anda melanggar Syarat & Ketentuan ini, tanpa pemberitahuan sebelumnya dan tanpa kewajiban ganti rugi.',
      'Anda dapat menghapus akun Anda kapan saja melalui pengaturan profil. Penghapusan akun tidak otomatis membatalkan pendaftaran event yang sudah terkonfirmasi.',
    ],
  },
  {
    id: 'hukum',
    title: '10. Hukum yang Berlaku',
    content: [
      'Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan terlebih dahulu melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri yang berwenang di Indonesia.',
    ],
  },
  {
    id: 'kontak',
    title: '11. Kontak',
    content: [
      'Pertanyaan terkait Syarat & Ketentuan ini dapat diajukan melalui halaman Kontak kami atau melalui email indevappfti@gmail.com. Kami berupaya merespons dalam 3 hari kerja.',
    ],
  },
];

const TermsConditions: FC = () => {
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
              color: '#788C5D',
              fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
            }}
          >
            Legal · Sitivent
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: '#FAF9F5' }}
          >
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-4 text-base max-w-xl" style={{ color: '#87867F' }}>
            Dengan menggunakan platform Sitivent, Anda menyetujui syarat dan ketentuan berikut.
            Harap baca dengan seksama sebelum menggunakan layanan kami.
          </p>
          <div
            className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border"
            style={{
              borderColor: 'rgba(120,140,93,0.35)',
              color: '#788C5D',
              background: 'rgba(120,140,93,0.08)',
            }}
          >
            Terakhir diperbarui: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Content */}
          <article className="lg:col-span-9 bg-white rounded-2xl border border-[#D1CFC5] p-6 md:p-10 shadow-sm space-y-12">
            {/* Intro box */}
            <div
              className="rounded-2xl p-5"
              style={{ background: '#F0EEE6', border: '1.5px solid #E3DACC' }}
            >
              <p className="text-sm leading-relaxed" style={{ color: '#3D3D3A' }}>
                <strong>Penting:</strong> Dokumen ini merupakan perjanjian hukum antara Anda dan
                Sitivent. Dengan mendaftar atau menggunakan layanan kami, Anda dianggap telah
                membaca dan menyetujui seluruh ketentuan di bawah ini.
              </p>
            </div>

            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
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

          {/* Sticky ToC — desktop */}
          <aside className="lg:col-span-3 lg:sticky lg:top-20 hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-[#D1CFC5] p-5 shadow-xs">
              <p
                className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-[#F0EEE6] pb-2"
                style={{
                  color: '#87867F',
                  fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                }}
              >
                Daftar Isi
              </p>
              <ul className="space-y-3">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-xs text-[#3D3D3A] hover:text-[#D97757] transition-all flex items-center gap-2 group font-semibold"
                    >
                      <ChevronRight className="w-3 h-3 text-[#D97757] opacity-0 group-hover:opacity-100 transition-opacity" />
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
