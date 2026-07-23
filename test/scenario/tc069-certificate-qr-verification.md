# Test Case: Certificate QR Verification Redirect (TC069)

## Skenario Pengujian
Memastikan QR code yang tercetak pada berkas PDF sertifikat mengarah ke URL validasi publik `/verifications/[code]`.

## Prasyarat
- Berkas PDF sertifikat publik.

## Kondisi
- **Input**: Scan QR Code pada berkas sertifikat.
- **Output yang Diharapkan**:
  - Halaman verifikasi publik menampilkan status validitas sertifikat.

## Langkah-Langkah Pengujian
1. Akses URL verifikasi publik dari kode QR sertifikat.
2. Verifikasi halaman konfirmasi validitas sertifikat.
