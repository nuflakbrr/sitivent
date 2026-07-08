# Test Case: Create Event Success (TC006)

## Skenario Pengujian
Memastikan admin dapat membuat event offline baru dengan mengisi seluruh data form yang wajib secara lengkap dan valid.

## Prasyarat
- Admin telah berhasil login dan berada di halaman form pembuatan event `/admin/events/new`.

## Kondisi
- **Input**:
  - Judul Event: `Seminar AI Terapan`
  - Slug: `seminar-ai-terapan`
  - Deskripsi: `Seminar membahas penerapan kecerdasan buatan dalam industri.`
  - Tipe Event: `OFFLINE`
  - Lokasi: `Auditorium Kampus A`
  - Kuota: `100`
  - Harga: `50000`
  - Tanggal Mulai: `2026-10-10`
  - Tanggal Selesai: `2026-10-10`
  - Jam Mulai: `09:00`
  - Jam Selesai: `12:00`
  - Deadline Pendaftaran: `2026-10-09`
- **Output yang Diharapkan**:
  - Event berhasil dibuat dan berstatus DRAFT.
  - Tampil toast sukses.
  - Pengguna dialihkan kembali ke daftar event `/admin/events`.

## Langkah-Langkah Pengujian
1. Masuk ke halaman form `/admin/events/new`.
2. Isi field judul, slug, deskripsi, lokasi, kuota, harga, tanggal mulai/selesai, jam mulai/selesai, dan deadline pendaftaran.
3. Klik tombol "Simpan Event".
4. Verifikasi notifikasi sukses muncul di layar.
5. Verifikasi pengalihan halaman ke `/admin/events`.
