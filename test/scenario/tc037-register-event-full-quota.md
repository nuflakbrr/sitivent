# Test Case: Register Event Full Quota Block (TC037)

## Skenario Pengujian
Memastikan pendaftaran event ditolak ketika kuota peserta event sudah penuh.

## Prasyarat
- Event berstatus aktif namun sisa kuota = 0.

## Kondisi
- **Input**: Klik "Daftar Sekarang" pada event penuh.
- **Output yang Diharapkan**:
  - Tombol pendaftaran dinonaktifkan atau muncul pesan "Kuota event sudah penuh".

## Langkah-Langkah Pengujian
1. Buka halaman detail event yang kuotanya habis `/events/slug-event-penuh`.
2. Verifikasi tombol "Kuota Penuh" atau pesan peringatan kuota habis.
