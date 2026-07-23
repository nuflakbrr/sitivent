# Test Case: Public Certificate Verification (TC047)

## Skenario Pengujian
Memastikan publik dapat memverifikasi keabsahan sertifikat menggunakan kode verifikasi unik.

## Prasyarat
- Kode sertifikat sah tersedia.

## Kondisi
- **Input**: Buka `/verifications/CERT-CODE-123`.
- **Output yang Diharapkan**:
  - Informasi pemilik sertifikat, judul event, dan status keabsahan valid ditampilkan.

## Langkah-Langkah Pengujian
1. Buka `/verifications/CERT-CODE-123`.
2. Verifikasi rincian data keabsahan sertifikat.
