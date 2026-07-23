# Test Case: Admin Manual Scanner (TC044)

## Skenario Pengujian
Memastikan Admin / Panitia dapat memindai QR code tiket peserta menggunakan scanner kamera di `/admin/attendance/scan`.

## Prasyarat
- Panitia ter-login di `/admin/attendance/scan`.

## Kondisi
- **Input**: Kode QR / Token pendaftaran valid.
- **Output yang Diharapkan**:
  - Halaman hasil presensi sukses menampilkan nama peserta dan event.

## Langkah-Langkah Pengujian
1. Buka `/admin/attendance/scan`.
2. Pindai atau masukkan token tiket.
3. Verifikasi munculnya kartu hasil presensi sukses.
