# AI Agents Guidelines - SITIVENT

> Version: 1.0.0
>
> Author: Naufal Akbar Nugroho
>
> Project: SITIVENT
>
> Framework: Next.js 16 App Router
>
> Last Updated: 2026

Selamat datang di pedoman pengembangan AI SITIVENT. Dokumentasi ini dipecah menjadi beberapa bagian berikut untuk memudahkan pemeliharaan dan referensi:

## Menu Utama

1. **Tentang Project & Roadmap**
   - [PROJECT.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/PROJECT.md) - Tentang SITIVENT, deskripsi sistem, target event, dan rencana pengembangan di masa depan.

2. **Arsitektur & Setup**
   - [STACK.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/STACK.md) - Tech stack yang digunakan di project.
   - [ARCHITECTURE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/ARCHITECTURE.md) - Prinsip arsitektur dan Route Groups.
   - [FOLDER_STRUCTURE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/FOLDER_STRUCTURE.md) - Struktur folder dan pola struktur fitur.

3. **Konvensi & Standar Kode**
   - [CODING_STANDARDS.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/CODING_STANDARDS.md) - Aturan pengembangan umum, penamaan, import, React, form, dan validasi.
   - [TYPESCRIPT.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/TYPESCRIPT.md) - Aturan type safety dan interface.
   - [DATABASE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/DATABASE.md) - Konvensi database schema dan aturan query Prisma.
   - [SERVICES.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/SERVICES.md) - Aturan Service Layer, Server Actions, query caching (React Query), dan error handling.

4. **Modul Bisnis & Alur Kerja**
   - [FEATURES.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/FEATURES.md) - Daftar modul utama sistem.
   - [EVENT_MODULE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/EVENT_MODULE.md) - Alur kerja dan validasi modul Event.
   - [REGISTRATION_MODULE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/REGISTRATION_MODULE.md) - Alur kerja modul pendaftaran peserta.
   - [PAYMENT_MODULE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/PAYMENT_MODULE.md) - Alur kerja modul pembayaran dan verifikasi.
   - [ATTENDANCE_MODULE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/ATTENDANCE_MODULE.md) - Penanganan QR Code dan check-in kehadiran.
   - [CERTIFICATE_MODULE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/CERTIFICATE_MODULE.md) - Pembuatan dan distribusi sertifikat digital.
   - [EMAILS.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/EMAILS.md) - Arsitektur pengiriman email antrian.
   - [FILE_UPLOADS.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/FILE_UPLOADS.md) - Aturan upload file dan kompresi media.

5. **Keamanan, UI/UX, & Kinerja**
   - [AUTHORIZATION.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/AUTHORIZATION.md) - Autentikasi Better Auth dan PBAC (Permission-based Access Control).
   - [SECURITY.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/SECURITY.md) - Aturan keamanan umum, validasi input, dan sanitasi.
   - [UI_GUIDELINES.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/UI_GUIDELINES.md) - Pedoman UI/UX dasar dan SEO.
   - [COMPONENTS.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/COMPONENTS.md) - Komponen existing, layout form, data table, loading, dan empty states.
   - [PERFORMANCE.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/PERFORMANCE.md) - Aturan optimasi kinerja.

6. **Pengujian & Kontribusi**
   - [TESTING.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/TESTING.md) - Pedoman pengujian unit/integrasi.
   - [CONTRIBUTING.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/SKILLS/CONTRIBUTING.md) - Alur kerja kontribusi, aturan respons AI, batasan AI, dan konvensi git commit.
   - [VERSIONING.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/VERSIONING.md) - Aturan semantic versioning dan pembuatan changelog otomatis.
   - [DOCUMENTATION.md](file:///run/media/nuflakbrr/Daily/Projects/Indevpro/sitivent/PRD/DOCUMENTATION.md) - Cetak biru arsitektur global, workflow fitur baru, dan indeks fitur rinci.