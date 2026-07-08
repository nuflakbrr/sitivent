# Test Case: Verify Payment Success by Admin (TC012)

## Skenario Pengujian
Memastikan administrator dapat memverifikasi pembayaran transfer manual peserta dan menyetujui transaksi pembayaran, sehingga mengubah status registrasi peserta menjadi REGISTERED.

## Prasyarat
- Admin telah berhasil login ke sistem.
- Terdapat peserta yang status pembayarannya sedang `WAITING` dengan bukti transfer terlampir.

## Kondisi
- **Input**:
  - Aksi: Klik tombol "Setujui Pembayaran" (Approve)
- **Output yang Diharapkan**:
  - Status pembayaran berubah dari `WAITING` menjadi `PAID`.
  - Status registrasi peserta berubah dari `WAITING_PAYMENT` menjadi `REGISTERED`.
  - Tampil toast sukses verifikasi.
  - Perubahan dicatat dalam audit log pembayaran di server.

## Langkah-Langkah Pengujian
1. Masuk sebagai admin, buka daftar pembayaran `/admin/payments`.
2. Temukan bar pendaftaran peserta yang berstatus menunggu verifikasi.
3. Klik tombol aksi / detail pembayaran.
4. Klik tombol "Setujui Pembayaran" (Approve).
5. Verifikasi toast notifikasi sukses verifikasi.
6. Verifikasi status pembayaran berubah menjadi `PAID` dan registrasi peserta ter-update ke `REGISTERED`.
