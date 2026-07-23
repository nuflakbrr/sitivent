# Test Case: Payment Timeout Expiration (TC063)

## Skenario Pengujian
Memastikan pendaftaran berbayar yang tidak dibayar dalam batas waktu otomatis kadaluarsa.

## Prasyarat
- Pendaftaran berbayar melewati batas pembayaran.

## Kondisi
- **Input**: Batas waktu transfer habis.
- **Output yang Diharapkan**:
  - Status pendaftaran diubah menjadi `EXPIRED` / `CANCELLED`.

## Langkah-Langkah Pengujian
1. Verifikasi pendaftaran kadaluarsa.
