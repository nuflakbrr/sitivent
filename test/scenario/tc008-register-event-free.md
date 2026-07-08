# Test Case: Register to Free Event (TC008)

## Skenario Pengujian
Memastikan peserta dapat melakukan pendaftaran pada event gratis dan status registrasi langsung terupdate menjadi REGISTERED.

## Prasyarat
- Event berstatus PUBLISHED dan harga event adalah 0 (gratis).
- Peserta sudah masuk/login ke dalam sistem.

## Kondisi
- **Input**:
  - Event ID / Slug: `event-gratis-1`
- **Output yang Diharapkan**:
  - Pendaftaran berhasil.
  - Status pendaftaran langsung menjadi `REGISTERED` (tanpa menunggu verifikasi pembayaran).
  - Peserta dialihkan ke halaman detail pendaftaran atau dashboard peserta dengan pesan sukses.

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta, lalu buka halaman detail event publik `/events/event-gratis-1`.
2. Klik tombol "Daftar Event".
3. Konfirmasi pendaftaran.
4. Verifikasi notifikasi pendaftaran sukses.
5. Di dashboard peserta, verifikasi status pendaftaran event tersebut adalah `REGISTERED`.
