# Test Case: Upload Payment Proof (TC011)

## Skenario Pengujian
Memastikan peserta yang telah mendaftar ke event berbayar dapat mengunggah berkas bukti transfer pembayaran dengan format dan ukuran file yang valid.

## Prasyarat
- Peserta sudah masuk ke dalam sistem.
- Peserta memiliki pendaftaran event berbayar yang berstatus `WAITING_PAYMENT`.

## Kondisi
- **Input**:
  - File Bukti Transfer: `bukti_transfer.png` (Format PNG, ukuran 150 KB)
- **Output yang Diharapkan**:
  - Bukti pembayaran berhasil diunggah.
  - Status pembayaran berubah dari `WAITING` (bukti kosong) menjadi `WAITING` (menunggu verifikasi admin dengan bukti terunggah).
  - Tampil toast sukses.

## Langkah-Langkah Pengujian
1. Masuk sebagai peserta, buka dashboard peserta `/participant/dashboard`.
2. Klik tombol "Unggah Bukti" pada event berbayar yang bersangkutan.
3. Unggah file bukti pembayaran `bukti_transfer.png` melalui input file yang tersedia.
4. Klik tombol "Kirim Bukti".
5. Verifikasi munculnya toast notifikasi pengunggahan bukti pembayaran berhasil.
