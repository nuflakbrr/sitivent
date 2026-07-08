# Cetak Biru Arsitektur & Panduan Dokumentasi Fitur - SITIVENT

Dokumen ini berfungsi sebagai peta navigasi utama dan pedoman pengembangan untuk programmer dan AI Agent dalam memahami arsitektur, tech stack, alur kerja pengembangan, serta struktur fitur di proyek **SITIVENT**.

Dokumentasi detail untuk setiap fitur spesifik disimpan dalam folder [docs/features/](docs/features/).

---

## 1. Teknologi Stack (Tech Stack)

Aplikasi dibangun menggunakan arsitektur Next.js Fullstack dengan teknologi pendukung berikut:

* **Core Framework**: [Next.js 16](https://nextjs.org/) (App Router) dengan dukungan **React 19** untuk performa optimal.
* **Database & ORM**: [Prisma ORM 7](https://www.prisma.io/) dengan database **PostgreSQL** untuk pooling koneksi.
* **Authentication**: [Better Auth](https://better-auth.com/) untuk alur login, session management, pembatasan sesi, serta pengelolaan role & permission.
* **Styling & UI**: 
  * [Tailwind CSS v4](https://tailwindcss.com/) untuk pemrosesan CSS modern super cepat.
  * [Shadcn UI](https://ui.shadcn.com/) dan `@radix-ui` untuk fondasi komponen UI yang aksesibel.
  * `@base-ui/react` untuk headless components tambahan.
  * `lucide-react` sebagai library ikon standar.
* **State Management & Data Querying**: [TanStack Query v5](https://tanstack.com/query/latest) untuk sinkronisasi state client-server secara asinkron.
* **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) terintegrasi dengan [Zod](https://zod.dev/) untuk type-safe validation resolver.
* **Rich Text Editor**: **Tiptap Editor Suite** untuk deskripsi event yang kaya fitur.
* **Media & File Processing**: [Sharp](https://sharp.pixelplumbing.com/) untuk kompresi gambar otomatis ke WebP di server.

---

## 2. Arsitektur Proyek (Project Architecture)

Aplikasi diatur berdasarkan pola modular dan *Route Groups* Next.js:

```text
src/
├── app/                      # Next.js App Router Pages & Layouts
│   ├── (auth)/               # Rute Otentikasi (login, register, dsb)
│   ├── (admin)/              # Panel Admin (dashboard admin)
│   ├── (participant)/        # Panel Admin (dashboard peserta)
│   └── (root)/               # Halaman Publik / Client-facing (home, detail event)
├── components/               # Komponen Reusable global (UI, layout, dsb)
├── hooks/                    # Custom React Hooks
├── interfaces/               # Tipe Kontrak TypeScript (Fitur-fitur)
├── lib/                      # Inisialisasi Library (Prisma Client, Better Auth, db)
├── providers/                # Provider Global (Permission, Theme, Query Client)
├── proxy.ts                  # Next.js 16 Router Proxy untuk Route Protection
├── schemas/                  # Skema Validasi Zod (Fitur-fitur)
├── services/                 # Server Actions untuk operasi database & Security logic
└── types/                    # Augmentasi Type TypeScript global
```

### Keamanan & Otorisasi
1. **Route Protection (Proxy Level)**: Rute CMS diproteksi secara dinamis oleh [src/proxy.ts](src/proxy.ts). Proxy memvalidasi cookie sesi Better Auth secara internal, melakukan pengecekan hak akses, dan membandingkan expiry date sesi terhadap waktu saat ini.
2. **Action Protection (Server Level)**: Setiap Server Action di dalam `src/services/` dilindungi menggunakan helper `verifyPermission('feature.action')`.
3. **UI Guard (Client Level)**: Tombol aksi, opsi dropdown, dan tautan navigasi disembunyikan/dinonaktifkan secara dinamis di sisi klien menggunakan hook `usePermission()`.

---

## 3. Alur Kerja Pengembangan Fitur Baru (Step-by-Step Feature Workflow)

Jika Anda ditugaskan untuk menambahkan atau memodifikasi fitur di proyek ini, ikuti alur kerja sistematis berikut:

### Langkah 1: Pembuatan Model Database & Seeding
1. Definisikan tabel baru Anda di [prisma/schema.prisma](prisma/schema.prisma). Gunakan penamaan tabel snake_case melalui direktif `@@map`.
2. Generate Prisma client dan jalankan migrasi database:
   ```bash
   pnpm prisma migrate dev --name nama_migrasi
   ```
3. Daftarkan hak akses (permissions) baru yang dibutuhkan modul di [prisma/seed.ts](prisma/seed.ts) dan jalankan `pnpm prisma db seed`.

### Langkah 2: Pembuatan Tipe Kontrak & Validasi Zod
1. Buat file interface TypeScript baru di `src/interfaces/features/[feature].ts` untuk mendefinisikan struktur input data, database record, dan format paginated response.
2. Buat skema validasi Zod di `src/schemas/[feature].ts`. Pastikan setiap input form divalidasi dengan pesan error yang human-readable dalam Bahasa Indonesia.

### Langkah 3: Implementasi Server Actions (Services)
1. Buat service CRUD di `src/services/[feature].ts` menggunakan fungsi asinkron (Server Actions).
2. Terapkan validasi backend:
   * **Keamanan**: Jalankan `await verifyPermission('feature.action')` di bagian paling atas fungsi.
   * **Keunikan Data (Uniqueness)**: Cek duplikasi record di database secara case-insensitive menggunakan Prisma `.findFirst()` sebelum melakukan `create` atau `update`.
   * **Integritas Relasi**: Untuk field relasi opsional (nullable), konversi string kosong `""` menjadi `null` sebelum disubmit ke database.
3. Jalankan `revalidatePath` untuk membersihkan cache halaman Next.js.

### Langkah 4: Registrasi Menu & Breadcrumbs
1. Daftarkan rute baru Anda di file konfigurasi navigasi dengan menyertakan hak akses `permission` yang dibutuhkan.
2. Tambahkan resolver label untuk segmen rute dinamis (UUID/slug) di `src/services/labels.ts` agar breadcrumb dapat menampilkan judul data asli secara human-readable.

### Langkah 5: Pembuatan UI Form & List Table
1. Buat folder halaman di `src/app/(cms)/admin/[module]/[feature]/` sesuai pedoman struktur folder di `FOLDER_STRUCTURE.md`.
2. Buat file `page.tsx` utama untuk merender komponen `DataTable` (menggunakan data fetching TanStack Query).
3. Buat file `Columns.tsx` dan `CellAction.tsx` di folder `_components/` untuk mengatur tata letak kolom tabel dan dropdown aksi.
4. Buat subfolder `[name]/` untuk detail page (untuk create mode dengan param `new` dan edit mode dengan param ID). Hubungkan data awal dengan form utama `[Feature]Form.tsx`.
5. Gunakan custom hooks untuk memisahkan logika submission form, query mutations, toast notifications (Sonner), dan routing redirects.

---

## 4. Kebijakan Manajemen Media & File

CMS ini menggunakan library Sharp di server untuk mengompresi asset gambar secara otomatis menjadi format WebP demi efisiensi bandwidth:

1. **Upload Target**: File diupload ke folder `public/uploads/[feature]`.
2. **Media Cleanup**: Saat media/file dihapus, panggil helper pembersih untuk menghapus file fisik di penyimpanan lokal guna menjaga kapasitas disk agar tidak menumpuk.
3. **Format Support**: Format yang diizinkan untuk banner/avatar adalah JPG, PNG, dan WebP, sedangkan template sertifikat menggunakan format PDF.

---

## 5. Indeks Dokumentasi Fitur (`docs/features/`)

Untuk memahami logika fungsional internal dari setiap modul yang sudah ada, silakan baca dokumentasi detail berikut:

1. **[Autentikasi & Otorisasi](docs/features/authentication.md)** - Logika Better Auth, Proxy middleware, dan Permission-Based Access Control (PBAC).
2. **[Manajemen Event](docs/features/events.md)** - Pengelolaan kuota, alur pembuatan draf, penerbitan event, dan validasi deadline event.
3. **[Pendaftaran Peserta](docs/features/registrations.md)** - Logika pembatasan satu user per event, validasi kuota, pendaftaran gratis vs berbayar.
4. **[Pembayaran & Transaksi](docs/features/payments.md)** - Flow verifikasi pembayaran manual oleh admin, audit logs transaksi, dan penanganan refund.
5. **[Kehadiran & QR Code](docs/features/attendance.md)** - Pembuatan token QR unik, alur scan kehadiran offline, validasi status kehadiran peserta.
6. **[Sertifikat Digital](docs/features/certificates.md)** - Pembuatan template dinamis, rendering sertifikat PDF otomatis untuk peserta yang check-in.
7. **[Arsitektur Email & Antrean](docs/features/emails.md)** - Queue system pengiriman email notifikasi otomatis, attachment QR, dan PDF sertifikat.
8. **[Optimasi SEO & Aksesibilitas](docs/features/seo-accessibility.md)** - Penanganan metadata halaman publik, robots, sitemap, aria-label, dan heading hierarchy.
9. **[Dashboard CMS Panel](docs/features/dashboard.md)** - Card statistik administrator (omzet, check-in, event terpopuler) dan dashboard detail peserta.