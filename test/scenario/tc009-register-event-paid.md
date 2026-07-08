# Test Case: Register to Paid Event (TC009)

## Skenario Pengujian
Memastikan peserta dapat melakukan pendaftaran pada event berbayar dan status registrasi awal diatur menjadi WAITING_PAYMENT.

## Prasyarat
- Event berstatus PUBLISHED dan harga event > 0 (berbayar).
- Peserta sudah masuk/login ke dalam sistem.

## Kondisi
- **Input**:
  - Event ID / Slug: `event-berbayar-1`
- **Output yang Diharapkan**:
  - Pendaftaran berhasil.
  - Status pendaftaran adalah `WAITING_PAYMENT` (karena membutuhkan transfer pembayaran).
  - Peserta diarahkan ke halaman instruksi pembayaran / unggah bukti transfer.

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta, lalu buka halaman detail event publik `/events/event-berbayar-1`.
2. Klik tombol "Daftar Event".
3. Konfirmasi pendaftaran.
4. Verifikasi notifikasi pendaftaran sukses.
5. Verifikasi halaman dialihkan ke instruksi pembayaran atau dashboard dengan status `WAITING_PAYMENT`.
