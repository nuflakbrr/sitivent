# Test Case: Reject Payment Proof (TC021)

## Skenario Pengujian
Memastikan Admin dapat menolak bukti pembayaran peserta yang tidak sesuai.

## Prasyarat
- Admin ter-login dan berada di halaman manajemen transaksi `/admin/transactions/payments`.
- Terdapat pendaftaran berbayar berstatus `PENDING`.

## Kondisi
- **Input**:
  - Alasan penolakan: `Bukti transfer tidak terbaca`
- **Output yang Diharapkan**:
  - Status pembayaran berubah menjadi `REJECTED` / `FAILED`.
  - Notifikasi pembatalan/penolakan berhasil dikirim.

## Langkah-Langkah Pengujian
1. Buka `/admin/transactions/payments`.
2. Pilih transaksi status `PENDING` dan klik aksi "Tolak".
3. Masukkan alasan penolakan `Bukti transfer tidak terbaca`.
4. Konfirmasi penolakan.
5. Verifikasi status pembayaran diperbarui.
