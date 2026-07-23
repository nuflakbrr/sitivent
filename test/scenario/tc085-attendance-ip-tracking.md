# Test Case: Attendance IP Tracking (TC085)

## Skenario Pengujian
Memastikan IP address dan User Agent pemindai/peserta tercatat otomatis saat presensi kehadiran dilakukan.

## Prasyarat
- Presensi dilakukan.

## Kondisi
- **Input**: Presensi event.
- **Output yang Diharapkan**:
  - Kolom `ipAddress` dan `userAgent` pada tabel `Attendance` terisi.

## Langkah-Langkah Pengujian
1. Lakukan presensi.
2. Verifikasi rekaman IP Address dan User Agent di database.
