# Test Case: QR Check-In Success (TC013)

## Skenario Pengujian
Memastikan scanner kehadiran (Admin/Staff) dapat melakukan absensi/check-in peserta menggunakan token QR Code yang valid, sehingga mengubah status registrasi peserta menjadi CHECKED_IN.

## Prasyarat
- Admin/Staff telah login dan berada di halaman scan QR `/admin/attendance/scan`.
- Peserta memiliki status pendaftaran `REGISTERED` dengan token QR yang valid.

## Kondisi
- **Input**:
  - Scan Input / Token QR: `valid-token-12345`
- **Output yang Diharapkan**:
  - Check-in berhasil divalidasi.
  - Status registrasi peserta berubah menjadi `CHECKED_IN`.
  - Waktu kehadiran tercatat.
  - Tampil toast / pesan sukses check-in di layar scanner.

## Langkah-Langkah Pengujian
1. Masuk sebagai admin/scanner, buka halaman scan absensi `/admin/attendance/scan`.
2. Masukkan / scan token QR `valid-token-12345`.
3. Klik "Kirim Token" (atau otomatis terkirim saat kamera scan mendeteksi).
4. Verifikasi muncul notifikasi sukses check-in dengan nama peserta bersangkutan.
5. Verifikasi waktu kehadiran dan data log absensi tercatat.
