# Test Case: QR Code Already Used Guard (TC014)

## Skenario Pengujian
Memastikan scanner kehadiran menolak upaya scan check-in jika QR Code yang dipindai sudah pernah digunakan sebelumnya (mencegah duplikasi absensi).

## Prasyarat
- Admin/Staff telah login dan berada di halaman scan QR `/admin/attendance/scan`.
- Peserta sudah terdaftar dan status registrasinya sudah `CHECKED_IN` (absensi sudah terekam).

## Kondisi
- **Input**:
  - Scan Input / Token QR: `used-token-99999`
- **Output yang Diharapkan**:
  - Check-in ditolak.
  - Tampil pesan error warning "QR_ALREADY_USED" atau "QR Code sudah digunakan" di layar scanner.

## Langkah-Langkah Pengujian
1. Masuk sebagai admin/scanner, buka halaman scan absensi `/admin/attendance/scan`.
2. Masukkan / scan token QR `used-token-99999`.
3. Klik "Kirim Token".
4. Verifikasi muncul notifikasi error / toast warning bertuliskan "QR Code sudah pernah digunakan" atau sejenisnya.
