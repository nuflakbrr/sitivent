# Test Case: Self Checkin Verification (TC066)

## Skenario Pengujian
Memastikan peserta dapat melakukan presensi mandiri saat tombol presensi dibuka oleh admin.

## Prasyarat
- Event dalam jadwal pelaksanaan dan fitur presensi mandiri aktif.

## Kondisi
- **Input**: Klik "Presensi Sekarang".
- **Output yang Diharapkan**:
  - Status kehadiran berubah menjadi `ATTENDED`.

## Langkah-Langkah Pengujian
1. Buka dashboard peserta.
2. Klik tombol presensi mandiri.
3. Verifikasi notifikasi presensi berhasil.
