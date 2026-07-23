# Test Case: Create Event Invalid Dates (TC033)

## Skenario Pengujian
Memastikan pembuatan event gagal apabila tanggal selesai lebih awal dibanding tanggal mulai.

## Prasyarat
- Admin ter-login di `/admin/master/events/create`.

## Kondisi
- **Input**:
  - Tanggal Mulai: `2026-10-10`
  - Tanggal Selesai: `2026-10-05`
- **Output yang Diharapkan**:
  - Validasi form gagal dengan pesan "Tanggal selesai tidak boleh sebelum tanggal mulai".

## Langkah-Langkah Pengujian
1. Buka formulir pembuatan event.
2. Masukkan tanggal mulai `2026-10-10` dan tanggal selesai `2026-10-05`.
3. Klik tombol "Simpan".
4. Verifikasi kemunculan notifikasi/pesan validasi error.
