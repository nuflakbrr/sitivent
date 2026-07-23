# Test Case: Checkin Unpaid User Block (TC042)

## Skenario Pengujian
Memastikan peserta berbayar yang belum melunasi pembayaran tidak dapat melakukan presensi kehadiran.

## Prasyarat
- Pendaftaran peserta berstatus pembayaran `PENDING` atau `UNPAID`.

## Kondisi
- **Input**: Scan / presensi QR Code event.
- **Output yang Diharapkan**:
  - Presensi ditolak dengan pesan "Pembayaran belum dikonfirmasi/lunas".

## Langkah-Langkah Pengujian
1. Lakukan presensi untuk peserta berstatus unpaid.
2. Verifikasi pesan penolakan presensi.
