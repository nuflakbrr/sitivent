# Dokumentasi Fitur: Optimasi Lighthouse, Kinerja, SEO, & Aksesibilitas - SITIVENT

Dokumen ini menjelaskan strategi teknis dan arsitektur pengoptimalan yang diimplementasikan pada halaman publik untuk mencapai skor Lighthouse maksimal di seluruh kategori (Kinerja, Aksesibilitas, Praktik Terbaik, dan SEO).

---

## 1. Kinerja (Performance)

Kinerja dioptimalkan melalui beberapa teknik rendering dan optimasi aset:

* **Incremental Static Regeneration (ISR)**:
  - Mengubah metode rendering halaman utama list event publik dari `force-dynamic` menjadi ISR dengan interval `revalidate = 300` (5 menit) jika data event tidak sering berubah secara real-time.
  - Hal ini memangkas metrik TTFB (Time to First Byte) secara signifikan dengan memuat halaman dari cache HTML server alih-alih melakukan kueri database penuh di setiap request.

* **Image Optimization (Next.js Image)**:
  - Menggunakan komponen `<Image>` bawaan Next.js untuk merender banner-banner event.
  - Komponen secara otomatis mengompresi gambar ke WebP/AVIF di server dan menyesuaikan resolusi gambar secara dinamis berdasarkan ukuran layar pengguna.

* **Lazy Loading & Suspense**:
  - Untuk komponen berat seperti QR Scanner modal, Recharts di dashboard, atau Rich Text Editor, pemuatan dilakukan menggunakan `next/dynamic` dengan opsi `ssr: false` agar bundel JavaScript utama tetap kecil.
  - Memanfaatkan `<Suspense>` untuk menampilkan skeleton loaders yang mulus saat komponen asinkron dimuat.

---

## 2. Aksesibilitas (Accessibility)

Memperbaiki kualitas aksesibilitas untuk pengguna berkebutuhan khusus:
* **Hierarki Heading**: Setiap halaman dipastikan memiliki tepat satu tag `<h1>` yang diikuti oleh `<h2>` dan `<h3>` secara runtut tanpa melompati tingkatan heading.
* **Touch Target Size**: Seluruh tombol interaktif (tombol pendaftaran, navigasi, dot pagination) memiliki ukuran minimal `44x44px` untuk memudahkan interaksi sentuh pada perangkat seluler.
* **Aria Attributes**: Menyertakan `aria-label` yang deskriptif pada elemen tombol berupa ikon (seperti tombol scan QR, tombol close dialog, atau dark mode toggle) agar dapat dibaca dengan benar oleh Screen Reader.

---

## 3. Search Engine Optimization (SEO)

* **robots.txt & Sitemaps**:
  - Generator `robots.ts` mengembalikan konfigurasi sitemap yang terarah secara dinamis.
  - Menggunakan API Metadata bawaan Next.js untuk menulis tag-tag meta deskripsi, OpenGraph, Twitter Card, dan Canonical URL yang tepat pada halaman landing event.
* **Sitemap Route Filtering**:
  - Halaman administratif dan rute CMS internal (`/admin/*` dan `/participant/*`) dikecualikan dari berkas `sitemap.xml` agar tidak diindeks oleh bot mesin pencari publik demi keamanan data.
