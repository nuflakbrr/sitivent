# Test Case: Database Connection Resiliency (TC100)

## Skenario Pengujian
Memastikan kegagalan koneksi basis data ditangani secara aman dengan pesan kesalahan bermakna tanpa membocorkan kredensial.

## Prasyarat
- Layanan basis data Prisma Client.

## Kondisi
- **Input**: Terjadi gangguan koneksi database.
- **Output yang Diharapkan**:
  - Aplikasi mengembalikan pesan "Terjadi kesalahan pada server" tanpa membocorkan detail sensitif.

## Langkah-Langkah Pengujian
1. Verifikasi penanganan kesalahan global pada Server Actions.
